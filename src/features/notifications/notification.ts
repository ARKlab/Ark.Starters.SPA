import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "./notificationsTypes";
import { RootState } from "../../app/configureStore";

type State = { notification: NotificationType | null };

const initialState: State = { notification: null };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notification = action.payload;
    },
    resetNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { showNotification, resetNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;

// Selettori
export const selectNotification = (state: RootState) =>
  state.notifications.notification;

// Azione dispatch
export const dispatchNotification = (notification: NotificationType) =>
  showNotification({
    id: notification.id,
    duration: notification.duration,
    title: notification.title,
    status: notification.status,
    isClosable: notification.isClosable,
    message: notification.message,
    position: notification.position,
  });
