import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { defaultExercises } from '../data/defaultExercises'
import { defaultProgram } from '../data/defaultProgram'
import { demoSessions } from '../data/demoSessions'
import { getDefaultWarmupType, getExerciseDisplayName, getExerciseTrackingType } from '../utils/exerciseTracking'
import { hasLoggedExercise, isTargetedWarmup } from '../utils/workoutLogUtils'
import { isStorageBlocked, readLocalStorage, useLocalStorage, writeLocalStorage } from './useLocalStorage'

const sessionsKey = 'gymflow_sessions'
const draftKey = 'gymflow_active_draft'
const programKey = 'gymflow_program'
const exercisesKey = 'gymflow_exercises'
const settingsKey = 'gymflow_settings'

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isId = (value) => typeof value === 'string' && value.length > 0
const isOptionalText = (value) => value == null || typeof value === 'string'
const isOptionalInput = (value) => isOptionalText(value) || typeof value === 'number'

function isExerciseLog(log) {
  return isId(log?.exerciseId)
    && [log.exerciseName, log.name, log.trackingType, log.setsText, log.note,
      log.warmupType, log.customWarmupName, log.exerciseComment].every(isOptionalText)
    && (log.sets == null || (Array.isArray(log.sets) && log.sets.every(
      (set) => isRecord(set) && Number.isFinite(set.reps) && Number.isFinite(set.weight),
    )))
}

function isSessionList(value) {
  return Array.isArray(value) && value.every((session) =>
    isId(session?.id)
    && [session.date, session.startTime, session.endTime, session.completedAt, session.status,
      session.workoutDayId, session.workoutName, session.feeling].every(isOptionalText)
    && (session.status !== 'completed' || Number.isFinite(Date.parse(`${session.date}T12:00:00`)))
    && Array.isArray(session.exercises) && session.exercises.every(isExerciseLog),
  )
}

function isDraft(value) {
  return value === null || (
    isId(value?.id) && isId(value.workoutDayId)
    && [value.date, value.startTime, value.workoutName, value.feeling].every(isOptionalText)
    && (value.status == null || value.status === 'draft')
    && Array.isArray(value.exercises) && value.exercises.every(isExerciseLog)
  )
}

function isProgram(value) {
  return Array.isArray(value?.workoutDays) && isOptionalText(value.name)
    && value.workoutDays.every((day) =>
      isId(day?.id) && isOptionalText(day.name) && isOptionalText(day.description)
      && typeof day.active === 'boolean'
      && Array.isArray(day.exerciseIds) && day.exerciseIds.every(isId),
    )
}

function isExerciseBank(value) {
  return Array.isArray(value) && value.every((exercise) =>
    isId(exercise?.id)
    && [exercise.name, exercise.category, exercise.trackingType, exercise.defaultWarmupType,
      exercise.muscleGroup, exercise.defaultReps, exercise.imageKey].every(isOptionalText),
  )
}

const isProfile = (value) => isRecord(value)
  && ['name', 'weightKg', 'heightCm'].some((key) => Object.hasOwn(value, key))
  && isOptionalText(value.name) && isOptionalInput(value.weightKg) && isOptionalInput(value.heightCm)
const isSettings = (value) => isRecord(value)
  && ['language', 'theme', 'units'].some((key) => Object.hasOwn(value, key))
  && [value.language, value.theme, value.units].every(isOptionalText)

