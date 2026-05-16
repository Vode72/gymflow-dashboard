import { formatDuration } from './durationUtils.js'

export const targetedWarmupExercise = {
  id: 'targeted-warmup',
  name: 'Kohdennettu lämmittely',
  category: 'warmup',
  muscleGroup: 'Lämmittely',
  defaultReps: '2-3 kierrosta',
  trackingType: 'warmupNote',
  defaultWarmupType: 'Olkapäät',
  active: true,
}

function normalizeTargetedWarmupType(value) {
  if (!value) return 'Olkapäät'
  if (value.includes('Olkap')) return 'Olkapäät'
  if (value.includes('Kuminauha')) return 'Olkapäät'
  if (value.includes('Lonkka')) return 'Lonkka'
  if (value.includes('Polvi')) return 'Polvi'
  if (['Olkapäät', 'Lonkka', 'Polvi', 'Muu'].includes(value)) return value
  return 'Muu'
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
      log.customWarmupName?.trim(),
    )
  }

  if (isTargetedWarmup(log)) {
    if (log.enabled === false) return false
    return Boolean(
      log.durationMinutes ||
      log.note?.trim() ||
      log.completed ||
      log.customWarmupName?.trim(),
    )
  }

  return (log.sets?.length ?? 0) > 0
}

export function getExerciseLogTypeLabel(logOrExercise) {
  const trackingType = logOrExercise?.trackingType

  if (trackingType === 'warmupDuration' || trackingType === 'duration') return 'Lämmittely'
  if (trackingType === 'warmupNote' || trackingType === 'note') return 'Merkintä'
  return 'Sarjat'
}

function getQualityLabel(value) {
  if (!value) return ''
  if (typeof value === 'string') return value

  const labels = {
    1: 'Kevyt',
    2: 'Ok',
    3: 'Hyvä',
    4: 'Vahva',
    5: 'Maksimi',
  }

  return labels[Math.round(value)] ?? ''
}

export function getLastExerciseResult(sessions = [], exerciseId) {
  const completed = [...sessions]
    .filter((session) => session.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  for (const session of completed) {
    const exercise = session.exercises.find((item) => item.exerciseId === exerciseId)
    if (!exercise) continue

    if (isGeneralWarmup(exercise)) {
      if (exercise.durationMinutes) return `Viimeksi: ${formatDuration(exercise.durationMinutes)}`
      if (exercise.completed) return 'Viimeksi: Tehty'
    }

    if (isTargetedWarmup(exercise)) {
      if (exercise.durationMinutes) {
        const durationText = formatDuration(exercise.durationMinutes)
        if (exercise.note?.trim()) return `Viimeksi: ${durationText} · ${exercise.note.trim()}`
        return `Viimeksi: ${durationText}`
      }
      if (exercise.note?.trim()) return `Viimeksi: ${exercise.note.trim()}`
      if (exercise.completed) return 'Viimeksi: Tehty'
    }

    if (exercise.sets?.length) {
      const setText = exercise.sets
        .map((set) => `${set.reps}x${set.weight}`)
        .join(' / ')
      const setQuality = exercise.sets.find((set) => set.quality)?.quality
      const quality = getQualityLabel(exercise.quality ?? setQuality ?? session.feeling)
      return `Viimeksi: ${setText}${quality ? ` • ${quality}` : ''}`
    }
  }

  return 'Ei aiempaa tulosta'
}

export function getLastTargetedWarmupResult(sessions = [], warmupLog = {}) {
  const targetType = normalizeTargetedWarmupType(warmupLog.warmupType || targetedWarmupExercise.defaultWarmupType)
  const completed = [...sessions]
    .filter((session) => session.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  for (const session of completed) {
    const exercise = session.exercises.find((item) => (
      isTargetedWarmup(item) &&
      normalizeTargetedWarmupType(item.warmupType) === targetType
    ))
    if (!exercise) continue

    if (exercise.durationMinutes) {
      const durationText = formatDuration(exercise.durationMinutes)
      if (exercise.note?.trim()) return `Viimeksi: ${durationText} · ${exercise.note.trim()}`
      return `Viimeksi: ${durationText}`
    }
    if (exercise.note?.trim()) return `Viimeksi: ${exercise.note.trim()}`
    if (exercise.completed) return 'Viimeksi: Tehty'
  }

  return 'Ei aiempaa tulosta'
}

export function createTargetedWarmupLog(options = {}) {
  const id = options.exerciseId ?? `targeted-warmup-${Date.now()}-${options.order ?? 1}`

  return {
    exerciseId: id,
    exerciseName: targetedWarmupExercise.name,
    trackingType: targetedWarmupExercise.trackingType,
    category: targetedWarmupExercise.category,
    order: options.order ?? 1,
    enabled: true,
    enabledByUser: true,
    setsText: '',
    sets: [],
    warmupType: targetedWarmupExercise.defaultWarmupType,
    customWarmupName: '',
    durationMinutes: 5,
    completed: false,
    topKg: null,
    topReps: null,
    estimatedOneRepMax: null,
    note: '',
  }
}
