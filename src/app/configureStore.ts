import { configureStore } from "@reduxjs/toolkit";

import notificationsReducer from "../features/notifications/notification";
import errorReducer from "../features/errorHandler/errorHandler";
import { jsonPlaceholderSlice } from "../features/jsonPlaceholderAPI/jsonPlaceholderSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { configTableApiSlice } from "../features/configTable/configTableApi";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    errorHandler: errorReducer,
    [jsonPlaceholderSlice.reducerPath]: jsonPlaceholderSlice.reducer,
    [configTableApiSlice.reducerPath]: configTableApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      jsonPlaceholderSlice.middleware,
      configTableApiSlice.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
