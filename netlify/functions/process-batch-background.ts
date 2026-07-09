import { timingSafeEqual } from 'node:crypto';
import { requireEnv } from '../lib/config';
import { processBatchAfterWindow } from '../lib/pipeline';
import type { IntakeChannel } from '../lib/types';

// Channels this function accepts — extend alongside the IntakeChannel union.
const KNOWN_CHANNELS: readonly IntakeChannel[] = ['twilio'];

function isIntakeChannel(value: unknown): value is IntakeChannel {
  return typeof value === 'string' && (KNOWN_CHANNELS as readonly string[]).includes(value);
}

// Netlify background function (the -background suffix is what makes it one):
// the platform responds 202 to the caller immediately and lets this run for
// up to 15 minutes. It waits out the batch window, then processes the batch
// iff no newer message from the sender superseded it (see lib/batch.ts).
//
// The endpoint is publicly reachable like any function, so callers must
// present the shared INTAKE_QUEUE_SECRET header — only our own webhook
// functions know it.

function isAuthorized(req: Request): boolean {
  const received = req.headers.get('x-intake-secret');
  if (!received) return false;
  const expected = Buffer.from(requireEnv('INTAKE_QUEUE_SECRET'));
  const actual = Buffer.from(received);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST' || !isAuthorized(req)) {
    return new Response('Forbidden', { status: 403 });
  }

  const payload = (await req.json().catch(() => null)) as {
    channel?: string;
    senderId?: string;
    seq?: number;
  } | null;

  if (
    !payload ||
    !isIntakeChannel(payload.channel) ||
    typeof payload.senderId !== 'string' ||
    typeof payload.seq !== 'number'
  ) {
    return new Response('Bad Request', { status: 400 });
  }

  await processBatchAfterWindow(payload.channel, payload.senderId, payload.seq);
  return new Response('ok', { status: 200 });
}
