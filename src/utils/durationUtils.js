export function formatDuration(minutes) {
  const totalMinutes = Number(minutes) || 0
  const hours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  if (hours && remainingMinutes) return `${hours} h ${remainingMinutes} min`
  if (hours) return `${hours} h`
  return `${remainingMinutes} min`
}

export function parseDurationText(text) {
  if (!text?.trim()) return null

  const hoursMatch = text.match(/(\d+)\s*h/i)
  const minutesMatch = text.match(/(\d+)\s*(?:min|m)\b/i)
  const plainMinutesMatch = text.trim().match(/^(\d+)$/)

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0
  const minutes = minutesMatch ? Number(minutesMatch[1]) : plainMinutesMatch ? Number(plainMinutesMatch[1]) : 0
  const total = hours * 60 + minutes

  return total || null
}