function canKeepDraft(draft) {
  if (!draft) return true
  const day = defaultProgram.workoutDays.find(({ id, active }) => active && id === draft.workoutDayId)
  if (!day) return false

  return draft.exercises.every((log) => {
    // Targeted warmups render from the draft, including those added during training.
    if (isTargetedWarmup(log)) return true
    const exercise = defaultExercises.find(({ id }) => id === log.exerciseId)
    return day.exerciseIds.includes(log.exerciseId) && exercise
      && (!log.trackingType || getExerciseTrackingType(exercise) === getExerciseTrackingType({
        id: log.exerciseId, trackingType: log.trackingType,
      }))
  })
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
  const [profile, setProfile] = useLocalStorage('gymflow_user_profile', defaultProfile, { validate: isProfile })
  const [program, setProgram] = useLocalStorage(programKey, defaultProgram, { validate: isProgram })
  const [exercises, setExercises] = useLocalStorage(exercisesKey, defaultExercises, { validate: isExerciseBank })
  const [sessions, setSessions] = useLocalStorage(sessionsKey, demoSessions, {
    autosave: false,
    validate: isSessionList,
  })
  const [settings, setSettings] = useLocalStorage(settingsKey, defaultSettings, { validate: isSettings })
  const [activeDraft, setActiveDraft, draftReadBlocked] = useLocalStorage(draftKey, null, {
    autosave: false,
    validate: isDraft,
  })
  const exercisesWithImageKeys = useMemo(() => mergeDefaultExerciseImageKeys(exercises), [exercises])

  const cancelDraftAutosave = useRef(null)
  const [draftPersistence, setDraftPersistence] = useState({ savedDraft: activeDraft, failed: false })
  const restoredDraft = useRef(activeDraft)
  const hasSavedActiveDraft = Boolean(activeDraft && sessions.some(
    (session) => session.status === 'completed' && session.id === completedSessionId(activeDraft),
  ))
  const draftSaveStatus = draftPersistence.failed
    ? 'error'
    : activeDraft && draftPersistence.savedDraft === activeDraft ? 'saved' : 'unsaved'

  const persistDraft = useCallback((draft) => {
    try {
      if (draftReadBlocked || isStorageBlocked(readLocalStorage(draftKey, isDraft))) {
        throw new Error('Stored draft is unsafe to replace')
      }
      writeLocalStorage(draftKey, draft)
    } catch {
      setDraftPersistence((current) => current.failed ? current : { ...current, failed: true })
      return false
    }
    setDraftPersistence({ savedDraft: draft, failed: false })
    return true
  }, [draftReadBlocked])

  useLayoutEffect(() => {
    if (!activeDraft || activeDraft === restoredDraft.current || hasSavedActiveDraft) return

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

  function resetLocalData(approvedDiscard) {
    const storedSessions = readLocalStorage(sessionsKey, isSessionList)
    const storedDraft = readLocalStorage(draftKey, isDraft)
    const changes = [
      [programKey, defaultProgram, setProgram, readLocalStorage(programKey, isProgram)],
      [exercisesKey, defaultExercises, setExercises, readLocalStorage(exercisesKey, isExerciseBank)],
      [settingsKey, defaultSettings, setSettings, readLocalStorage(settingsKey, isSettings)],
    ]
    if (draftReadBlocked || isStorageBlocked(storedSessions) || isStorageBlocked(storedDraft)
      || changes.some(([, , , read]) => isStorageBlocked(read))
      || !isDraft(activeDraft)
      || (storedDraft.value && storedDraft.value.id !== activeDraft?.id)) {
      return { status: 'blocked' }
    }

    const discard = !canKeepDraft(activeDraft) || !canKeepDraft(storedDraft.value)
    if (approvedDiscard) {
      if (!discard || approvedDiscard.draft !== activeDraft || approvedDiscard.raw !== storedDraft.raw) {
        return { status: 'blocked' }
      }
    } else if (discard) {
      return { status: 'confirm-discard', draft: activeDraft, raw: storedDraft.raw }
    }
    if (discard) changes.push([draftKey, null, setActiveDraft, storedDraft])

    const written = []
    try {
      for (const [key, value, , original] of changes) {
        const nextRaw = JSON.stringify(value)
        if (original.raw === nextRaw) continue
        writeLocalStorage(key, value)
        written.push([key, original.raw, nextRaw])
      }
    } catch {
      let restored = true
      for (const [key, raw, nextRaw] of written.reverse()) {
        try {
          if (window.localStorage.getItem(key) !== nextRaw) {
            restored = false
            continue
          }
          if (raw === null) window.localStorage.removeItem(key)
          else window.localStorage.setItem(key, raw)
          if (window.localStorage.getItem(key) !== raw) restored = false
        } catch {
          restored = false
        }
      }
      return { status: restored ? 'failed' : 'partial' }
    }

    if (discard) {
      cancelDraftAutosave.current?.()
      setDraftPersistence({ savedDraft: null, failed: false })
    }
    for (const [, value, setValue] of changes) setValue(value)
    return { status: 'saved' }
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
    if (!activeDraft || activeDraft === restoredDraft.current || hasSavedActiveDraft) return false
    cancelDraftAutosave.current?.()
    return persistDraft(activeDraft)
  }

  function completeWorkout(draft) {
    if (!draft?.id) return { status: 'failed' }

    let completedSession
    try {
      const sessionRead = readLocalStorage(sessionsKey, isSessionList)
      const draftRead = readLocalStorage(draftKey, isDraft)
      if (draftReadBlocked || isStorageBlocked(sessionRead) || isStorageBlocked(draftRead)
        || (draftRead.value && draftRead.value.id !== draft.id)) return { status: 'failed' }
      let storedSessions = sessionRead.value ?? demoSessions

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
