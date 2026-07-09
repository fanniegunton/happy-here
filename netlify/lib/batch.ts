import { getRedis } from './redis';
import { BATCH_KEY_TTL_SECONDS } from './config';
import type { IntakeChannel, NormalizedMessage } from './types';

// Multi-message batching.
//
// Every inbound message is appended to a per-sender list and bumps a per-sender
// sequence counter. The webhook then fires a background function that sleeps
// out the batch window and calls claimBatchIfCurrent with the sequence number
// it observed. Only the invocation holding the *latest* sequence wins —
// earlier invocations see a mismatch and exit, so three photos in a row become
// one submission processed by the invocation triggered by the third photo.

function batchListKey(channel: IntakeChannel, senderId: string): string {
  return `intake:batch:${channel}:${senderId}`;
}

function batchSeqKey(channel: IntakeChannel, senderId: string): string {
  return `intake:seq:${channel}:${senderId}`;
}

// Appends the message and returns the sequence number this message holds.
export async function appendToBatch(message: NormalizedMessage): Promise<number> {
  const redis = getRedis();
  const listKey = batchListKey(message.channel, message.senderId);
  const seqKey = batchSeqKey(message.channel, message.senderId);

  const pipeline = redis.pipeline();
  pipeline.rpush(listKey, JSON.stringify(message));
  pipeline.incr(seqKey);
  pipeline.expire(listKey, BATCH_KEY_TTL_SECONDS);
  pipeline.expire(seqKey, BATCH_KEY_TTL_SECONDS);
  const results = await pipeline.exec();

  return Number(results[1]);
}

// Atomically claims the batch iff no newer message has arrived since
// `expectedSeq`. The Lua script guarantees there is no window between the
// seq check and the list read/delete where a racing message could be lost:
// a message arriving before EVAL bumps the seq (mismatch → we exit, its own
// invocation owns the batch); a message arriving after EVAL starts a fresh
// batch with a fresh sequence.
const CLAIM_SCRIPT = `
local seq = redis.call('GET', KEYS[1])
if seq == ARGV[1] then
  local items = redis.call('LRANGE', KEYS[2], 0, -1)
  redis.call('DEL', KEYS[2])
  redis.call('DEL', KEYS[1])
  return items
end
return false
`;

export async function claimBatchIfCurrent(
  channel: IntakeChannel,
  senderId: string,
  expectedSeq: number
): Promise<NormalizedMessage[] | null> {
  const redis = getRedis();
  const result = await redis.eval(
    CLAIM_SCRIPT,
    [batchSeqKey(channel, senderId), batchListKey(channel, senderId)],
    [String(expectedSeq)]
  );

  if (!result || !Array.isArray(result)) return null;

  return result.map((item) =>
    typeof item === 'string' ? (JSON.parse(item) as NormalizedMessage) : (item as NormalizedMessage)
  );
}
