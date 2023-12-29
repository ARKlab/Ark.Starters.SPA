export enum NotificationDuration {
  VeryShort = 2000, // 2 seconds
  Short = 4000, // 4 seconds
  Medium = 6000, // 6 seconds
  Long = 8000, // 8 seconds
  VeryLong = 10000, // 10 seconds
}

export type NotificationPosition =
  | "top"
  | "top-right"
  | "top-left"
  | "bottom"
  | "bottom-right"
  | "bottom-left";

export type NotificationStatus =
  | "loading"
  | "error"
  | "success"
  | "info"
  | "warning"
  | undefined;

export type NotificationType = {
  id: string;
  duration: NotificationDuration;
  isClosable: boolean;
  status: NotificationStatus;
  title: string;
  message: string;
  position: NotificationPosition;
};
