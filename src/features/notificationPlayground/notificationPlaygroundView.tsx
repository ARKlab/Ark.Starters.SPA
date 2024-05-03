import { Box, Button, Heading, Wrap, WrapItem } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import { dispatchNotification } from "../../lib/notifications/notification";
import type { NotificationPosition } from "../../lib/notifications/notificationsTypes";
import { NotificationDuration } from "../../lib/notifications/notificationsTypes";

const NotificationPlaygroundView = () => {
  const dispatch = useAppDispatch();

  const sendNotification = (
    id: string,
    message: string,
    duration: NotificationDuration,
    position: NotificationPosition,
  ) => {
    dispatch(
      dispatchNotification({
        id: id,
        title: t("notification_title"),
        message: message,
        status: "success",
        duration: duration,
        isClosable: true,
        position: position,
      }),
    );
  };

  const { t } = useTranslation();
  const notificationBody = t("notification_body");
  return (
    <Box>
      <Heading>{t("Playground")}</Heading>
      <Box>
        <Heading size="md" my={"20px"}>
          {t("notification_example")}
        </Heading>
        <Wrap spacing={1} my={"20px"}>
          <WrapItem>
            <Button onClick={() => sendNotification("1", notificationBody, NotificationDuration.VeryShort, "top")}>
              {t("top")} "Very Short Norification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button onClick={() => sendNotification("2", notificationBody, NotificationDuration.Short, "top-left")}>
              {t("topleft")} "Short Notification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button onClick={() => sendNotification("3", notificationBody, NotificationDuration.Medium, "top-right")}>
              {t("topright")} "Medium Notification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button onClick={() => sendNotification("4", notificationBody, NotificationDuration.Long, "bottom-left")}>
              {t("bottomleft")} "Long Notification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() => sendNotification("5", notificationBody, NotificationDuration.VeryLong, "bottom-right")}
            >
              {t("bottomright")} "Very Long Notification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button onClick={() => sendNotification("6", notificationBody, NotificationDuration.VeryLong, "bottom")}>
              {t("bottom")} "Very Long Notification"
            </Button>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  );
};

export default NotificationPlaygroundView;
