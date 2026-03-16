import { Box, Button, Center, Heading, Icon, Stack, Text } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"
import { LuLock, LuLogIn, LuShieldOff } from "react-icons/lu"

import { useAppDispatch } from "../../app/hooks"
import { Login } from "./authenticationSlice"
import { useAuthContext } from "./components/useAuthContext"

const Unauthorized = () => {
  const { isLogged } = useAuthContext()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  function login() {
    void dispatch(Login())
  }

  return (
    <Center style={{ minHeight: "70dvh" }}>
      <Stack align="center" gap="6" maxW="md" textAlign="center" px="6">
        <Box bg="error.subtle" color="error.fg" borderRadius="full" p="5">
          <Icon as={isLogged ? LuShieldOff : LuLock} boxSize="10" />
        </Box>

        <Stack gap="2">
          <Heading as="h1" size="2xl">
            {t("unauthorized_title")}
          </Heading>
          <Text fontSize="lg" fontWeight="semibold">
            {isLogged
              ? t("unauthorized_noPermissionSubtitle")
              : t("unauthorized_notLoggedSubtitle")}
          </Text>
          <Text color="fg.muted">
            {isLogged
              ? t("unauthorized_noPermissionDescription")
              : t("unauthorized_notLoggedDescription")}
          </Text>
        </Stack>

        {!isLogged && (
          <Button colorPalette="brand" size="lg" onClick={login}>
            <LuLogIn />
            {t("unauthorized_loginButton")}
          </Button>
        )}
      </Stack>
    </Center>
  )
}

export default Unauthorized
