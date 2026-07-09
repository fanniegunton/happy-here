import { createClient, type SanityClient } from '@sanity/client';
import { randomUUID } from 'node:crypto';
import { requireEnv } from './config';
import type {
  DownloadedMedia,
  ExtractionResult,
  IntakeChannel,
  SubmissionChannel,
  VenueListEntry,
} from './types';

// Write-capable client for the intake pipeline. Mirrors the conventions of
// src/lib/sanity.ts (apiVersion, projectId/dataset env names) but reads
// process.env — Netlify functions don't go through Vite, so import.meta.env
// isn't available here. Uses SANITY_API_TOKEN (write access) rather than the
// site's read token, and the 'raw' perspective so the duplicate check can see
// draft submissions.
let client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!client) {
    client = createClient({
      projectId: requireEnv('SANITY_PROJECT_ID'),
      dataset: requireEnv('SANITY_DATASET'),
      apiVersion: '2024-01-01',
      useCdn: false,
      token: requireEnv('SANITY_API_TOKEN'),
      perspective: 'raw',
    });
  }
  return client;
}

// blockedSender.channel uses the venueSubmission channel values, so a Twilio
// sender may be blocked under either "sms" or "mms". New channels add their
// mapping here.
function blockChannels(channel: IntakeChannel): SubmissionChannel[] {
  switch (channel) {
    case 'twilio':
      return ['sms', 'mms'];
  }
}

export async function isSenderBlocked(
  channel: IntakeChannel,
  senderId: string
): Promise<boolean> {
  const query = `count(*[_type == "blockedSender" && active == true && identifier == $identifier && channel in $channels])`;
  const count = await getSanityClient().fetch<number>(query, {
    identifier: senderId,
    channels: blockChannels(channel),
  });
  return count > 0;
}

// Auto-block a sender who tripped the burst threshold. Written as a published
// document (blockedSender is moderation state, not content) so it takes
// effect immediately and shows up in the dashboard.
export async function autoBlockSender(
  channel: IntakeChannel,
  senderId: string,
  reason: string
): Promise<void> {
  await getSanityClient().create({
    _type: 'blockedSender',
    identifier: senderId,
    // The channel's primary display value (a Twilio block covers sms + mms
    // either way — see blockChannels).
    channel: blockChannels(channel)[0],
    reason,
    active: true,
    blockedAt: new Date().toISOString(),
  });
}

export async function getVenueList(): Promise<VenueListEntry[]> {
  const query = `*[_type == "establishment" && !(_id in path("drafts.**"))] | order(name asc) {
    _id,
    name,
    "neighborhood": neighborhood {
      region,
      "subNeighborhood": coalesce(
        subNeighborhoodDowntown, subNeighborhoodCentral, subNeighborhoodEast,
        subNeighborhoodNorth, subNeighborhoodNortheast, subNeighborhoodNorthwest,
        subNeighborhoodSouthCentral, subNeighborhoodSoutheast,
        subNeighborhoodSouthwest, subNeighborhoodWest
      )
    }
  }`;
  return getSanityClient().fetch<VenueListEntry[]>(query);
}

export interface RecentSubmission {
  _id: string;
  rawText: string | null;
  specialsGuess: string | null;
}

// Pending submissions for the same matched venue inside the lookback window.
// Includes drafts (every submission is a draft) via the raw perspective.
export async function getRecentPendingSubmissions(
  venueId: string,
  since: string
): Promise<RecentSubmission[]> {
  const query = `*[_type == "venueSubmission"
    && status == "pending"
    && extraction.matchedVenue._ref == $venueId
    && receivedAt > $since
  ] { _id, rawText, "specialsGuess": extraction.specialsGuess }`;
  return getSanityClient().fetch<RecentSubmission[]>(query, { venueId, since });
}

export async function uploadImageAsset(media: DownloadedMedia): Promise<string> {
  const asset = await getSanityClient().assets.upload('image', media.data, {
    filename: media.filename,
    contentType: media.contentType,
  });
  return asset._id;
}

export interface CreateSubmissionInput {
  channel: SubmissionChannel;
  fromIdentifier: string;
  receivedAt: string;
  rawText: string;
  imageAssetIds: string[];
  extraction: ExtractionResult;
  duplicateOfId: string | null;
}

// Every submission is created as a draft — the `drafts.` prefix is a hard
// rule, with no confidence-based auto-publish.
export async function createSubmissionDraft(input: CreateSubmissionInput): Promise<string> {
  const doc = {
    _id: `drafts.${randomUUID()}`,
    _type: 'venueSubmission',
    channel: input.channel,
    fromIdentifier: input.fromIdentifier,
    receivedAt: input.receivedAt,
    rawText: input.rawText,
    media: input.imageAssetIds.map((assetId) => ({
      _type: 'image',
      _key: randomUUID().slice(0, 12),
      asset: { _type: 'reference', _ref: assetId },
    })),
    extraction: {
      venueNameGuess: input.extraction.venueNameGuess ?? undefined,
      matchedVenue: input.extraction.matchedVenueId
        ? { _type: 'reference', _ref: input.extraction.matchedVenueId, _weak: true }
        : undefined,
      isNewVenueGuess: input.extraction.isNewVenueGuess,
      neighborhoodGuess: input.extraction.neighborhoodGuess ?? undefined,
      specialsGuess: input.extraction.specialsGuess ?? undefined,
      confidenceScore: input.extraction.confidenceScore,
    },
    // References use canonical ids — the duplicate query returns draft _ids
    // (every submission is a draft), so strip the prefix; the Studio resolves
    // the draft from the canonical id.
    duplicateOf: input.duplicateOfId
      ? {
          _type: 'reference',
          _ref: input.duplicateOfId.replace(/^drafts\./, ''),
          _weak: true,
        }
      : undefined,
    status: 'pending',
  };

  const created = await getSanityClient().create(doc);
  return created._id;
}
