import * as t from "io-ts";
import { NotificationDuration, NotificationStatus } from "../../enums";

export const Notification = t.type({
  id: t.string,
  duration: t.union([
    t.literal(NotificationDuration.Short),
    t.literal(NotificationDuration.VeryShort),
    t.literal(NotificationDuration.Medium),
    t.literal(NotificationDuration.Long),
    t.literal(NotificationDuration.VeryLong),
  ]),
  isClosable: t.boolean,
  status: t.union([
    t.literal("error"),
    t.literal("info"),
    t.literal("warning"),
    t.literal("success"),
    t.undefined,
  ]),
  title: t.string,
  message: t.string,
});

export type NotificationType = t.TypeOf<typeof Notification>;
