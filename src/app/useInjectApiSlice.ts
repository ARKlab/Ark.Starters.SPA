import { useRef } from "react"

import { injectApiSlice, registerApiResetAction, type LazyApiSlice } from "./configureStore"

/**
 * Hook to inject an RTK Query API slice into the store when a component renders
 * This enables lazy loading of API slices with their feature modules
 * 
 * The injection process:
 * 1. Injects the slice synchronously during the first render (before hooks execute)
 * 2. Uses RTK's reducer.inject() method which handles both reducer AND middleware injection
 * 3. The store's reducer is replaced with the updated version
 * 4. RTK Query hooks can now access the slice's data and use its middleware
 * 
 * **Important**: Injection happens synchronously, not in useEffect, to ensure the slice
 * is available before any RTK Query hooks (useQuery, useMutation) execute.
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
 *   // Now RTK Query hooks can be used safely
 *   const { data } = useGetMoviesQuery();
 *   // ... rest of component
 * }
 * ```
 */
export function useInjectApiSlice(api: LazyApiSlice) {
  // Use a ref to track if we've already injected this slice
  const injectedRef = useRef(false)
  
  // Inject synchronously during render (before any hooks execute)
  // This ensures the slice is available when RTK Query hooks are called
  if (!injectedRef.current) {
    // Inject the slice (both reducer and middleware are handled by RTK's inject method)
    injectApiSlice(api)
    
    // Register reset action for dev/e2e mode
    registerApiResetAction(() => api.util.resetApiState())
    
    injectedRef.current = true
  }
}
