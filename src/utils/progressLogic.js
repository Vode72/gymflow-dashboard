export function calculateEstimatedOneRepMax({ reps, weight }) {
  if (!reps || !weight) return 0
  return Math.round(weight * (1 + reps / 30))
}

export function calculateTopSet(sets = []) {
  return sets.reduce((best, set) => {
    if (!best) return set
    const currentScore = set.weight * set.reps
    const bestScore = best.weight * best.reps
    return currentScore > bestScore ? set : best
  }, null)
}

export function calculatePersonalRecords(sessions = []) {
  const records = {}

  sessions.forEach((session) => {
    if (session.status !== 'completed') return
    session.exercises.forEach((exercise) => {
      const topSet = calculateTopSet(exercise.sets)
      if (!topSet) return

      const estimatedOneRepMax = calculateEstimatedOneRepMax(topSet)
      const current = records[exercise.exerciseId]
      if (!current || estimatedOneRepMax > current.estimatedOneRepMax) {
        records[exercise.exerciseId] = {
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          topSet,
          estimatedOneRepMax,
          date: session.date,
        }
      }
    })
  })

  return Object.values(records)
}
