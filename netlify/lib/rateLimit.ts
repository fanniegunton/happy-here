import { getRedis } from './redis';
import {
  AUTO_BLOCK_BURST_COUNT,
  AUTO_BLOCK_BURST_WINDOW_MS,
  RATE_LIMIT_MAX_PER_HOUR,
  RATE_LIMIT_WINDOW_MS,
} from './config';
import type { IntakeChannel } from './types';

export interface RateLimitVerdict {
  // True when the sender exceeded RATE_LIMIT_MAX_PER_HOUR — stop processing.
  limited: boolean;
  // True when the sender blew past the burst threshold — auto-block in Sanity.
  shouldAutoBlock: boolean;
}

// Pure decision logic, separated from Redis for testability.
export function evaluateRateLimit(hourCount: number, burstCount: number): RateLimitVerdict {
  return {
    limited: hourCount > RATE_LIMIT_MAX_PER_HOUR,
    shouldAutoBlock: burstCount >= AUTO_BLOCK_BURST_COUNT,
  };
}

// Sliding-window counter backed by a Redis sorted set of message timestamps.
// Records the current message, prunes entries older than the window, and
// returns counts for both the hourly window and the short burst window.
export async function recordAndCheckRateLimit(
  channel: IntakeChannel,
  senderId: string
): Promise<RateLimitVerdict> {
  const redis = getRedis();
  const key = `intake:rl:${channel}:${senderId}`;
  const now = Date.now();

  const pipeline = redis.pipeline();
  pipeline.zadd(key, { score: now, member: `${now}:${Math.random().toString(36).slice(2)}` });
  pipeline.zremrangebyscore(key, 0, now - RATE_LIMIT_WINDOW_MS);
  pipeline.zcard(key);
  pipeline.zcount(key, now - AUTO_BLOCK_BURST_WINDOW_MS, '+inf');
  pipeline.expire(key, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));
  const results = await pipeline.exec();

  const hourCount = Number(results[2]);
  const burstCount = Number(results[3]);
  return evaluateRateLimit(hourCount, burstCount);
}
