import type { ParsedHours } from '@/types/establishment';

interface DayDefinition {
  dow: number;
  fragments: string[];
}

// Order reflects matcher precedence
const daysOfWeek: DayDefinition[] = [
  { dow: 4, fragments: ['thursday', 'thurs', 'thur', 'thu', 'th'] },
  { dow: 6, fragments: ['saturday', 'sat', 'sa'] },
  { dow: 1, fragments: ['monday', 'mon'] },
  { dow: 2, fragments: ['tuesday', 'tues', 'tue'] },
  { dow: 3, fragments: ['wednesday', 'wed', 'w'] },
  { dow: 5, fragments: ['friday', 'fri', 'f'] },
  { dow: 0, fragments: ['sunday', 'sun'] },
];

export const parseTimes = (times: string): number[] => {
  const normalized = times.toLowerCase().replace('noon', '12pm');
  const matches = normalized.match(/[0-9]{1,2}(:[0-9]{2})?( *(a|p)m?)?/g);

  if (!matches) return [];

  return matches.map((timeStr) => {
    let hr: number;
    let min = 0;

    if (timeStr.includes(':')) {
      const [, minutes] = timeStr.split(':');
      min = parseInt(minutes, 10);
    }

    // Account for 12–1 (am or pm)
    hr = parseInt(timeStr, 10) === 12 ? 0 : parseInt(timeStr, 10) * 100;

    // Account for 12-hour time
    if (timeStr.includes('p')) hr = hr + 1200;

    return hr + min;
  });
};

export const parseHours = (hours: string): ParsedHours[] => {
  if (!/[0-9]/.test(hours)) return [];
  const normalizedHours = hours.toLowerCase();

  let days = daysOfWeek
    .reduce<Array<{ dow: number; index: number }>>((results, { fragments, dow }) => {
      const frag = fragments.find((frag) => normalizedHours.includes(frag));
      if (frag) {
        const index = normalizedHours.indexOf(frag);
        results.push({ dow, index });
      }
      return results;
    }, [])
    .sort((a, b) => a.index - b.index)
    .map(({ dow }) => dow);

  // If no single day was found, assume all week
  if (days.length === 0) days = [0, 6];

  const [startTime, endTime] = parseTimes(normalizedHours);

  const [startDay, endDay = days[0]] = days;

  const res: ParsedHours[] = [];
  const rangeEnd = endDay < startDay ? endDay + 7 : endDay;
  for (let i = startDay; i <= rangeEnd; i++) {
    if (startTime > endTime) {
      // crosses midnight
      res.push({ weekday: i % 7, startTime, endTime: 2400 });
      res.push({ weekday: (i + 1) % 7, startTime: 0, endTime });
    } else {
      res.push({ weekday: i % 7, startTime, endTime });
    }
  }
  return res.sort((a, b) => a.weekday - b.weekday);
};

// Check if the provided hours include the provided target date
export const hoursCover = (hours: string[], targetDate: Date = new Date()): boolean => {
  const openTimes = hours.map((hrs) => parseHours(hrs)).flat();
  const targetTime = targetDate.getHours() * 100 + targetDate.getMinutes();

  return openTimes.some(
    (entry) =>
      entry.weekday === targetDate.getDay() &&
      entry.startTime <= targetTime &&
      (typeof entry.endTime === 'undefined' || entry.endTime > targetTime)
  );
};

export default parseHours;
