import { Redis } from '@upstash/redis';

// Upstash's REST-based client — works in any Vercel runtime since it speaks
// HTTP rather than holding a TCP connection open. Reads
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from the environment.
let client: Redis | null = null;

export function getRedis(): Redis {
  if (!client) {
    client = Redis.fromEnv();
  }
  return client;
}
