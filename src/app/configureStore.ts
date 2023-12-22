import { configureStore } from "@reduxjs/toolkit";

import notificationsReducer from "../redux/modules/common/notification";
import errorReducer from "../redux/modules/errorHandler";
import { apiSlice } from "../features/api/testApi/apiSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    errorHandler: errorReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
