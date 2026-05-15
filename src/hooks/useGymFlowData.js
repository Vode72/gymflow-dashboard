import { defaultExercises } from '../data/defaultExercises'
import { defaultProgram } from '../data/defaultProgram'
import { demoSessions } from '../data/demoSessions'
import { useLocalStorage } from './useLocalStorage'

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

  function resetLocalData() {
    setProfile(defaultProfile)
    setProgram(defaultProgram)
    setExercises(defaultExercises)
    setSessions(demoSessions)
    setSettings(defaultSettings)
  }

  function updateProfile(nextProfile) {
    setProfile((current) => ({ ...current, ...nextProfile }))
  }

  function saveDraft() {
    return { status: 'draft', savedAt: new Date().toISOString() }
  }

  function completeWorkout() {
    return { status: 'confirmation-needed' }
  }

  return {
    profile,
    program,
    exercises,
    sessions,
    settings,
    resetLocalData,
    updateProfile,
    saveDraft,
    completeWorkout,
    setSettings,
  }
}
