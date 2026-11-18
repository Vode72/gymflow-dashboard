import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { defaultExercises } from '../data/defaultExercises'
import { defaultProgram } from '../data/defaultProgram'
import { demoSessions } from '../data/demoSessions'
import { getDefaultWarmupType, getExerciseDisplayName, getExerciseTrackingType } from '../utils/exerciseTracking'
import { hasLoggedExercise, isTargetedWarmup } from '../utils/workoutLogUtils'
import { isStorageBlocked, readLocalStorage, useLocalStorage, writeLocalStorage } from './useLocalStorage'
import { coordinateWorkoutWindow } from './workoutWindow'

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

function lastStoredWorkoutTime(draft, sessions = []) {
  let latest = typeof draft?.savedAt === 'string' && Number.isFinite(Date.parse(draft.savedAt))
    ? draft.savedAt : null
  for (const session of sessions) {
    if (session.status !== 'completed' || !Number.isFinite(Date.parse(session.completedAt))) continue
    if (!latest || Date.parse(session.completedAt) > Date.parse(latest)) latest = session.completedAt
  }
  return latest
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
  const [program, , , acceptStoredProgram] = useLocalStorage(programKey, defaultProgram, { validate: isProgram })
  const [exercises, , , acceptStoredExercises] = useLocalStorage(exercisesKey, defaultExercises, { validate: isExerciseBank })
  const [sessions, setSessions] = useLocalStorage(sessionsKey, demoSessions, {
    autosave: false,
    validate: isSessionList,
  })
  const [settings, setSettings, , acceptStoredSettings] = useLocalStorage(settingsKey, defaultSettings, { validate: isSettings })
  const [activeDraft, setActiveDraft] = useState(null)
  const exercisesWithImageKeys = useMemo(() => mergeDefaultExerciseImageKeys(exercises), [exercises])

  const cancelDraftAutosave = useRef(null)
  const [draftPersistence, setDraftPersistence] = useState({ savedDraft: null, failed: false })
  const restoredDraft = useRef(null)
  const currentDraft = useRef(null)
  const savedDraft = useRef(null)
  const unloadProtection = useRef(null)
  const coordinator = useRef(null)
  const ownership = useRef(null)
  const [windowState, setWindowState] = useState('checking')
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [lastRead, setLastRead] = useState(null)
  const [readOnlyDraft, setReadOnlyDraft] = useState(null)
  const [stale, setStale] = useState(false)

  const hasSavedActiveDraft = Boolean(activeDraft && sessions.some(
    (session) => session.status === 'completed' && session.id === completedSessionId(activeDraft),
  ))
  const draftSaveStatus = draftPersistence.failed
    ? 'error'
    : activeDraft && draftPersistence.savedDraft === activeDraft ? 'saved' : 'unsaved'

  useEffect(() => {
    function refreshStoredData(event) {
      if (event && event.key !== null && event.key !== draftKey && event.key !== sessionsKey) return

      const draftRead = readLocalStorage(draftKey, isDraft)
      const sessionRead = readLocalStorage(sessionsKey, isSessionList)
      const version = ownership.current
      if (version && client.ownsWorkout() && draftRead.raw !== undefined && draftRead.raw !== version.draftRaw) {
        version.stale = true
        setStale(true)
      }
      if (!event || event.key === null || event.key === sessionsKey) {
        if (!isStorageBlocked(sessionRead)) setSessions(sessionRead.value ?? demoSessions)
      }
      setLastSavedAt(lastStoredWorkoutTime(draftRead.value, sessionRead.value))
      if (!client.ownsWorkout() && event?.key !== sessionsKey) {
        const draft = draftRead.value ?? null
        setReadOnlyDraft(draft)
        setLastRead(draft ? { readAt: new Date().toISOString(), savedAt: draft.savedAt } : null)
      }
    }

    const client = coordinateWorkoutWindow({
      locks: navigator.locks,
      onState(state) {
        if (state === 'yielded') {
          setStale(false)
          refreshStoredData()
        }
        setWindowState(state)
      },
      onAcquire(transfer) {
        const draftRead = readLocalStorage(draftKey, isDraft)
        const sessionRead = readLocalStorage(sessionsKey, isSessionList)
        if (transfer) {
          if (isStorageBlocked(draftRead) || isStorageBlocked(sessionRead)) return false
          const programRead = readLocalStorage(programKey, isProgram)
          const exercisesRead = readLocalStorage(exercisesKey, isExerciseBank)
          acceptStoredProgram(programRead.value ?? defaultProgram)
          acceptStoredExercises(exercisesRead.value ?? defaultExercises)
        }
        ownership.current = {
          draftRaw: draftRead.raw,
          draftBlocked: isStorageBlocked(draftRead),
          stale: false,
        }
        const draft = draftRead.value ?? null
        setLastSavedAt(lastStoredWorkoutTime(draft, sessionRead.value))
        setLastRead(draft ? { readAt: new Date().toISOString(), savedAt: draft.savedAt } : null)
        if (draft) delete draft.savedAt
        currentDraft.current = draft
        savedDraft.current = draft
        restoredDraft.current = draft
        setActiveDraft(draft)
        if (!isStorageBlocked(sessionRead)) setSessions(sessionRead.value ?? demoSessions)
        setDraftPersistence({ savedDraft: draft, failed: false })
        setStale(false)
        return true
      },
      canRelease() {
        return currentDraft.current === savedDraft.current
      },
    })
    coordinator.current = client
    const warnBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    function updateUnloadProtection() {
      if (client.ownsWorkout() && currentDraft.current !== savedDraft.current) {
        window.addEventListener('beforeunload', warnBeforeUnload)
      } else {
        window.removeEventListener('beforeunload', warnBeforeUnload)
      }
    }
    window.addEventListener('storage', refreshStoredData)
    refreshStoredData()
    // StrictMode can dispose this effect before the first browser lock request.
    void Promise.resolve().then(() => client.acquire())
    unloadProtection.current = updateUnloadProtection
    return () => {
      window.removeEventListener('storage', refreshStoredData)
      window.removeEventListener('beforeunload', warnBeforeUnload)
      unloadProtection.current = null
      client.close()
    }
  }, [acceptStoredExercises, acceptStoredProgram, setSessions])

  const checkStoredDraft = useCallback((draftRead) => {
    const version = ownership.current
    if (!coordinator.current?.ownsWorkout() || !version || version.stale) return false
    if (version.draftBlocked || isStorageBlocked(draftRead)) return false
    if (draftRead.raw !== version.draftRaw) {
      version.stale = true
      setStale(true)
      return false
    }
    return true
  }, [])

  const persistDraft = useCallback((draft, version) => {
    if (ownership.current !== version || currentDraft.current !== draft
      || !coordinator.current?.ownsWorkout()) return false
    const savedAt = new Date().toISOString()
    const snapshot = { ...draft, savedAt }
    try {
      const sessionRead = readLocalStorage(sessionsKey, isSessionList)
      if (!checkStoredDraft(readLocalStorage(draftKey, isDraft))
        || sessionRead.value?.some((session) => session.id === completedSessionId(draft))) {
        throw new Error('Stored workout is unsafe to replace')
      }
      writeLocalStorage(draftKey, snapshot)
    } catch {
      setDraftPersistence((current) => current.failed ? current : { ...current, failed: true })
      return false
    }
    version.draftRaw = JSON.stringify(snapshot)
    savedDraft.current = draft
    unloadProtection.current?.()
    setLastSavedAt(savedAt)
    setDraftPersistence({ savedDraft: draft, failed: false })
    return true
  }, [checkStoredDraft])

  useLayoutEffect(() => {
    if (!activeDraft || activeDraft === restoredDraft.current || hasSavedActiveDraft) return

    // Schedule only committed snapshots. A newer commit or an explicit save
    // or clear can cancel this write before it reaches localStorage.
    const version = ownership.current
    let canceled = false
    const cancel = () => { canceled = true }
    cancelDraftAutosave.current = cancel
    queueMicrotask(() => {
      if (canceled) return
      cancelDraftAutosave.current = null
      persistDraft(activeDraft, version)
    })
    return cancel
  }, [activeDraft, hasSavedActiveDraft, persistDraft])

  function resetLocalData(approvedDiscard) {
    if (!coordinator.current?.ownsWorkout()) return { status: 'blocked' }
    const storedSessions = readLocalStorage(sessionsKey, isSessionList)
    const storedDraft = readLocalStorage(draftKey, isDraft)
    const changes = [
      [programKey, defaultProgram, acceptStoredProgram, readLocalStorage(programKey, isProgram)],
      [exercisesKey, defaultExercises, acceptStoredExercises, readLocalStorage(exercisesKey, isExerciseBank)],
      [settingsKey, defaultSettings, acceptStoredSettings, readLocalStorage(settingsKey, isSettings)],
    ]
    if (!checkStoredDraft(storedDraft) || isStorageBlocked(storedSessions)
      || changes.some(([, , , read]) => isStorageBlocked(read))
      || activeDraft !== currentDraft.current || !isDraft(activeDraft)
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
    if (discard) changes.push([draftKey, null, clearDraftState, storedDraft])

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

    if (discard) cancelDraftAutosave.current?.()
    for (const [, value, acceptStoredValue] of changes) acceptStoredValue(value)
    return { status: 'saved' }
  }

  function updateProfile(nextProfile) {
    setProfile((current) => ({ ...current, ...nextProfile }))
  }

  function replaceDraft(draft) {
    currentDraft.current = draft
    unloadProtection.current?.()
    setActiveDraft(draft)
  }

  function clearDraftState() {
    ownership.current.draftRaw = 'null'
    savedDraft.current = null
    replaceDraft(null)
    setLastSavedAt(lastStoredWorkoutTime(null, readLocalStorage(sessionsKey, isSessionList).value))
    setDraftPersistence({ savedDraft: null, failed: false })
  }

  function canEditDraft() {
    return coordinator.current?.ownsWorkout() && !ownership.current.stale
  }

  function startDraft(workoutDay, selectedExercises, expectedDraft = null) {
    if (!workoutDay || !canEditDraft()) return
    const current = currentDraft.current
    if (current?.workoutDayId === workoutDay.id || current !== expectedDraft) return
    replaceDraft(createDraft(workoutDay, selectedExercises))
  }

  function updateDraft(updater) {
    const current = currentDraft.current
    if (!current || !canEditDraft()) return
    const nextDraft = typeof updater === 'function' ? updater(current) : { ...current, ...updater }
    replaceDraft({ ...nextDraft, updatedAt: new Date().toISOString() })
  }

  function saveDraft() {
    if (!activeDraft || activeDraft === restoredDraft.current || hasSavedActiveDraft) return false
    cancelDraftAutosave.current?.()
    return persistDraft(activeDraft, ownership.current)
  }

  function completeWorkout(draft) {
    if (!draft?.id || !canEditDraft() || draft !== currentDraft.current) return { status: 'failed' }

    let completedSession
    try {
      const sessionRead = readLocalStorage(sessionsKey, isSessionList)
      const draftRead = readLocalStorage(draftKey, isDraft)
      if (!checkStoredDraft(draftRead) || isStorageBlocked(sessionRead)
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
      setLastSavedAt(lastStoredWorkoutTime(draftRead.value, storedSessions))
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
    clearDraftState()
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
    workoutWindow: {
      state: windowState, stale, lastSavedAt, lastRead, readOnlyDraft,
      request: () => coordinator.current?.acquire(true),
    },
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
