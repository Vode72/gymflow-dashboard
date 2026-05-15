export function getExerciseTrackingType(exercise) {
  if (exercise?.trackingType === 'duration') return 'warmupDuration'
  if (exercise?.trackingType === 'note') return 'warmupNote'
  if (exercise?.trackingType) return exercise.trackingType
  if (exercise?.id === 'treadmill') return 'warmupDuration'
  if (exercise?.id === 'shoulder-warmup') return 'warmupNote'
  return 'sets'
}

export function getExerciseDisplayName(exercise) {
  const trackingType = getExerciseTrackingType(exercise)
  if (trackingType === 'warmupDuration') return 'Yleislämmittely'
  if (trackingType === 'warmupNote') return 'Kohdennettu lämmittely'
  return exercise?.name
}

export function getDefaultWarmupType(exercise) {
  if (exercise?.defaultWarmupType) return exercise.defaultWarmupType
  if (exercise?.id === 'treadmill') return 'Kävelymatto'
  if (exercise?.id === 'shoulder-warmup') return 'Olkapäiden lämmittely'
  return ''
}
