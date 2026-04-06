/*
  useDebounce.js — Custom Hook
  ─────────────────────────────
  PROBLEM: If we search and the API is called on EVERY keystroke,
           that's too many requests (e.g. typing "laptop" = 6 requests).

  SOLUTION: Debouncing — wait for the user to STOP typing for 400ms,
            THEN update the search query.

  Example:
    User types: l → la → lap → lapt → lapto → laptop
    Without debounce: 6 API calls
    With debounce (400ms delay): only 1 call (after they finish typing)
*/

import { useState, useEffect } from 'react'

const useDebounce = (value, delay = 400) => {
  // Store the "delayed" version of the value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set a timer to update debouncedValue after `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: if `value` changes before timeout, cancel the old timer
    // This is why it's called "debounce" — it cancels stale timers
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
