import { parseHours } from "./parseHours"

/**
 * Finds the next occurrence of any interval's start time from the provided hours strings.
 *
 * @param {string[]} hoursArray - Array of hours strings (e.g. "Mon: 11am–8pm", "Tue–Wed: 8am–4pm")
 * @param {Date} [targetDate=new Date()] - The reference date/time (defaults to now)
 * @returns {Date|null} - A Date object representing the next start time, or null if none is defined.
 */
export const getNextStartTime = (hoursArray, targetDate = new Date()) => {
  // Parse all intervals from the provided hours strings.
  const intervals = hoursArray.flatMap(parseHours)
  if (intervals.length === 0) return null

  let nextCandidate = null
  const currentDay = targetDate.getDay()
  const currentMilitaryTime =
    targetDate.getHours() * 100 + targetDate.getMinutes()

  intervals.forEach((interval) => {
    // Calculate how many days ahead the interval occurs.
    let dayDiff = (interval.weekday - currentDay + 7) % 7
    // If the interval is today but the start time has already passed, push it to next week.
    if (dayDiff === 0 && interval.startTime <= currentMilitaryTime) {
      dayDiff = 7
    }

    const candidate = new Date(targetDate)
    candidate.setDate(candidate.getDate() + dayDiff)

    // Convert interval.startTime (e.g. 1100) into hours and minutes.
    const hours = Math.floor(interval.startTime / 100)
    const minutes = interval.startTime % 100
    candidate.setHours(hours, minutes, 0, 0)

    // Keep the earliest candidate.
    if (!nextCandidate || candidate < nextCandidate) {
      nextCandidate = candidate
    }
  })

  return nextCandidate
}
