// Central configuration for the intake pipeline.
// All tunable thresholds live here as named constants.

// --- Batching ---
// How long we wait after the last inbound message before processing the batch.
export const BATCH_WINDOW_MS = 60_000;
// Redis TTL on batch keys — must comfortably exceed BATCH_WINDOW_MS so a batch
// survives until its owning background invocation wakes up and claims it.
export const BATCH_KEY_TTL_SECONDS = 300;

// --- Rate limiting ---
// More than this many messages in a rolling hour stops processing (silently).
export const RATE_LIMIT_MAX_PER_HOUR = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
// Blowing past this many messages in the burst window auto-writes a
// blockedSender document in Sanity so the block is visible and persistent.
export const AUTO_BLOCK_BURST_COUNT = 20;
export const AUTO_BLOCK_BURST_WINDOW_MS = 2 * 60 * 1000;

// --- Duplicate detection ---
// Pending submissions for the same venue within this window are dedupe candidates.
export const DUPLICATE_LOOKBACK_MS = 48 * 60 * 60 * 1000;
// Token-set similarity (0–1) above which two submissions count as overlapping.
export const DUPLICATE_SIMILARITY_THRESHOLD = 0.6;

// --- Claude extraction ---
export const EXTRACTION_MODEL = 'claude-opus-4-8';
export const EXTRACTION_MAX_TOKENS = 4096;

// --- Env access ---
// Netlify functions read process.env (not import.meta.env like the Astro site).
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
