import { hoursCover, parseHours } from './parseHours';
import type { SanityEstablishment } from '@/types/sanity';

// Function to calculate minutes until next happy hour
export const getMinutesUntilNextHappyHour = (happyHourTimes: string[]): number => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Convert current time to minutes since start of week
  const currentTimeInMinutes = currentDay * 24 * 60 + currentHour * 60 + currentMinute;

  // Parse all happy hour times
  const allPeriods = happyHourTimes.map((hrs) => parseHours(hrs)).flat();

  let minDifference = Infinity;

  // Go through all happy hours periods
  allPeriods.forEach((period) => {
    // Convert period start to minutes since start of week
    const startTimeInMinutes =
      period.weekday * 24 * 60 +
      Math.floor(period.startTime / 100) * 60 +
      (period.startTime % 100);

    // Calculate difference, considering the week loops around
    let difference = startTimeInMinutes - currentTimeInMinutes;
    if (difference <= 0) {
      difference += 7 * 24 * 60; // Add a week if the happy hour is in the past
    }

    minDifference = Math.min(minDifference, difference);
  });

  return minDifference;
};

export const getEstablishmentSortValue = (happyHourTimes: string[]): number => {
  const now = new Date();
  const isCurrentlyHappyHour = hoursCover(happyHourTimes, now);

  if (!isCurrentlyHappyHour) {
    // Return minutes until next happy hour for non-happy hour places
    return getMinutesUntilNextHappyHour(happyHourTimes) + 100000; // Add large offset to ensure happy hour places come first
  }

  // Parse the current happy hour end time
  const openTimes = happyHourTimes.map((hrs) => parseHours(hrs)).flat();
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const currentPeriod = openTimes.find(
    (period) =>
      period.weekday === now.getDay() &&
      period.startTime <= currentTime &&
      period.endTime > currentTime
  );

  return currentPeriod ? currentPeriod.endTime : Infinity;
};

export const sortEstablishments = (establishments: SanityEstablishment[]): SanityEstablishment[] => {
  return [...establishments].sort((a, b) => {
    const aValue = getEstablishmentSortValue(a.happyHourTimes ?? []);
    const bValue = getEstablishmentSortValue(b.happyHourTimes ?? []);
    return aValue - bValue;
  });
};
