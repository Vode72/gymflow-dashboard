import { useCallback, useEffect, useRef, useState } from 'react'

export function readLocalStorage(key, validate) {
  let raw
  try {
    raw = window.localStorage.getItem(key)
  } catch {
    return { status: 'unreadable' }
  }

  if (raw === null) return { status: 'missing', raw }

  try {
    const value = JSON.parse(raw)
    if (validate(value)) return { status: 'valid', raw, value }
  } catch {
    // Keep the original bytes when parsing or validation fails.
  }
  return { status: 'corrupt', raw }
}

export function isStorageBlocked(read) {
  return read.status === 'corrupt' || read.status === 'unreadable'
}

export function writeLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function useLocalStorage(key, initialValue, { autosave = true, validate }) {
  const [initialRead] = useState(() => readLocalStorage(key, validate))
  const [value, setValue] = useState(() => initialRead.status === 'valid' ? initialRead.value : initialValue)
  const lastSaved = useRef(initialRead.value)
  const blocked = isStorageBlocked(initialRead)

  useEffect(() => {
    if (!autosave || blocked || lastSaved.current === value) return
    const stored = readLocalStorage(key, validate)
    if (isStorageBlocked(stored)) return
    try {
      if (stored.raw !== JSON.stringify(value)) writeLocalStorage(key, value)
      lastSaved.current = value
    } catch {
      // The browser may deny writes even after a successful read.
    }
  }, [autosave, blocked, key, validate, value])

  const acceptStoredValue = useCallback((storedValue) => {
    lastSaved.current = storedValue
    setValue(storedValue)
  }, [])

  return [value, setValue, blocked, acceptStoredValue]
}
