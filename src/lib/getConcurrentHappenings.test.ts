import { describe, it, expect } from 'vitest';
import { getConcurrentHappenings } from './getConcurrentHappenings';
import type { SanityOtherDeal } from '@/types/sanity';

// 2024-01-03 is a Wednesday
const wednesdayAt = (hour: number, minute = 0) =>
  new Date(2024, 0, 3, hour, minute);

const deal = (overrides: Partial<SanityOtherDeal>): SanityOtherDeal => ({
  _key: 'k1',
  dealType: 'daily-special',
  times: ['Wed: 5PM-9PM'],
  details: '1/2 off oyster platters',
  ...overrides,
});

describe('getConcurrentHappenings', () => {
  it('returns a happening that is live during an active happy hour', () => {
    const result = getConcurrentHappenings(
      [deal({})],
      ['Mon-Fri: 4PM-7PM'],
      wednesdayAt(18)
    );
    expect(result).toHaveLength(1);
    expect(result[0].endTime).toBe(2100);
  });

  it('returns nothing when the happy hour is not on', () => {
    const result = getConcurrentHappenings(
      [deal({})],
      ['Mon-Fri: 4PM-7PM'],
      wednesdayAt(20)
    );
    expect(result).toEqual([]);
  });

  it('returns nothing when the happening is not live yet', () => {
    const result = getConcurrentHappenings(
      [deal({})],
      ['Mon-Fri: 4PM-7PM'],
      wednesdayAt(16, 30)
    );
    expect(result).toEqual([]);
  });

  it('skips happenings scheduled for other days', () => {
    const result = getConcurrentHappenings(
      [deal({ times: ['Tue: 5PM-9PM'] })],
      ['Mon-Fri: 4PM-7PM'],
      wednesdayAt(18)
    );
    expect(result).toEqual([]);
  });

  it('reports the real end time for happenings that cross midnight', () => {
    const result = getConcurrentHappenings(
      [deal({ times: ['Wed: 7PM-2AM'] })],
      ['Mon-Sun: 3PM-11PM'],
      wednesdayAt(20)
    );
    expect(result[0].endTime).toBe(200);
  });

  it('handles venues with no otherDeals', () => {
    expect(
      getConcurrentHappenings(undefined, ['Mon-Fri: 4PM-7PM'], wednesdayAt(18))
    ).toEqual([]);
  });
});
