import { useEffect, useState } from 'react'

export default function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay], // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

export function useDebouncedState<T>(value: T, delay: number): [T, (value: T) => void] {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  let timerId: NodeJS.Timeout | string | number | undefined;

  function setValue(value: T) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay);
  }

  return [
    debouncedValue,
    setValue
  ]
}