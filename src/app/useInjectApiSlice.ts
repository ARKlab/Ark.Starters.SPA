import { useEffect } from "react"
import type { Api } from "@reduxjs/toolkit/query"

import { useAppStore } from "./hooks"
import { registerApiResetAction, type AppStore } from "./configureStore"

/**
 * Hook to inject an RTK Query API slice into the store when a component mounts
 * This enables lazy loading of API slices with their feature modules
 * 
 * @param api - The RTK Query API slice to inject
 * 
 * @example
 * ```tsx
 * // In a feature component
 * import { moviesApiSlice } from './paginatedTableApi';
 * 
 * function MoviePage() {
 *   useInjectApiSlice(moviesApiSlice);
 *   // ... rest of component
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useInjectApiSlice<T extends Api<any, any, any, any>>(api: T) {
  const store = useAppStore()

  useEffect(() => {
    // Inject the slice into the store
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ;(store as any).injectSlice(api)

    // Register reset action for dev/e2e mode
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    registerApiResetAction(() => api.util.resetApiState())
  }, [store, api])
}
