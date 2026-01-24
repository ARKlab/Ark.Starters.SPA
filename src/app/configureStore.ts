import type { UnknownAction, Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore, combineSlices } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { authSlice } from "../lib/authentication/authenticationSlice"
import { envSlice } from "../lib/authentication/envSlice"
import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface"
import { tableStateSlice } from "../lib/components/AppArkApiTable/tableStateSlice"
import errorReducer from "../lib/errorHandler/errorHandler"

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

// Enable lazy-loaded slices to be injected dynamically
const sliceReducers = rootReducer.withLazyLoadedSlices()

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    injectSlice: (slice: any) => void
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeWithInject.injectSlice = (slice: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    currentReducer = currentReducer.inject(slice) as typeof currentReducer
    store.replaceReducer(currentReducer)
  }
  
  return storeWithInject
}

// Registry of API reset actions - populated by features as they load
const apiResetActions: (() => UnknownAction)[] = []

export function registerApiResetAction(resetAction: () => UnknownAction) {
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
