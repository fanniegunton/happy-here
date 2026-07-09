// Shared shapes for the intake pipeline.
//
// IntakeChannel identifies the transport a message arrived on and keys all
// Redis state ({channel}:{senderId}). It is deliberately distinct from the
// venueSubmission `channel` field, which is a display value derived at write
// time (the schema in happy-here-sanity defines more values than we emit).
// Adding a new channel (e.g. WhatsApp) means widening these unions and adding
// a normalizer that produces a NormalizedMessage — the batching, rate-limit,
// and extraction layers never branch on channel.

export type IntakeChannel = 'twilio';

export type SubmissionChannel = 'sms' | 'mms';

// A media attachment as referenced by its source channel, as a discriminated
// union keyed on `kind` (new channels add a variant). Downloading is deferred
// until the batch window closes (Twilio media URLs need basic auth — handled
// in media.ts).
export type MediaRef = { kind: 'twilio'; url: string; contentType: string };

export interface NormalizedMessage {
  channel: IntakeChannel;
  senderId: string;
  text: string;
  media: MediaRef[];
  receivedAt: string; // ISO 8601
}

export interface DownloadedMedia {
  data: Buffer;
  contentType: string;
  filename: string;
}

export interface ExtractionResult {
  venueNameGuess: string | null;
  matchedVenueId: string | null;
  isNewVenueGuess: boolean;
  neighborhoodGuess: string | null;
  specialsGuess: string | null;
  confidenceScore: number;
}

export interface VenueListEntry {
  _id: string;
  name: string;
  neighborhood: {
    region?: string;
    subNeighborhood?: string;
  } | null;
}
