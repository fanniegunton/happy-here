/**
 * Converts a military time (e.g., 1800) to American-style time notation (e.g., "6PM").
 *
 * @param {number} time - The time in military format (e.g., 1800)
 * @returns {string} - The time in American format (e.g., "6PM"). Returns an empty string for invalid input.
 */
export const formatMilitaryTime = (time) => {
  if (typeof time !== "number") return ""

  // ===> normalize 2400 to 0 so it becomes midnight (12 AM)
  if (time === 2400) time = 0

  // Extract hours and minutes
  const hour = Math.floor(time / 100)
  const minutes = time % 100

  // Determine period (AM/PM)
  const period = hour >= 12 ? "PM" : "AM"

  // Convert hour from 24h to 12h format (0 and 12 become 12)
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12

  // If minutes are 0, we can omit the minutes for brevity
  if (minutes === 0) {
    return `${formattedHour}${period}`
  }

  // Otherwise, include minutes (zero-padded if needed)
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
  return `${formattedHour}:${formattedMinutes}${period}`
}
