import type { Action, ThunkAction} from '@reduxjs/toolkit';
import { configureStore , combineSlices} from '@reduxjs/toolkit'
import { setupListeners } from "@reduxjs/toolkit/query"

import { authSlice } from '../features/authentication/authenticationSlice'
import { envSlice } from '../features/authentication/envSlice'
import { configTableApiSlice } from '../features/configTable/configTableApi'
import errorReducer from '../features/errorHandler/errorHandler'
import { videoGameApiSlice } from '../features/formExample/videoGamesApiSlice'
import { jsonPlaceholderSlice } from '../features/jsonPlaceholderAPI/jsonPlaceholderSlice'
import notificationsReducer from '../features/notifications/notification'
import { moviesApiSlice } from '../features/paginatedTable/paginatedTableApi'
import type { AuthProvider } from '../lib/authentication/authProviderInterface'


// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const sliceReducers = combineSlices(authSlice, envSlice, configTableApiSlice, videoGameApiSlice, jsonPlaceholderSlice, moviesApiSlice,
  {
      'notifications': notificationsReducer,
      'errorHandler': errorReducer
  })
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof sliceReducers>

export function initStore(authProviderInstance: AuthProvider) {
  const store = configureStore({
    reducer: sliceReducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            authProvider: authProviderInstance,
          },
          serializableCheck: false,
        },
      }).concat(
        jsonPlaceholderSlice.middleware,
        configTableApiSlice.middleware,
        moviesApiSlice.middleware,
        videoGameApiSlice.middleware
      )
  });

  setupListeners(store.dispatch)
  return store;
}

export type ExtraType = {
  authProvider: AuthProvider
}

export type AppStore = ReturnType<typeof initStore>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  ExtraType,
  Action
>
