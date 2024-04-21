import {
  Avatar,
  Box,
  Center,
  Flex,
  Image,
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
import { MdQuestionMark } from 'react-icons/md'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  Login,
  Logout,
  authSelector
} from '../../features/authentication/authenticationSlice'
import { useAuthContext } from '../../lib/authentication/useAuthContext'

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
  function login() {
    dispatch(Login())
  }
  if (!isLogged) {
    return (
      <Menu>
        <MenuButton mr="20px">
          <Avatar icon={<MdQuestionMark />} />
        </MenuButton>
        <MenuList>
          <MenuGroup title="Options">
            <MenuItem
              as={Switch}
              onChange={toggleColorModeWithDelay}
              isChecked={isChecked}
            >
              Dark Mode
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Account">
            <WrapItem>
              <MenuItem onClick={login}>Login</MenuItem>
            </WrapItem>
            <WrapItem>
              <MenuItem onClick={async () => dispatch(Logout())}>Exit</MenuItem>
            </WrapItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    )
  }
  return (
    <Menu>
      <MenuButton mr="20px">
        <Avatar name={user?.userInfo?.username || 'User'} src="avatarSource" />
      </MenuButton>
      <MenuList>
        <MenuGroup title="Options">
          <MenuItem
            as={Switch}
            onChange={toggleColorModeWithDelay}
            isChecked={isChecked}
          >
            Dark Mode
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Account">
          <WrapItem>
            <MenuItem>{user?.userInfo?.username || 'User'}</MenuItem>
          </WrapItem>
          <MenuItem onClick={async () => dispatch(Logout())}>Exit</MenuItem>
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
      height={'60px'}
      bg="gray.800"
    >
      <Flex>
        <Center ml={'20px'} paddingTop={'5px'}>
          <Image
            height={'50px'}
            src="https://ark-energy.eu/wp-content/uploads/2022/07/logo-white.png"
            alt=""
          />
        </Center>
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Center>
          <UserMenu />
        </Center>
      </Flex>
    </Box>
  )
}

export default Header
