import { useState } from "react";

import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MdCheckCircle } from "react-icons/md";
import { useAppSelector } from "../../app/hooks";
import { userSelector } from "../../lib/authentication/authenticationSlice";
import ProtectedComponent from "../../lib/authentication/components/protectedComponent";
import { useNavigate } from "react-router-dom";

const PlaygroundView = () => {
  const user = useAppSelector(userSelector);
  const [requiredPermission, setRequiredPermission] =
    useState<string>("mega:admin");
  const [inputValue, setInputValue] = useState<string>(requiredPermission);

  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box>
      <Heading> {t("permissionsPlayground_title")}</Heading>
      <Box>
        <Heading size="md" my={"20px"}></Heading>
        <Heading size="sm" my={"20px"}>
          {t("permissionsPlayground_yourPermissions", {
            username: user?.username,
          })}
        </Heading>
        <Box>
          <List bg={"orange.100"} w="20%">
            {user?.permissions?.map((permission) => {
              return (
                <ListItem key={permission}>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  {permission}
                </ListItem>
              );
            })}
          </List>
          <Divider my={"20px"} />
          <Heading size="md" my={"20px"}>
            {t("permissionsPlayground_componentTitle")}
          </Heading>
          <Text my="10px">{t("permissionsPlayground_setPermission")}</Text>
          <InputGroup w={"20%"}>
            <Input
              placeholder={t("permissionsPlayground_permissionPlaceholder")}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setRequiredPermission(inputValue)}
              >
                {t("permissionsPlayground_setButton")}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Heading size="sm" my={"20px"}>
            {t("permissionsPlayground_protectedComponent")}
          </Heading>
          <ProtectedComponent
            permissions={requiredPermission.split(",")}
            component={
              <Box bg="green.100">
                {t("permissionsPlayground_havePermission")}
              </Box>
            }
            fallBackComponent={
              <Box bg="red.100">{t("permissionsPlayground_noPermission")}</Box>
            }
          />
        </Box>
        <Divider my={"20px"} />
        <Box>
          <Heading size="md" my={"20px"}>
            {t("permissionsPlayground_goToProtectedRoute")}{" "}
          </Heading>
          <Button onClick={() => navigate("/main/protectedRoute")}>
            {t("permissionsPlayground_goToProtectedRouteButton")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PlaygroundView;
