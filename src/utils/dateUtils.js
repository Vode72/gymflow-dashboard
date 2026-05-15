export function formatFinnishDate(dateString) {
  return new Intl.DateTimeFormat('fi-FI', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateString}T12:00:00`))
}

export function formatShortDate(dateString) {
  return new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'numeric',
  }).format(new Date(`${dateString}T12:00:00`))
}
