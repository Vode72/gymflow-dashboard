import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { defaultExercises } from '../data/defaultExercises'
import { defaultProgram } from '../data/defaultProgram'
import { demoSessions } from '../data/demoSessions'
import { getDefaultWarmupType, getExerciseDisplayName, getExerciseTrackingType } from '../utils/exerciseTracking'
import { hasLoggedExercise, isTargetedWarmup } from '../utils/workoutLogUtils'
import { readLocalStorage, useLocalStorage, writeLocalStorage } from './useLocalStorage'

const sessionsKey = 'gymflow_sessions'
const draftKey = 'gymflow_active_draft'

function isSessionList(value) {
  return Array.isArray(value) && value.every((session) => Array.isArray(session?.exercises))
}

function completedSessionId(draft) {
  return `session-from-${draft.id}`
}

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
    durationMinutes: 45,
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
      durationMinutes: trackingType === 'warmupNote' ? null : 10,
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

function mergeDefaultExerciseImageKeys(exercises) {
  const defaultExerciseById = new Map(defaultExercises.map((exercise) => [exercise.id, exercise]))

  return exercises.map((exercise) => {
    const defaultImageKey = defaultExerciseById.get(exercise.id)?.imageKey
    if (!defaultImageKey || exercise.imageKey) return exercise

    return {
      ...exercise,
      imageKey: defaultImageKey,
    }
  })
}

export function useGymFlowData() {
  const [profile, setProfile] = useLocalStorage('gymflow_user_profile', defaultProfile)
  const [program, setProgram] = useLocalStorage('gymflow_program', defaultProgram)
  const [exercises, setExercises] = useLocalStorage('gymflow_exercises', defaultExercises)
  const [sessions, setSessions] = useLocalStorage(sessionsKey, demoSessions, {
    autosave: false,
    validate: isSessionList,
  })
  const [settings, setSettings] = useLocalStorage('gymflow_settings', defaultSettings)
  const [activeDraft, setActiveDraft] = useLocalStorage(draftKey, null, { autosave: false })
  const exercisesWithImageKeys = useMemo(() => mergeDefaultExerciseImageKeys(exercises), [exercises])

  const cancelDraftAutosave = useRef(null)
  const [draftPersistence, setDraftPersistence] = useState({ savedDraft: null, failed: false })
  const hasSavedActiveDraft = Boolean(activeDraft && sessions.some(
    (session) => session.status === 'completed' && session.id === completedSessionId(activeDraft),
  ))
  const draftSaveStatus = draftPersistence.failed
    ? 'error'
    : activeDraft && draftPersistence.savedDraft === activeDraft ? 'saved' : 'unsaved'

  const persistDraft = useCallback((draft) => {
    try {
      writeLocalStorage(draftKey, draft)
    } catch {
      setDraftPersistence((current) => current.failed ? current : { ...current, failed: true })
      return false
    }
    setDraftPersistence({ savedDraft: draft, failed: false })
    return true
  }, [])

  useLayoutEffect(() => {
    if (!activeDraft || hasSavedActiveDraft) return

    // Schedule only committed snapshots. A newer commit or an explicit save
    // or clear can cancel this write before it reaches localStorage.
    let canceled = false
    const cancel = () => { canceled = true }
    cancelDraftAutosave.current = cancel
    queueMicrotask(() => {
      if (canceled) return
      cancelDraftAutosave.current = null
      persistDraft(activeDraft)
    })
    return cancel
  }, [activeDraft, hasSavedActiveDraft, persistDraft])

  function resetLocalData() {
    setProfile(defaultProfile)
    setProgram(defaultProgram)
    setExercises(defaultExercises)
    try {
      writeLocalStorage(sessionsKey, demoSessions)
    } catch {
      // Keep the existing best-effort behavior for an explicit demo reset.
    }
    setSessions(demoSessions)
    setSettings(defaultSettings)
    cancelDraftAutosave.current?.()
    try {
      writeLocalStorage(draftKey, null)
    } catch {
      // Keep the existing best-effort behavior for an explicit demo reset.
    }
    setActiveDraft(null)
  }

  function updateProfile(nextProfile) {
    setProfile((current) => ({ ...current, ...nextProfile }))
  }

  function startDraft(workoutDay, selectedExercises, expectedDraft = null) {
    if (!workoutDay) return

    setActiveDraft((current) => {
      if (current?.workoutDayId === workoutDay.id) return current
      // Replacement requires confirmation of this exact, still-current draft.
      if (current !== expectedDraft) return current
      return createDraft(workoutDay, selectedExercises)
    })
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
    if (!activeDraft || hasSavedActiveDraft) return false
    cancelDraftAutosave.current?.()
    return persistDraft(activeDraft)
  }

  function completeWorkout(draft) {
    if (!draft?.id) return { status: 'failed' }

    let completedSession
    try {
      let storedSessions = readLocalStorage(sessionsKey, demoSessions)
      if (!isSessionList(storedSessions)) return { status: 'failed' }
      const storedDraft = readLocalStorage(draftKey, null)
      if (storedDraft !== null && storedDraft.id !== draft.id) return { status: 'failed' }

      // The same draft can reach this path again after a failed cleanup or refresh.
      const id = completedSessionId(draft)
      completedSession = storedSessions.find((session) => session.id === id)
      if (completedSession && completedSession.status !== 'completed') return { status: 'failed' }
      if (!completedSession) {
        const now = new Date()
        const { time } = getLocalDateParts(now)
        completedSession = {
          ...draft,
          id,
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
        storedSessions = [...storedSessions, completedSession]
        writeLocalStorage(sessionsKey, storedSessions)
      }
      setSessions(storedSessions)
    } catch {
      return { status: 'failed' }
    }

    cancelDraftAutosave.current?.()
    try {
      writeLocalStorage(draftKey, null)
    } catch {
      return { status: 'cleanup-failed' }
    }
    setActiveDraft(null)
    return { status: 'saved', session: completedSession }
  }

  return {
    profile,
    program,
    exercises: exercisesWithImageKeys,
    sessions,
    settings,
    activeDraft,
    draftSaveStatus,
    hasSavedActiveDraft,
    resetLocalData,
    updateProfile,
    startDraft,
    updateDraft,
    saveDraft,
    completeWorkout,
    setSettings,
  }
}
