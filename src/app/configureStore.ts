import { configureStore } from "@reduxjs/toolkit";

import notificationsReducer from "../lib/notifications/notification";
import errorReducer from "../lib/errorHandler/errorHandler";
import { jsonPlaceholderSlice } from "../features/fetchApiExample/jsonPlaceholderSlice";
import { configTableApiSlice } from "../features/configTable/configTableApi";
import { moviesApiSlice } from "../features/paginatedTable/paginatedTableApi";
import { videoGameApiSlice } from "../features/formExample/videoGamesApiSlice";
import { authSlice } from "../lib/authentication/authenticationSlice";
import { AuthProvider } from "../lib/authentication/providers/authProviderInterface";
import { envSlice } from "../lib/authentication/envSlice";

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
        videoGameApiSlice.middleware
      ),
  });
}
