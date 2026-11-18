import { useEffect, useState } from 'react'

export function readLocalStorage(key, initialValue) {
  const stored = window.localStorage.getItem(key)
  return stored === null ? initialValue : JSON.parse(stored)
}

export function writeLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function useLocalStorage(key, initialValue, { autosave = true, validate } = {}) {
  const [value, setValue] = useState(() => {
    try {
      const stored = readLocalStorage(key, initialValue)
      return !validate || validate(stored) ? stored : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (!autosave) return
    try {
      writeLocalStorage(key, value)
    } catch {
      // Ignore private browsing or storage quota failures for the MVP.
    }
  }, [autosave, key, value])

  return [value, setValue]
}
