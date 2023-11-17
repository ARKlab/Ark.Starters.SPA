import { NotificationDuration } from "../../enums";
import { NotificationType } from "./notificationsTypes";

export const key = "notifications";
const notificationShowNotification = "notifications/SHOWNOTIFICATION";
const notificationResetNotification = "notifications/RESETNOTIFICATION";
export const notificationShowNotificationAction = (
  notification: NotificationType
) =>
  ({
    type: notificationShowNotification,
    notification,
  } as const);

export const notificationResetNotificationAction = () =>
  ({
    type: notificationResetNotification,
  } as const);

type Action = ReturnType<
  | typeof notificationShowNotificationAction
  | typeof notificationResetNotificationAction
>;

type State = { notification: NotificationType | null };

const initialState: State = { notification: null };

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case notificationShowNotification:
      return { ...state, notification: action.notification };
    case notificationResetNotification:
      return { initialState };
    default:
      return state;
  }
}

const baseSelector = (s: any): State => s[key];

export const Selectors = {
  all: baseSelector,
};
export const dispatchNotification = (
  notification: NotificationType
): { type: string } => {
  return notificationShowNotificationAction({
    id: notification.id,
    duration: notification.duration,
    title: notification.title,
    status: notification.status,
    isClosable: notification.isClosable,
    message: notification.message,
  });
};
