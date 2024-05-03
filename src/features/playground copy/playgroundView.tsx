import {
  Box,
  Button,
  Heading,
  Input,
  List,
  ListIcon,
  ListItem,
  Wrap,
  WrapItem,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdCheckCircle } from "react-icons/md";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { userSelector } from "../../lib/authentication/authenticationSlice";
import { dispatchNotification } from "../../lib/notifications/notification";
import { NotificationDuration } from "../../lib/notifications/notificationsTypes";
import type { NotificationPosition } from "../../lib/notifications/notificationsTypes";

const PlaygroundView = () => {
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
  const user = useAppSelector(userSelector);
  const [requiredPermission, setRequiredPermission] = useState<string>("mega:admin");
  const [inputValue, setInputValue] = useState<string>(requiredPermission);

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
      <Box>
        <Heading size="md" my={"20px"}>
          {t("permissionsPlayground_title")}
        </Heading>
        <Heading size="sm" my={"20px"}>
          {t("permissionsPlayground_yourPermissions")}
        </Heading>
        <Box>
          <List>
            {user?.permissions?.map(permission => {
              return (
                <ListItem key={permission}>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  {permission}
                </ListItem>
              );
            })}
          </List>
          <Text my="10px">{t("permissionsPlayground_setPermission")}</Text>
          <InputGroup w={"20%"}>
            <Input
              placeholder={t("permissionsPlayground_permissionPlaceholder")}
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setRequiredPermission(inputValue)}>
                {t("permissionsPlayground_setButton")}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default PlaygroundView;
