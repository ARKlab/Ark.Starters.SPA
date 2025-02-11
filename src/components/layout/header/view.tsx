import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  MenuRoot,
  MenuTrigger,
  Separator,
  MenuItem,
  Spacer,
  MenuContent,
  Avatar,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMenu } from "react-icons/fi";
import { MdQuestionMark } from "react-icons/md";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Login, Logout, authSelector } from "../../../lib/authentication/authenticationSlice";
import { useAuthContext } from "../../../lib/authentication/components/useAuthContext";
import { LocaleSwitcher } from "../../../lib/i18n/localeSwitcher";
import { Logo } from "../../../logo";
//import { useLayoutContext } from "../useLayoutContext";

import { useColorMode } from "../../ui/color-mode-helper";

import { GlobalLoadingBar } from "./GlobalLoadingBar";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const { isLogged } = useAuthContext();
  const authStore = useAppSelector(authSelector);
  const user = authStore.data;
  const { colorMode, toggleColorMode } = useColorMode();
  const [isChecked, setIsChecked] = useState<boolean>(colorMode === "dark");

  const toggleColorModeWithDelay = () => {
    setIsChecked(!isChecked);
    setTimeout(toggleColorMode, 200); // 200ms delay
  };

  const { t } = useTranslation("template");

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        {isLogged ? (
          <Avatar.Root>
            <Avatar.Fallback>{user?.userInfo?.username ?? t("menu.user")}</Avatar.Fallback>
          </Avatar.Root>
        ) : (
          <Avatar.Root>
            <MdQuestionMark />
          </Avatar.Root>
        )}
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="Switch" onSelect={toggleColorModeWithDelay}>
          {t("menu.dark")}
        </MenuItem>
        <Separator />
        {isLogged ? (
          <>
            <MenuItem value="user">{user?.userInfo?.username ?? t("menu.user")}</MenuItem>
            <MenuItem value="exit" onSelect={async () => dispatch(Logout())}>
              {t("menu.exit")}
            </MenuItem>
          </>
        ) : (
          <MenuItem value="login" onSelect={async () => dispatch(Login())}>
            {t("menu.login")}
          </MenuItem>
        )}
      </MenuContent>
    </MenuRoot>
  );
};

const Header = () => {
  //const { isMobileSiderOpen, setMobileSiderOpen } = useLayoutContext();

  return (
    <Box as="header" shadow="lg" bg="header.bg">
      <Flex paddingTop="5px" paddingBottom="5px">
        <HStack gap={2} pl={2}>
          <LinkBox>
            <Center>
              <LinkOverlay as={Link} href={"/"}>
                <Logo />
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
          {/*<Center display={{ base: "block", lg: "none" }}>{!isMobileSiderOpen && <Logo />}</Center>*/}
        </HStack>
      </Flex>
      <GlobalLoadingBar />
    </Box>
  );
};

export default Header;
