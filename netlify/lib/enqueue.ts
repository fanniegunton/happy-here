import { requireEnv } from './config';
import type { IntakeChannel } from './types';

export interface BatchTrigger {
  channel: IntakeChannel;
  senderId: string;
  seq: number;
}

// Invokes the process-batch background function. Netlify background functions
// return 202 as soon as the invocation is accepted, so awaiting this fetch
// adds only a quick round trip to the webhook response.
export async function enqueueBatchProcessing(
  origin: string,
  trigger: BatchTrigger
): Promise<void> {
  // process.env.URL is Netlify's canonical site URL; the request origin is
  // the fallback for local `netlify dev`.
  const base = process.env.URL || origin;
  const response = await fetch(`${base}/.netlify/functions/process-batch-background`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-intake-secret': requireEnv('INTAKE_QUEUE_SECRET'),
    },
    body: JSON.stringify(trigger),
  });
  if (response.status >= 300) {
    throw new Error(`Background invocation failed with status ${response.status}`);
  }
}
