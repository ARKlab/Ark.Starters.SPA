import type { Action, ThunkAction, WithSlice } from "@reduxjs/toolkit"
import { combineSlices, configureStore, createDynamicMiddleware } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { authSlice } from "../lib/authentication/authenticationSlice"
import { envSlice } from "../lib/authentication/envSlice"
import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface"
import { tableStateSlice } from "../lib/components/AppArkApiTable/tableStateSlice"
import errorReducer from "../lib/errorHandler/errorHandler"

// Import types of lazy-loaded API slices for proper TypeScript typing
import type { configTableApiSlice } from "../features/configTable/configTableApi"
import type { jsonPlaceholderApi } from "../features/fetchApiExample/jsonPlaceholderApi"
import type { videoGameApiSlice } from "../features/formExample/videoGamesApiSlice"
import type { globalLoadingSlice } from "../features/globalLoadingBar/globalLoadingSlice"
import type { moviesApiSlice } from "../features/paginatedTable/paginatedTableApi"
import type { rtkqErrorHandlingApi } from "../features/rtkqErrorHandling/rtkqErrorHandlingApi"

// Union type of all possible lazy-loaded API slices
export type LazyApiSlice =
  | typeof configTableApiSlice
  | typeof jsonPlaceholderApi
  | typeof videoGameApiSlice
  | typeof globalLoadingSlice
  | typeof moviesApiSlice
  | typeof rtkqErrorHandlingApi

// Base store configuration with only core slices
// Feature-specific API slices are lazy-loaded with their routes
const rootReducer = combineSlices(authSlice, envSlice, tableStateSlice, {
  errorHandler: errorReducer,
  table: tableStateSlice.reducer,
})

// Enable lazy-loaded slices to be injected dynamically with proper typing
const sliceReducers = rootReducer.withLazyLoadedSlices<
  WithSlice<typeof configTableApiSlice> &
    WithSlice<typeof jsonPlaceholderApi> &
    WithSlice<typeof videoGameApiSlice> &
    WithSlice<typeof globalLoadingSlice> &
    WithSlice<typeof moviesApiSlice> &
    WithSlice<typeof rtkqErrorHandlingApi>
>()

// Infer the `RootState` type from the root reducer
export type AppState = ReturnType<typeof sliceReducers>

export type ExtraType = {
  authProvider: AuthProvider
}

/**
 * Store manager that holds references needed for dynamic injection
 * This is NOT a module-level singleton - it's created during store initialization
 */
type StoreManager = {
  currentReducer: typeof sliceReducers
  injectedSlices: Set<string>
  dynamicMiddleware: ReturnType<typeof createDynamicMiddleware>
  apiResetActions: (() => ReturnType<LazyApiSlice["util"]["resetApiState"]>)[]
}

// Create the dynamic middleware instance for lazy-loaded API slice middlewares
// This must be created before the store is configured
const dynamicMiddlewareInstance = createDynamicMiddleware()

/**
 * Initialize and configure the Redux store
 *
 * @param extra - Extra arguments for thunks (e.g., authProvider)
 * @returns Configured Redux store with dynamic slice/middleware injection support
 */
export function initStore(extra: ExtraType) {
  const store = configureStore({
    reducer: sliceReducers,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: extra,
          serializableCheck: true,
        },
      }).concat(dynamicMiddlewareInstance.middleware), // Add dynamic middleware to the chain
  })

  setupListeners(store.dispatch)

  // Create store manager (NOT at module level - created during init)
  const storeManager: StoreManager = {
    currentReducer: sliceReducers,
    injectedSlices: new Set<string>(),
    dynamicMiddleware: dynamicMiddlewareInstance,
    apiResetActions: [],
  }

  // Attach manager to store for access by injection utilities
  // This avoids module-level side effects
  const storeWithManager = store as typeof store & { __storeManager: StoreManager }
  storeWithManager.__storeManager = storeManager

  return storeWithManager
}

export type AppStore = ReturnType<typeof initStore>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  AppState,
  ExtraType,
  Action
>

