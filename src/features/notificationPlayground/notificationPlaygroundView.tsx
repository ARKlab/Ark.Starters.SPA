import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import type { Placement } from "../../../node_modules/@zag-js/toast/dist/index.d.ts";
import { toaster } from "../../components/ui/toaster-helper";

const NotificationPlaygroundView = () => {
  const sendNotification = (title: string, message: string, duration: number, placement: Placement) => {
    toaster.create({
      title: title,
      description: message,
      duration: duration,
      placement: placement,
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
        <HStack wrap="wrap" gap={1} my={"20px"}>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Very Short Norification", notificationBody, 2000, "top");
              }}
            >
              {t("top")} "Very Short Norification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Short Notification", notificationBody, 3000, "top-start");
              }}
            >
              {t("topleft")} "Short Notification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Medium Notification", notificationBody, 4000, "top-end");
              }}
            >
              {t("topright")} "Medium Notification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Long Notification", notificationBody, 6000, "bottom-start");
              }}
            >
              {t("bottomleft")} "Long Notification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Very Long Notification", notificationBody, 8000, "bottom-end");
              }}
            >
              {t("bottomright")} "Very Long Notification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Very Long Notification", notificationBody, 8000, "bottom");
              }}
            >
              {t("bottom")} "Very Long Notification"
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default NotificationPlaygroundView;
