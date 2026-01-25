import type { Action, ThunkAction, WithSlice } from "@reduxjs/toolkit"
import { configureStore, combineSlices } from "@reduxjs/toolkit"
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
const rootReducer = combineSlices(
  authSlice,
  envSlice,
  tableStateSlice,
  {
    errorHandler: errorReducer,
    table: tableStateSlice.reducer,
  },
)

// Enable lazy-loaded slices to be injected dynamically with proper typing
// The withLazyLoadedSlices() returns a reducer with an inject() method that handles both
// the reducer and middleware injection automatically
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

// Store instance holder for injection utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let storeInstance: any = null
// Track the current reducer to maintain proper types through inject calls
let currentReducer = sliceReducers

export function initStore(extra: ExtraType) {
  const store = configureStore({
    reducer: sliceReducers,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: extra,
          serializableCheck: true,
        },
      }),
  })

  setupListeners(store.dispatch)
  
  // Store reference for injection utility (not extending the store itself)
  storeInstance = store
  
  return store
}

/**
 * Inject a lazy-loaded API slice into the store
 * This handles both reducer and middleware injection via RTK's inject() method
 * 
 * @param slice - The API slice to inject
 */
export function injectApiSlice(slice: LazyApiSlice) {
  if (!storeInstance) {
    throw new Error("Store not initialized. Call initStore() first.")
  }
  
  // Use the reducer's inject method which handles both reducer and middleware
  currentReducer = currentReducer.inject(slice) as typeof currentReducer
  
  // Replace the store's reducer with the updated one that includes the new slice
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  storeInstance.replaceReducer(currentReducer)
}

// Registry of API reset actions - populated by features as they load
// Type constrained to the known lazy-loaded API slices
type ApiResetAction = ReturnType<LazyApiSlice["util"]["resetApiState"]>
const apiResetActions: (() => ApiResetAction)[] = []

export function registerApiResetAction(resetAction: () => ApiResetAction) {
  if (!apiResetActions.includes(resetAction)) {
    apiResetActions.push(resetAction)
  }
}

export const getResetApiActions = () => apiResetActions.map(fn => fn())

export type ExtraType = {
  authProvider: AuthProvider
}

export type AppStore = ReturnType<typeof initStore>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  AppState,
  ExtraType,
  Action
>
