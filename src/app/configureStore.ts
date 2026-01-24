import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore, combineSlices } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { configTableApiSlice } from "../features/configTable/configTableApi"
import { jsonPlaceholderApi } from "../features/fetchApiExample/jsonPlaceholderApi"
import { videoGameApiSlice } from "../features/formExample/videoGamesApiSlice"
import { globalLoadingSlice } from "../features/globalLoadingBar/globalLoadingSlice"
import { moviesApiSlice } from "../features/paginatedTable/paginatedTableApi"
import { rtkqErrorHandlingApi } from "../features/rtkqErrorHandling/rtkqErrorHandlingApi"
import { authSlice } from "../lib/authentication/authenticationSlice"
import { envSlice } from "../lib/authentication/envSlice"
import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface"
import { tableStateSlice } from "../lib/components/AppArkApiTable/tableStateSlice"
import errorReducer from "../lib/errorHandler/errorHandler"

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const sliceReducers = combineSlices(
  authSlice,
  envSlice,
  tableStateSlice,
  configTableApiSlice,
  videoGameApiSlice,
  jsonPlaceholderApi,
  moviesApiSlice,
  rtkqErrorHandlingApi,

  globalLoadingSlice,
  {
    errorHandler: errorReducer,
    table: tableStateSlice.reducer,
  },
)

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
      }).concat(
        jsonPlaceholderApi.middleware,
        configTableApiSlice.middleware,
        moviesApiSlice.middleware,
        videoGameApiSlice.middleware,
        globalLoadingSlice.middleware,
        rtkqErrorHandlingApi.middleware,
      ),
  })

  setupListeners(store.dispatch)
  return store
}

export const getResetApiActions = () => [
  jsonPlaceholderApi.util.resetApiState(),
  configTableApiSlice.util.resetApiState(),
  moviesApiSlice.util.resetApiState(),
  videoGameApiSlice.util.resetApiState(),
  globalLoadingSlice.util.resetApiState(),
  rtkqErrorHandlingApi.util.resetApiState(),
]

export type ExtraType = {
  authProvider: AuthProvider
}

export type AppStore = ReturnType<typeof initStore>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, AppState, ExtraType, Action>
