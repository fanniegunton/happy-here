import { describe, it, expect } from 'vitest';
import { evaluateRateLimit } from './rateLimit';
import { AUTO_BLOCK_BURST_COUNT, RATE_LIMIT_MAX_PER_HOUR } from './config';

describe('evaluateRateLimit', () => {
  it('allows senders at or under the hourly threshold', () => {
    expect(evaluateRateLimit(RATE_LIMIT_MAX_PER_HOUR, 1)).toEqual({
      limited: false,
      shouldAutoBlock: false,
    });
  });

  it('limits senders over the hourly threshold', () => {
    expect(evaluateRateLimit(RATE_LIMIT_MAX_PER_HOUR + 1, 1).limited).toBe(true);
  });

  it('auto-blocks senders at the burst threshold', () => {
    const verdict = evaluateRateLimit(AUTO_BLOCK_BURST_COUNT, AUTO_BLOCK_BURST_COUNT);
    expect(verdict.shouldAutoBlock).toBe(true);
  });

  it('does not auto-block a merely rate-limited sender', () => {
    const verdict = evaluateRateLimit(RATE_LIMIT_MAX_PER_HOUR + 2, RATE_LIMIT_MAX_PER_HOUR + 2);
    expect(verdict.limited).toBe(true);
    expect(verdict.shouldAutoBlock).toBe(false);
  });
});
