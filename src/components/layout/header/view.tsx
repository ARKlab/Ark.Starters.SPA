import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  MenuTrigger,
  Spacer,
  WrapItem,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiMenu } from "react-icons/fi";
import { Link as ReactRouterLink } from "react-router";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Login, Logout, authSelector } from "../../../lib/authentication/authenticationSlice";
import { useAuthContext } from "../../../lib/authentication/components/useAuthContext";
import { GlobalLoadingBar } from "../../../lib/GlobalLoadingBar";
import { LocaleSwitcher } from "../../../lib/i18n/localeSwitcher";
import { Logo } from "../../../logo";
import { ColorModeButton } from "../../ui/color-mode";
import { MenuContent, MenuItem, MenuItemGroup, MenuRoot, MenuSeparator } from "../../ui/menu";
import { useLayoutContext } from "../useLayoutContext";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const { isLogged } = useAuthContext();

  const authStore = useAppSelector(authSelector);
  const user = authStore.data;

  const { t } = useTranslation("template");
  return (
    <MenuRoot>
      <MenuTrigger>
        {isLogged ? (
          <Avatar.Root>
            <Avatar.Fallback name={user?.userInfo?.username ?? t("menu.user")} />
          </Avatar.Root>
        ) : (
          <Avatar.Root>
            <Avatar.Icon />
          </Avatar.Root>
        )}
      </MenuTrigger>
      <MenuContent>
        <MenuItemGroup title={t("menu.options")}>
          <MenuItem value={"mode-switch"}>
            Theme <ColorModeButton />
          </MenuItem>
        </MenuItemGroup>
        <MenuSeparator />
        <MenuItemGroup title={t("menu.account")}>
          {isLogged ? (
            <>
              <WrapItem>
                <MenuItem value={user?.userInfo?.username ?? t("menu.user")}>
                  {user?.userInfo?.username ?? t("menu.user")}
                </MenuItem>
              </WrapItem>
              <MenuItem value={"exit"} onClick={async () => dispatch(Logout())}>
                {t("menu.exit")}
              </MenuItem>
            </>
          ) : (
            <WrapItem>
              <MenuItem value={"login"} onClick={async () => dispatch(Login())}>
                {t("menu.login")}
              </MenuItem>
            </WrapItem>
          )}
        </MenuItemGroup>
      </MenuContent>
    </MenuRoot>
  );
};

const Header = () => {
  const { isDesktop, isMobileSiderOpen, setMobileSiderOpen } = useLayoutContext();
  return (
    <Box as="header" shadow={"sm"} bg={"header"}>
      <Flex paddingTop={"5px"} paddingBottom={"5px"}>
        <HStack gap={2} pl={2}>
          <LinkBox>
            <Center>
              <LinkOverlay asChild>
                <ReactRouterLink to="/">
                  <Logo />
                </ReactRouterLink>
              </LinkOverlay>
            </Center>
          </LinkBox>
        </HStack>
        <Spacer />
        <HStack gap={2} pr={2}>
          <Center>
            <LocaleSwitcher />
          </Center>
          <Center>
            <UserMenu />
          </Center>
          {!isDesktop && !isMobileSiderOpen ? (
            <Center>
              <IconButton
                variant="outline"
                aria-label="open menu"
                onClick={() => {
                  setMobileSiderOpen(true);
                }}
              >
                <FiMenu />
              </IconButton>
            </Center>
          ) : undefined}
        </HStack>
      </Flex>
      <GlobalLoadingBar />
    </Box>
  );
};

export default Header;
