import { hoursCover, parseHours } from "./parseHours"

export const getEstablishmentSortValue = (happyHourTimes) => {
  const now = new Date()
  const isCurrentlyHappyHour = hoursCover(happyHourTimes, now)

  if (!isCurrentlyHappyHour) return Infinity

  // Parse the current happy hour end time
  const openTimes = happyHourTimes.map((hrs) => parseHours(hrs)).flat()
  const currentTime = now.getHours() * 100 + now.getMinutes()

  const currentPeriod = openTimes.find(
    (period) =>
      period.weekday === now.getDay() &&
      period.startTime <= currentTime &&
      period.endTime > currentTime
  )

  return currentPeriod ? currentPeriod.endTime : Infinity
}

export const sortEstablishments = (establishments) => {
  return [...establishments].sort((a, b) => {
    const aValue = getEstablishmentSortValue(a.happyHourTimes)
    const bValue = getEstablishmentSortValue(b.happyHourTimes)
    return aValue - bValue
  })
}
