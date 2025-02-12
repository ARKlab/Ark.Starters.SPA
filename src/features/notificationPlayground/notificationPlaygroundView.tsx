import type { ToastPosition } from "@chakra-ui/react";
import { Box, Button, Heading, Wrap, WrapItem, useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const NotificationPlaygroundView = () => {
  const toast = useToast();

  const sendNotification = (title: string, message: string, duration: number, position: ToastPosition) => {
    toast({
      title: title,
      description: message,
      duration: duration,
      position: position,
    });
  };

  const { t } = useTranslation();
  const notificationBody = t("notification_body");
  return (
    <Box>
      <Heading>{t("playground")}</Heading>
      <Box>
        <Heading size="md" my={"20px"}>
          {t("notification_example")}
        </Heading>
        <Wrap gap={1} my={"20px"}>
          <WrapItem>
            <Button
              onClick={() => {
                sendNotification("Very Short Norification", notificationBody, 2000, "top");
              }}
            >
              {t("top")} "Very Short Norification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() => {
                sendNotification("Short Notification", notificationBody, 3000, "top-left");
              }}
            >
              {t("topleft")} "Short Notification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() => {
                sendNotification("Medium Notification", notificationBody, 4000, "top-right");
              }}
            >
              {t("topright")} "Medium Notification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() => {
                sendNotification("Long Notification", notificationBody, 6000, "bottom-left");
              }}
            >
              {t("bottomleft")} "Long Notification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() => {
                sendNotification("Very Long Notification", notificationBody, 8000, "bottom-right");
              }}
            >
              {t("bottomright")} "Very Long Notification"
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() => {
                sendNotification("Very Long Notification", notificationBody, 8000, "bottom");
              }}
            >
              {t("bottom")} "Very Long Notification"
            </Button>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  );
};

export default NotificationPlaygroundView;
