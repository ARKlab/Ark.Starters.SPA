import { configureStore } from "@reduxjs/toolkit";

import notificationsReducer from "../features/notifications/notification";
import errorReducer from "../features/errorHandler/errorHandler";
import { jsonPlaceholderSlice } from "../features/jsonPlaceholderAPI/jsonPlaceholderSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { configTableApiSlice } from "../features/configTable/configTableApi";
import { moviesApiSlice } from "../features/paginatedTable/paginatedTableApi";
import { videoGameApiSlice } from "../features/formExample/videoGamesApiSlice";
import { authSlice } from "../features/authentication/authenticationSlice";
import { authPlaygroundApi } from "../features/authPlaygroundAPI/authPlaygroundApiSlice";
import { AuthProvider } from "../lib/authentication/authProviderInterface";
import { envSlice } from "../features/authentication/envSlice";

export function initStore(authProviderInstance: AuthProvider) {
  return configureStore({
    reducer: {
      notifications: notificationsReducer,
      errorHandler: errorReducer,
      [jsonPlaceholderSlice.reducerPath]: jsonPlaceholderSlice.reducer,
      [configTableApiSlice.reducerPath]: configTableApiSlice.reducer,
      [moviesApiSlice.reducerPath]: moviesApiSlice.reducer,
      [videoGameApiSlice.reducerPath]: videoGameApiSlice.reducer,
      [authSlice.reducerPath]: authSlice.reducer,
      [authPlaygroundApi.reducerPath]: authPlaygroundApi.reducer,
      [envSlice.reducerPath]: envSlice.reducer,
    },
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
        videoGameApiSlice.middleware,
        authPlaygroundApi.middleware
      ),
  });
}
