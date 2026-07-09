import type { MediaRef, NormalizedMessage } from './types';

// Channel-specific payloads are normalized into NormalizedMessage as early as
// possible; everything downstream (batching, rate limiting, extraction) is
// channel-agnostic. Adding a channel means adding a normalizer here plus a
// webhook endpoint — nothing else changes.

// Twilio inbound SMS/MMS webhook parameters (application/x-www-form-urlencoded).
export function normalizeTwilioPayload(params: Record<string, string>): NormalizedMessage | null {
  const from = params.From;
  if (!from) return null;

  const media: MediaRef[] = [];
  const numMedia = Number(params.NumMedia ?? '0');
  for (let i = 0; i < numMedia; i += 1) {
    const url = params[`MediaUrl${i}`];
    if (url) {
      media.push({ kind: 'twilio', url, contentType: params[`MediaContentType${i}`] ?? '' });
    }
  }

  return {
    channel: 'twilio',
    senderId: from,
    text: params.Body ?? '',
    media,
    receivedAt: new Date().toISOString(),
  };
}
