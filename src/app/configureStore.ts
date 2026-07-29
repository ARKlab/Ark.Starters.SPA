import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore, combineSlices } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { userManagementApi } from "../features/userManagement/userManagementApi";
import { authSlice } from "../lib/authentication/authenticationSlice";
import { envSlice } from "../lib/authentication/envSlice";
import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface";
import errorReducer from "../lib/errorHandler/errorHandler";

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const sliceReducers = combineSlices(
  authSlice,
  envSlice,

  userManagementApi,

  {
    errorHandler: errorReducer,
  },
);

// Infer the `RootState` type from the root reducer
export type AppState = ReturnType<typeof sliceReducers>;

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
        userManagementApi.middleware,
      ),
  });

  setupListeners(store.dispatch);
  return store;
}

export const resetApiActions = [
  userManagementApi.util.resetApiState(),
];

export type ExtraType = {
  authProvider: AuthProvider;
};

export type AppStore = ReturnType<typeof initStore>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, AppState, ExtraType, Action>;
