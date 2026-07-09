import { requireEnv } from '../lib/config';
import { enqueueBatchProcessing } from '../lib/enqueue';
import { normalizeTwilioPayload } from '../lib/normalize';
import { handleInbound } from '../lib/pipeline';
import { isValidTwilioSignature } from '../lib/twilioSignature';

// Inbound SMS/MMS webhook. Register the exact function URL with Twilio:
//   https://<site>/.netlify/functions/twilio-webhook
// (Signature validation hashes the URL Twilio requested, so the registered
// URL and the URL this function sees must match exactly.)

const EMPTY_TWIML = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

function twimlResponse(): Response {
  return new Response(EMPTY_TWIML, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Signature validation happens before anything else — unsigned or invalid
  // requests are rejected outright.
  const rawBody = await req.text();
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const signature = req.headers.get('x-twilio-signature') ?? undefined;
  const valid = isValidTwilioSignature(
    requireEnv('TWILIO_AUTH_TOKEN'),
    signature,
    req.url,
    params
  );
  if (!valid) {
    return new Response('Invalid signature', { status: 403 });
  }

  const message = normalizeTwilioPayload(params);
  if (!message) {
    return twimlResponse();
  }

  const outcome = await handleInbound(message);
  if (outcome.action === 'batched') {
    // Fire the background function that waits out the batch window. It
    // returns 202 immediately; the wait + processing continue out of band.
    await enqueueBatchProcessing(new URL(req.url).origin, {
      channel: message.channel,
      senderId: message.senderId,
      seq: outcome.seq,
    });
  }

  // Blocked and rate-limited senders get the same empty TwiML — no reply, no
  // signal that anything was filtered.
  return twimlResponse();
}
