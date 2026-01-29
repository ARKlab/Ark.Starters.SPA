import { Box, Heading } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

import BackButton from "../../components/backButton"

const ProtectedRouteView = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Heading my="2.5">
        <BackButton mx="5" />
        {t("permissionsPlayground_protected_route")}
      </Heading>
    </Box>
  )
}

export default ProtectedRouteView
