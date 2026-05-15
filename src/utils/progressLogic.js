export function calculateEstimatedOneRepMax(weightOrSet, repsValue) {
  const weight = typeof weightOrSet === 'object' ? weightOrSet?.weight : weightOrSet
  const reps = typeof weightOrSet === 'object' ? weightOrSet?.reps : repsValue

  if (!reps || !weight) return 0
  return Math.round(weight * (1 + reps / 30))
}

export function calculateTopSet(sets = []) {
  return sets.reduce((best, set) => {
    if (!best) return set
    if (set.weight > best.weight) return set
    if (set.weight === best.weight && set.reps > best.reps) return set
    return best
  }, null)
}

export function calculateExerciseLogStats(sets = []) {
  if (!sets.length) {
    return {
      topKg: null,
      topReps: null,
      estimatedOneRepMax: null,
    }
  }

  const topKg = Math.max(...sets.map((set) => set.weight))
  const topReps = Math.max(...sets.map((set) => set.reps))
  const estimatedOneRepMax = Math.max(
    ...sets.map((set) => calculateEstimatedOneRepMax(set.weight, set.reps)),
  )

  return {
    topKg,
    topReps,
    estimatedOneRepMax,
  }
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
          name: exercise.exerciseName ?? exercise.name,
          topSet,
          estimatedOneRepMax,
          date: session.date,
        }
      }
    })
  })

  return Object.values(records)
}
