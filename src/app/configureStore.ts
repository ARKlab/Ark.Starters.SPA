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
  
  // Expose slice injection capability
  let currentReducer = sliceReducers
  const storeWithInject = store as typeof store & {
    injectSlice: (slice: LazyApiSlice) => void
  }
  
  storeWithInject.injectSlice = (slice: LazyApiSlice) => {
    currentReducer = currentReducer.inject(slice) as typeof currentReducer
    store.replaceReducer(currentReducer)
  }
  
  return storeWithInject
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
