import { defaultExercises } from '../data/defaultExercises'
import { defaultProgram } from '../data/defaultProgram'
import { demoSessions } from '../data/demoSessions'
import { getDefaultWarmupType, getExerciseDisplayName, getExerciseTrackingType } from '../utils/exerciseTracking'
import { hasLoggedExercise, isTargetedWarmup } from '../utils/workoutLogUtils'
import { useLocalStorage } from './useLocalStorage'

function getLocalDateParts(date = new Date()) {
  return {
    date: [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-'),
    time: [
      String(date.getHours()).padStart(2, '0'),
      String(date.getMinutes()).padStart(2, '0'),
    ].join(':'),
  }
}

function createDraft(workoutDay, selectedExercises) {
  const now = new Date()
  const { date, time } = getLocalDateParts(now)

  return {
    id: `draft-${workoutDay.id}-${now.getTime()}`,
    date,
    startTime: time,
    workoutDayId: workoutDay.id,
    workoutName: workoutDay.name,
    status: 'draft',
    durationMinutes: 0,
    feeling: 'Normaali',
    exercises: selectedExercises.map((exercise) => {
      const trackingType = getExerciseTrackingType(exercise)

      return {
      exerciseId: exercise.id,
      exerciseName: getExerciseDisplayName(exercise),
      trackingType,
      category: exercise.category ?? '',
      enabled: trackingType !== 'warmupNote',
      enabledByUser: false,
      setsText: '',
      sets: [],
      warmupType: getDefaultWarmupType(exercise),
      customWarmupName: '',
      durationMinutes: null,
      completed: false,
      topKg: null,
      topReps: null,
      estimatedOneRepMax: null,
      note: '',
      }
    }),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

const defaultProfile = {
  name: '',
  weightKg: '',
  heightCm: '',
}

const defaultSettings = {
  language: 'fi',
  theme: 'light-beige',
  units: 'kg',
}

export function useGymFlowData() {
  const [profile, setProfile] = useLocalStorage('gymflow_user_profile', defaultProfile)
  const [program, setProgram] = useLocalStorage('gymflow_program', defaultProgram)
  const [exercises, setExercises] = useLocalStorage('gymflow_exercises', defaultExercises)
  const [sessions, setSessions] = useLocalStorage('gymflow_sessions', demoSessions)
  const [settings, setSettings] = useLocalStorage('gymflow_settings', defaultSettings)
  const [activeDraft, setActiveDraft] = useLocalStorage('gymflow_active_draft', null)

  function resetLocalData() {
    setProfile(defaultProfile)
    setProgram(defaultProgram)
    setExercises(defaultExercises)
    setSessions(demoSessions)
    setSettings(defaultSettings)
    setActiveDraft(null)
  }

  function updateProfile(nextProfile) {
    setProfile((current) => ({ ...current, ...nextProfile }))
  }

  function startDraft(workoutDay, selectedExercises) {
    if (!workoutDay || activeDraft?.workoutDayId === workoutDay.id) return activeDraft

    const nextDraft = createDraft(workoutDay, selectedExercises)
    setActiveDraft(nextDraft)
    return nextDraft
  }

  function updateDraft(updater) {
    setActiveDraft((current) => {
      if (!current) return current
      const nextDraft = typeof updater === 'function' ? updater(current) : { ...current, ...updater }
      return {
        ...nextDraft,
        updatedAt: new Date().toISOString(),
      }
    })
  }

  function saveDraft() {
    updateDraft((current) => current)
    return { status: 'draft', savedAt: new Date().toISOString() }
  }

  function completeWorkout(draft) {
    if (!draft) return null

    const now = new Date()
    const { time } = getLocalDateParts(now)
    const completedSession = {
      ...draft,
      id: `session-${now.getTime()}`,
      endTime: time,
      completedAt: now.toISOString(),
      status: 'completed',
      durationMinutes: Number(draft.durationMinutes) || 0,
      exercises: draft.exercises.filter((exercise) => (
        exercise.enabled !== false &&
        (!isTargetedWarmup(exercise) || (exercise.enabledByUser && hasLoggedExercise(exercise)))
      )),
      createdAt: draft.createdAt ?? now.toISOString(),
      updatedAt: now.toISOString(),
    }

    setSessions((current) => [...current, completedSession])
    setActiveDraft(null)
    return completedSession
  }

  return {
    profile,
    program,
    exercises,
    sessions,
    settings,
    activeDraft,
    resetLocalData,
    updateProfile,
    startDraft,
    updateDraft,
    saveDraft,
    completeWorkout,
    setSettings,
  }
}
