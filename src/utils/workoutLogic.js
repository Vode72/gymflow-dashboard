export function getActiveWorkoutDays(program) {
  return [...(program?.workoutDays ?? [])]
    .filter((day) => day.active)
    .sort((a, b) => a.order - b.order)
}

export function getLatestCompletedSession(sessions) {
  return [...sessions]
    .filter((session) => session.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]
}

export function getNextWorkoutDay(program, sessions) {
  const activeDays = getActiveWorkoutDays(program)
  if (activeDays.length === 0) return null

  const latest = getLatestCompletedSession(sessions)
  if (!latest) return activeDays[0]

  const latestIndex = activeDays.findIndex((day) => day.id === latest.workoutDayId)
  if (latestIndex === -1) return activeDays[0]
  return activeDays[(latestIndex + 1) % activeDays.length]
}

export function getTodaySessions(sessions, date = new Date()) {
  const today = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
  return sessions.filter((session) => session.date === today && session.status === 'completed')
}

export function getWorkoutGapMessage(latestSession, today = new Date()) {
  if (!latestSession) return 'Ei treenejä vielä. Aloita ensimmäinen treeni ja GymFlow alkaa näyttää historiaa, ennätyksiä ja kehitystä.'

  const latestDate = new Date(`${latestSession.date}T12:00:00`)
  const currentDate = new Date(today.toISOString().slice(0, 10))
  const gapDays = Math.max(0, Math.round((currentDate - latestDate) / 86400000))

  if (gapDays === 0) return 'Tänään on jo treenattu. Voit silti aloittaa uuden treenin.'
  if (gapDays === 1) return 'Edellisestä treenistä 1 päivä — jatketaanko seuraavasta treenistä?'
  return `Edellisestä treenistä ${gapDays} päivää — jatketaanko seuraavasta treenistä?`
}
