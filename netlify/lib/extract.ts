import Anthropic from '@anthropic-ai/sdk';
import { EXTRACTION_MAX_TOKENS, EXTRACTION_MODEL } from './config';
import type { DownloadedMedia, ExtractionResult, VenueListEntry } from './types';

let anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY
  }
  return anthropic;
}

// JSON schema for structured outputs — guarantees a parseable response shape.
const EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    venueNameGuess: {
      type: ['string', 'null'],
      description: 'The venue name mentioned or shown, or null if none is identifiable.',
    },
    matchedVenueId: {
      type: ['string', 'null'],
      description:
        'The _id of the matching venue from the provided list, or null if no confident match.',
    },
    isNewVenueGuess: {
      type: 'boolean',
      description: 'True if this appears to be a venue NOT in the provided list.',
    },
    neighborhoodGuess: {
      type: ['string', 'null'],
      description: 'The Austin neighborhood, if mentioned or inferable. Null otherwise.',
    },
    specialsGuess: {
      type: ['string', 'null'],
      description:
        'Free-text description of the happy hour specials and times, in the style of a short menu blurb (e.g. "$5 house wine, $2 off drafts, half-price queso. Mon–Fri 3–6pm"). Null if no specials info.',
    },
    confidenceScore: {
      type: 'integer',
      description:
        'How clean and unambiguous the extraction was overall, 0 (pure guesswork) to 100 (explicit and unambiguous).',
    },
  },
  required: [
    'venueNameGuess',
    'matchedVenueId',
    'isNewVenueGuess',
    'neighborhoodGuess',
    'specialsGuess',
    'confidenceScore',
  ],
  additionalProperties: false,
} as const;

function buildPrompt(combinedText: string, venues: VenueListEntry[]): string {
  const venueLines = venues
    .map((venue) => {
      const hood = venue.neighborhood
        ? [venue.neighborhood.region, venue.neighborhood.subNeighborhood]
            .filter(Boolean)
            .join(' / ')
        : '';
      return `- ${venue._id} :: ${venue.name}${hood ? ` (${hood})` : ''}`;
    })
    .join('\n');

  return `You are the intake processor for Happy Here, a directory of Austin happy hours. Venue staff and regulars text us photos of specials boards, menus, and short updates. Extract structured data from the message below (text plus any attached photos).

Known venues (id :: name (neighborhood)):
${venueLines}

Rules:
- If the message clearly refers to one of the known venues (allow for nicknames, abbreviations, and misspellings), set matchedVenueId to that venue's _id and isNewVenueGuess to false.
- If it names a venue that is not in the list, set matchedVenueId to null and isNewVenueGuess to true.
- If no venue is identifiable at all, set venueNameGuess and matchedVenueId to null and isNewVenueGuess to false.
- specialsGuess should read like the "Happy Hour Details" blurb on a listing: items, prices, and days/times, condensed. Transcribe from photos where legible.
- neighborhoodGuess: prefer the neighborhood names used in the venue list above when applicable.
- confidenceScore reflects extraction cleanliness: legible photo of a printed specials board with a clear venue name scores high; a blurry photo with no venue context scores low.

Message text (may be empty if photo-only):
"""
${combinedText}
"""`;
}

function toImageBlock(media: DownloadedMedia): Anthropic.ImageBlockParam {
  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: media.contentType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
      data: media.data.toString('base64'),
    },
  };
}

export async function extractSubmission(
  combinedText: string,
  images: DownloadedMedia[],
  venues: VenueListEntry[]
): Promise<ExtractionResult> {
  const response = await getAnthropic().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: EXTRACTION_MAX_TOKENS,
    thinking: { type: 'adaptive' },
    output_config: {
      format: { type: 'json_schema', schema: EXTRACTION_SCHEMA },
    },
    messages: [
      {
        role: 'user',
        content: [
          ...images.map(toImageBlock),
          { type: 'text', text: buildPrompt(combinedText, venues) },
        ],
      },
    ],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('Extraction request was refused by the model');
  }

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text'
  );
  if (!textBlock) {
    throw new Error('Extraction response contained no text block');
  }

  const parsed = JSON.parse(textBlock.text) as ExtractionResult;

  // Guard against a matchedVenueId that isn't actually in the provided list.
  const validIds = new Set(venues.map((venue) => venue._id));
  if (parsed.matchedVenueId && !validIds.has(parsed.matchedVenueId)) {
    parsed.matchedVenueId = null;
  }
  parsed.confidenceScore = Math.max(0, Math.min(100, Math.round(parsed.confidenceScore)));

  return parsed;
}
