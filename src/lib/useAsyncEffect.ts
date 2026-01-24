import { useEffect } from "react"
import type { DependencyList } from "react"
import { useErrorBoundary } from "react-error-boundary"

const isAsyncGenerator = (v: unknown): v is AsyncGenerator => {
  return Object.prototype.toString.call(v) === "[object AsyncGenerator]"
}

function useAsyncEffect(effect: () => Promise<void> | AsyncGenerator<void, void, void>, deps?: DependencyList) {
  const { showBoundary } = useErrorBoundary()
  useEffect(
    () => {
      const task = effect()
      const isCancelled = { d: false }

      void (async () => {
        if (isAsyncGenerator(task)) {
          // eslint-disable-next-line  @typescript-eslint/no-unused-vars
          for await (const _ of task) {
            if (isCancelled.d) {
              break
            }
          }
        } else {
          await task
        }
      })().then(_ => {
        /* do nothing */
      }, showBoundary)

      return () => {
        isCancelled.d = true
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showBoundary, effect, ...(deps ?? [])],
  )
}
export default useAsyncEffect
