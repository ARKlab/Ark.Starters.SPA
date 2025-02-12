import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Switch,
  WrapItem,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMenu } from "react-icons/fi";
import { MdQuestionMark } from "react-icons/md";
import { Then, If, Else } from "react-if";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Login, Logout, authSelector } from "../../../lib/authentication/authenticationSlice";
import { useAuthContext } from "../../../lib/authentication/components/useAuthContext";
import { LocaleSwitcher } from "../../../lib/i18n/localeSwitcher";
import { Logo } from "../../../logo";
import { useLayoutContext } from "../useLayoutContext";

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
    <Menu>
      <MenuButton>
        <If condition={isLogged}>
          <Then>
            <Avatar name={user?.userInfo?.username ?? t("menu.user")} src="avatarSource" />
          </Then>
          <Else>
            <Avatar icon={<MdQuestionMark />} />
          </Else>
        </If>
      </MenuButton>
      <MenuList>
        <MenuGroup title={t("menu.options")}>
          <MenuItem as={Switch} onChange={toggleColorModeWithDelay} isChecked={isChecked}>
            {t("menu.dark")}
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title={t("menu.account")}>
          <If condition={isLogged}>
            <Then>
              <WrapItem>
                <MenuItem>{user?.userInfo?.username ?? t("menu.user")}</MenuItem>
              </WrapItem>
              <MenuItem onClick={async () => dispatch(Logout())}>{t("menu.exit")}</MenuItem>
            </Then>
            <Else>
              <WrapItem>
                <MenuItem onClick={async () => dispatch(Login())}>{t("menu.login")}</MenuItem>
              </WrapItem>
            </Else>
          </If>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

const Header = () => {
  const { isMobileSiderOpen, setMobileSiderOpen } = useLayoutContext();
  return (
    <Box as="header" shadow={"lg"} bg={"header.bg"}>
      <Flex paddingTop={"5px"} paddingBottom={"5px"}>
        <HStack gap={2} pl={2}>
          <LinkBox>
            <Center>
              <LinkOverlay as={Link} to={"/"}>
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
          <Center display={{ base: "block", lg: "none" }}>
            <If condition={!isMobileSiderOpen}>
              <Then>
                <IconButton
                  variant="outline"
                  aria-label="open menu"
                  onClick={() => {
                    setMobileSiderOpen(true);
                  }}
                  icon={<FiMenu />}
                />
              </Then>
            </If>
          </Center>
        </HStack>
      </Flex>
      <GlobalLoadingBar />
    </Box>
  );
};

export default Header;
