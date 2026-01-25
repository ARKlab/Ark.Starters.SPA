import { useRef } from "react"

import { injectApiSlice, registerApiResetAction, type LazyApiSlice } from "./configureStore"
import { useAppStore } from "./hooks"

/**
 * Hook to inject an RTK Query API slice into the store when a component renders
 * This enables lazy loading of API slices with their feature modules
 * 
 * The injection process:
 * 1. Gets the store instance from React context
 * 2. Injects the slice synchronously during render (before hooks execute)
 * 3. Uses `combineSlices().inject()` to add the REDUCER
 * 4. Uses `createDynamicMiddleware` to add the MIDDLEWARE
 * 5. RTK Query hooks can now access the slice's data and use its middleware
 * 
 * **Important**: This hook must be called BEFORE any RTK Query hooks (useQuery, useMutation)
 * in the component, as it injects the slice synchronously during render.
 * 
 * **Critical Discovery**: RTK's `combineSlices().inject()` only handles reducer injection.
 * Middleware must be injected separately using `createDynamicMiddleware`. This is confirmed
 * by examining the RTK source code and official documentation.
 * 
 * ## References
 * 
 * - RTK createDynamicMiddleware: https://redux-toolkit.js.org/api/createDynamicMiddleware
 * - RTK combineSlices source: https://github.com/reduxjs/redux-toolkit/blob/master/packages/toolkit/src/combineSlices.ts
 * 
 * @param api - The RTK Query API slice to inject
 * 
 * @example
 * ```tsx
 * // In a feature component
 * import { moviesApiSlice, useGetMoviesQuery } from './paginatedTableApi'
 * import { useInjectApiSlice } from '../../app/useInjectApiSlice'
 * 
 * function MoviePage() {
 *   // MUST be called before any RTK Query hooks
 *   useInjectApiSlice(moviesApiSlice)
 *   
 *   // Now safe to use RTK Query hooks - slice and middleware are injected
 *   const { data } = useGetMoviesQuery()
 *   // ... rest of component
 * }
 * ```
 */
export function useInjectApiSlice(api: LazyApiSlice) {
  const store = useAppStore()
  
  // Use a ref to track if we've already injected this slice
  const injectedRef = useRef(false)
  
  // Inject synchronously during render (before any hooks execute)
  // This ensures the slice is available when RTK Query hooks are called
  if (!injectedRef.current) {
    // Inject the slice - handles both reducer AND middleware
    injectApiSlice(store, api)
    
    // Register reset action for dev/e2e mode
    registerApiResetAction(store, () => api.util.resetApiState())
    
    injectedRef.current = true
  }
}
