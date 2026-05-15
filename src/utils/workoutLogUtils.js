export const targetedWarmupExercise = {
  id: 'targeted-warmup',
  name: 'Kohdennettu lämmittely',
  category: 'warmup',
  muscleGroup: 'Lämmittely',
  defaultReps: '2-3 kierrosta',
  trackingType: 'warmupNote',
  defaultWarmupType: 'Olkapäiden lämmittely',
  active: true,
}

export function isTargetedWarmup(log) {
  return log?.trackingType === 'warmupNote' || log?.trackingType === 'note'
}

export function isGeneralWarmup(log) {
  return log?.trackingType === 'warmupDuration' || log?.trackingType === 'duration'
}

export function hasLoggedExercise(log) {
  if (!log) return false

  if (isGeneralWarmup(log)) {
    return Boolean(
      log.durationMinutes ||
      log.completed ||
      log.customWarmupName?.trim() ||
      log.warmupType,
    )
  }

  if (isTargetedWarmup(log)) {
    if (log.enabled === false) return false
    return Boolean(
      log.note?.trim() ||
      log.completed ||
      log.customWarmupName?.trim() ||
      log.warmupType,
    )
  }

  return (log.sets?.length ?? 0) > 0
}

export function createTargetedWarmupLog() {
  return {
    exerciseId: targetedWarmupExercise.id,
    exerciseName: targetedWarmupExercise.name,
    trackingType: targetedWarmupExercise.trackingType,
    category: targetedWarmupExercise.category,
    enabled: true,
    enabledByUser: true,
    setsText: '',
    sets: [],
    warmupType: targetedWarmupExercise.defaultWarmupType,
    customWarmupName: '',
    durationMinutes: null,
    completed: false,
    topKg: null,
    topReps: null,
    estimatedOneRepMax: null,
    note: '',
  }
}
