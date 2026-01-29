import { Box, Button, HStack, Heading } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

import { toaster } from "../../components/ui/toaster"

const NotificationPlaygroundView = () => {
  const sendNotification = (title: string, message: string, duration: number) => {
    toaster.create({
      title: title,
      description: message,
      duration: duration,
    })
  }

  const { t } = useTranslation()
  const notificationBody = t("notification_body")
  return (
    <Box>
      <Heading>{t("playground")}</Heading>
      <Box>
        <Heading size="md" my={"5"}>
          {t("notification_example")}
        </Heading>
        <HStack wrap="wrap" gap={"1"} my={"5"}>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Very Short Norification", notificationBody, 2000)
              }}
            >
              {t("top")} "Very Short Norification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Short Notification", notificationBody, 3000)
              }}
            >
              {t("topleft")} "Short Notification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Medium Notification", notificationBody, 4000)
              }}
            >
              {t("topright")} "Medium Notification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Long Notification", notificationBody, 6000)
              }}
            >
              {t("bottomleft")} "Long Notification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Very Long Notification", notificationBody, 8000)
              }}
            >
              {t("bottomright")} "Very Long Notification"
            </Button>
          </HStack>
          <HStack wrap="wrap" align="flex">
            <Button
              onClick={() => {
                sendNotification("Very Long Notification", notificationBody, 8000)
              }}
            >
              {t("bottom")} "Very Long Notification"
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  )
}

export default NotificationPlaygroundView
