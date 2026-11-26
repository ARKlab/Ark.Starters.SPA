import { Box, Text } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

import { PageTitle } from "../../lib/components/AppPageTitle/appPageTitle"

export default function PageTitleDemoPage() {
  const { t } = useTranslation()

  return (
    <Box>
      <PageTitle pageTitle={t("pageTitleDemo_title")} />
      <Text mb="6">{t("pageTitleDemo_description")}</Text>
      <PageTitle pageTitle={t("pageTitleDemo_sectionTitle")} backBtn={false} as="h2" size="lg" />
    </Box>
  )
}
