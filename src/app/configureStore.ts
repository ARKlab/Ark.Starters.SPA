import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, combineSlices } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { configTableApiSlice } from "../features/configTable/configTableApi";
import { jsonPlaceholderApi } from "../features/fetchApiExample/jsonPlaceholderApi";
import { videoGameApiSlice } from "../features/formExample/videoGamesApiSlice";
import { globalLoadingSlice } from "../features/globalLoadingBar/globalLoadingApi";
import { moviesApiSlice } from "../features/paginatedTable/paginatedTableApi";
import { authSlice } from "../lib/authentication/authenticationSlice";
import { envSlice } from "../lib/authentication/envSlice";
import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface";
import errorReducer from "../lib/errorHandler/errorHandler";

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const sliceReducers = combineSlices(
  authSlice,
  envSlice,

  configTableApiSlice,
  videoGameApiSlice,
  jsonPlaceholderApi,
  moviesApiSlice,

  globalLoadingSlice,
  {
    errorHandler: errorReducer,
  },
);

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof sliceReducers>;

export function initStore(authProviderInstance: AuthProvider) {
  const store = configureStore({
    reducer: sliceReducers,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            authProvider: authProviderInstance,
          },
          serializableCheck: true,
        },
      }).concat(
        jsonPlaceholderApi.middleware,
        configTableApiSlice.middleware,
        moviesApiSlice.middleware,
        videoGameApiSlice.middleware,
        globalLoadingSlice.middleware,
      ),
  });

  setupListeners(store.dispatch);
  return store;
}

export const resetApiActions = [
  jsonPlaceholderApi.util.resetApiState(),
  configTableApiSlice.util.resetApiState(),
  moviesApiSlice.util.resetApiState(),
  videoGameApiSlice.util.resetApiState(),
  globalLoadingSlice.util.resetApiState(),
];

export type ExtraType = {
  authProvider: AuthProvider;
};

export type AppStore = ReturnType<typeof initStore>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, ExtraType, Action>;
