import { hoursCover, parseHours } from './parseHours';
import type { SanityOtherDeal } from '@/types/sanity';

export interface ConcurrentHappening {
  deal: SanityOtherDeal;
  // Military time the happening ends (e.g. 2100 for 9pm); null if unknown.
  endTime: number | null;
}

// Finds the time a set of hours strings ends for the range covering
// targetDate. Ranges that cross midnight are split by parseHours into a
// 2400 end today plus a 0-start entry tomorrow, so follow that through to
// report the real end (e.g. "til 2am" instead of "til 12am").
const getActiveEndTime = (hours: string[], targetDate: Date): number | null => {
  const entries = hours.map((hrs) => parseHours(hrs)).flat();
  const targetDay = targetDate.getDay();
  const targetTime = targetDate.getHours() * 100 + targetDate.getMinutes();

  const active = entries.find(
    (entry) =>
      entry.weekday === targetDay &&
      entry.startTime <= targetTime &&
      (typeof entry.endTime === 'undefined' || entry.endTime > targetTime)
  );
  if (!active || typeof active.endTime !== 'number') return null;

  if (active.endTime === 2400) {
    const nextDay = (targetDay + 1) % 7;
    const continuation = entries.find(
      (entry) => entry.weekday === nextDay && entry.startTime === 0
    );
    if (continuation) return continuation.endTime;
  }

  return active.endTime;
};

// Returns the venue's otherDeals ("happenings") that are running right now
// alongside an active happy hour. Returns nothing when the happy hour itself
// isn't on, so a happening only surfaces when it's truly concurrent.
export const getConcurrentHappenings = (
  otherDeals: SanityOtherDeal[] = [],
  happyHourTimes: string[] = [],
  targetDate: Date = new Date()
): ConcurrentHappening[] => {
  if (otherDeals.length === 0) return [];
  if (!hoursCover(happyHourTimes, targetDate)) return [];

  return otherDeals
    .filter((deal) => hoursCover(deal.times || [], targetDate))
    .map((deal) => ({
      deal,
      endTime: getActiveEndTime(deal.times || [], targetDate),
    }));
};