/**
 * Get the store manager from the store instance
 *
 * @param store - The Redux store instance
 * @returns Store manager for dynamic injection
 */
function getStoreManager(store: AppStore): StoreManager {
  const manager = store.__storeManager
  if (!manager) {
    throw new Error("Store manager not initialized. Ensure initStore() was called.")
  }
  return manager
}

/**
 * Inject a lazy-loaded API slice into the store
 *
 * This function handles dynamic injection of RTK Query API slices:
 *
 * 1. **Reducer Injection**: Uses RTK's `combineSlices().inject()` to add the slice reducer
 * 2. **Middleware Injection**: Uses `createDynamicMiddleware` to add the API middleware
 *
 * **Important**: `combineSlices().inject()` only handles the REDUCER, not the middleware.
 * RTK Query API slices need their middleware injected separately for features like:
 * - Caching
 * - Cache invalidation
 * - Polling
 * - Request deduplication
 * - Lifecycle management
 *
 * **Idempotent**: Can be called multiple times with the same slice - only injects once.
 *
 * ## References
 *
 * - RTK createDynamicMiddleware: https://redux-toolkit.js.org/api/createDynamicMiddleware
 * - RTK combineSlices: https://redux-toolkit.js.org/api/combineSlices#withlazyloadedslices
 * - RTK Query Code Splitting: https://redux-toolkit.js.org/rtk-query/usage/code-splitting
 *
 * @param store - The Redux store instance
 * @param slice - The RTK Query API slice to inject
 *
 * @example
 * ```typescript
 * // In a React component
 * import { useAppStore } from '../../app/hooks'
 * import { moviesApiSlice } from './paginatedTableApi'
 * import { injectApiSlice } from '../../app/configureStore'
 *
 * function MoviePage() {
 *   const store = useAppStore()
 *
 *   // Inject the slice (both reducer and middleware)
 *   injectApiSlice(store, moviesApiSlice)
 *
 *   // Now RTK Query hooks will work with full middleware support
 *   const { data } = useGetMoviesQuery()
 * }
 * ```
 */
export function injectApiSlice(store: AppStore, slice: LazyApiSlice) {
  const manager = getStoreManager(store)

  // Check if this slice has already been injected (idempotent)
  const sliceKey = slice.reducerPath
  if (manager.injectedSlices.has(sliceKey)) {
    return // Already injected, skip
  }

  // 1. Inject the REDUCER using combineSlices().inject()
  manager.currentReducer = manager.currentReducer.inject(slice) as typeof manager.currentReducer
  // Replace the reducer - types are complex with lazy loaded slices but compatible at runtime
  // We use unknown as an intermediate step to avoid the 'any' linting error
  store.replaceReducer(
    manager.currentReducer as unknown as Parameters<typeof store.replaceReducer>[0],
  )

  // 2. Inject the MIDDLEWARE using createDynamicMiddleware
  // This is critical - combineSlices().inject() does NOT inject middleware
  // We need to cast because RTK Query middleware type is slightly different from
  // what createDynamicMiddleware expects, but they're compatible at runtime
  manager.dynamicMiddleware.addMiddleware(
    slice.middleware as Parameters<typeof manager.dynamicMiddleware.addMiddleware>[0],
  )

  // Mark this slice as injected
  manager.injectedSlices.add(sliceKey)
}

/**
 * Register an API reset action for dev/e2e cache clearing
 *
 * @param store - The Redux store instance
 * @param resetAction - Function that returns the reset action
 */
export function registerApiResetAction(
  store: AppStore,
  resetAction: () => ReturnType<LazyApiSlice["util"]["resetApiState"]>,
) {
  const manager = getStoreManager(store)
  if (!manager.apiResetActions.includes(resetAction)) {
    manager.apiResetActions.push(resetAction)
  }
}

/**
 * Get all registered API reset actions
 * Used in dev/e2e mode to clear all API caches
 *
 * @param store - The Redux store instance
 * @returns Array of reset action creators
 */
export function getResetApiActions(store: AppStore) {
  const manager = getStoreManager(store)
  return manager.apiResetActions.map(fn => fn())
}
