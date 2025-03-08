import { parseHours } from "./parseHours"

/**
 * Given an array of hours strings, returns the end time for today’s range,
 * if the current time falls within any of the provided ranges.
 *
 * @param {string[]} hoursArray - Array of hours strings (e.g. "Mon: 11am–8pm", "Tue–Wed: 8am–4pm")
 * @param {Date} [targetDate=new Date()] - The date to use (defaults to current date/time)
 * @returns {number|null} - The end time as a number (e.g., 2000 for 8pm), or null if no range covers the current time.
 */
export const getTodayEndTime = (hoursArray, targetDate = new Date()) => {
  const targetDay = targetDate.getDay()
  const targetTime = targetDate.getHours() * 100 + targetDate.getMinutes()

  for (const hoursStr of hoursArray) {
    const entries = parseHours(hoursStr)
    // Look for an entry that applies to today and where the current time is within the range.
    for (const entry of entries) {
      if (
        entry.weekday === targetDay &&
        entry.startTime <= targetTime &&
        (typeof entry.endTime === "undefined" || entry.endTime > targetTime)
      ) {
        return entry.endTime
      }
    }
  }
  // If no matching range was found, return null.
  return null
}
