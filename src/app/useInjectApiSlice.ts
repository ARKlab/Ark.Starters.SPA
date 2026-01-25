import { useEffect } from "react"

import { injectApiSlice, registerApiResetAction, type LazyApiSlice } from "./configureStore"

/**
 * Hook to inject an RTK Query API slice into the store when a component mounts
 * This enables lazy loading of API slices with their feature modules
 * 
 * The injection process:
 * 1. Calls injectApiSlice() which uses RTK's reducer.inject() method
 * 2. This automatically handles both the reducer AND middleware injection
 * 3. The store's reducer is replaced with the updated version
 * 4. RTK Query hooks can now access the slice's data and use its middleware
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
export function useInjectApiSlice(api: LazyApiSlice) {
  useEffect(() => {
    // Inject the slice (both reducer and middleware are handled by RTK's inject method)
    injectApiSlice(api)

    // Register reset action for dev/e2e mode
    registerApiResetAction(() => api.util.resetApiState())
  }, [api])
}
