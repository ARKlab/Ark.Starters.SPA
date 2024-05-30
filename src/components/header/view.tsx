import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
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
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdQuestionMark } from 'react-icons/md'
import { Then, If, Else } from 'react-if'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  Login,
  Logout,
  authSelector
} from '../../lib/authentication/authenticationSlice'
import { useAuthContext } from '../../lib/authentication/components/useAuthContext'
import { LocaleSwitcher } from '../../lib/i18n/localeSwitcher'
import { Logo } from '../../logo'

import { GlobalLoadingBar } from './GlobalLoadingBar'

const UserMenu = () => {
  const dispatch = useAppDispatch()
  const { isLogged } = useAuthContext()

  const authStore = useAppSelector(authSelector);
  const user = authStore.data
  const { colorMode, toggleColorMode } = useColorMode()
  const [isChecked, setIsChecked] = useState<boolean>(colorMode === 'dark')
  const toggleColorModeWithDelay = () => {
    setIsChecked(!isChecked)
    setTimeout(toggleColorMode, 200) // 200ms delay
  }
  const { t } = useTranslation();
  return (
    <Menu>
      <MenuButton mr="20px">
        <If condition={isLogged}>
          <Then>
            <Avatar name={user?.userInfo?.username || t('menu.user')} src="avatarSource" />
          </Then>
          <Else>
            <Avatar icon={<MdQuestionMark />} />
          </Else>
        </If>
      </MenuButton>
      <MenuList>
        <MenuGroup title={t('menu.options')}>
          <MenuItem
            as={Switch}
            onChange={toggleColorModeWithDelay}
            isChecked={isChecked}
          >
            {t('menu.dark')}
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title={t('menu.account')}>
          <If condition={isLogged}>
            <Then>
              <WrapItem>
                <MenuItem>{user?.userInfo?.username || t('menu.user')}</MenuItem>
              </WrapItem>
              <MenuItem onClick={async () => dispatch(Logout())}>{t('exit')}</MenuItem>
            </Then>
            <Else>
              <WrapItem>
                <MenuItem onClick={async () => dispatch(Login())}>{t('login')}</MenuItem>
              </WrapItem>
            </Else>
          </If>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}

const Header = () => {
  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex={'banner'} // You can adjust the z-index as needed
      shadow={'md'}
      width={'100%'}
      bg="gray.800"
    >
      <Flex
        paddingTop={'5px'}
        paddingBottom={'5px'}
      >
        <Center ml={'20px'} >
          <Logo />
        </Center>
        <Spacer />
        <HStack>
          <Center mr={"20px"}>
            <LocaleSwitcher />
          </Center>
          <Center>
            <UserMenu />
          </Center>
        </HStack>
      </Flex>
      <GlobalLoadingBar />
    </Box>
  )
}


export default Header
