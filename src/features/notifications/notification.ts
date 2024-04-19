import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { NotificationType } from './notificationsTypes'

type State = { notification: NotificationType | null }

const initialState: State = { notification: null }

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notification = action.payload
    },
    resetNotification: (state) => {
      state.notification = null
    },
  },
  selectors: {
    selectNotification: (s) => s.notification,
  },
})

export const { showNotification, resetNotification } =
  notificationsSlice.actions

export default notificationsSlice.reducer

export const selectNotificationsState = notificationsSlice.selectSlice
export const { selectNotification } = notificationsSlice.selectors

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
  })
