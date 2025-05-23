import { Box, Button, Separator, Heading, Input, List, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdCheckCircle } from "react-icons/md";
import { useNavigate } from "react-router";

import { useAppSelector } from "../../app/hooks";
import { InputGroup } from "../../components/ui/input-group";
import { userSelector } from "../../lib/authentication/authenticationSlice";
import ProtectedComponent from "../../lib/authentication/components/protectedComponent";

const PlaygroundView = () => {
  const user = useAppSelector(userSelector);
  const [requiredPermission, setRequiredPermission] = useState<string>("mega:admin");
  const [inputValue, setInputValue] = useState<string>(requiredPermission);
  const permissions: string[] = user?.permissions ?? [];
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
          <List.Root bg={"bg.error"} w="20%">
            {permissions.map(permission => {
              return (
                <List.Item key={permission}>
                  <List.Indicator asChild color="bg.success">
                    <MdCheckCircle />
                  </List.Indicator>
                  {permission}
                </List.Item>
              );
            })}
          </List.Root>
          {permissions.length === 0 && <Text>{t("permissionsPlayground_noPermissions")}</Text>}
          <Separator my={"20px"} />
          <Heading size="md" my={"20px"}>
            {t("permissionsPlayground_componentTitle")}
          </Heading>
          <Text my="10px">{t("permissionsPlayground_setPermission")}</Text>
          <InputGroup
            w={"20%"}
            endElement={
              <Box width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => {
                    setRequiredPermission(inputValue);
                  }}
                >
                  {t("permissionsPlayground_setButton")}
                </Button>
              </Box>
            }
          >
            <Input
              placeholder={t("permissionsPlayground_permissionPlaceholder")}
              value={inputValue}
              onChange={event => {
                setInputValue(event.target.value);
              }}
            />
          </InputGroup>
          <Heading size="sm" my={"20px"}>
            {t("permissionsPlayground_protectedComponent")}
          </Heading>
          <ProtectedComponent
            permissions={requiredPermission.split(",")}
            fallBackComponent={<Box colorPalette={"error"}>{t("permissionsPlayground_noPermission")}</Box>}
          >
            <Box>{t("permissionsPlayground_havePermission")}</Box>
          </ProtectedComponent>
        </Box>
        <Separator my={"20px"} />
        <Box>
          <Heading size="md" my={"20px"}>
            {t("permissionsPlayground_goToProtectedRoute")}
          </Heading>
          <Button
            onClick={async () => {
              await navigate("/protectedRoute");
            }}
          >
            Go!
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PlaygroundView;
