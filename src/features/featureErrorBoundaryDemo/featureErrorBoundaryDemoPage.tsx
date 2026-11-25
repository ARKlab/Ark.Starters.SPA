import { Box, Button, Heading, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { FeatureErrorBoundary } from "../../lib/components/FeatureErrorBoundary/FeatureErrorBoundary"

const DemoWidget = () => {
  const { t } = useTranslation()
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) throw new Error(t("featureErrorBoundaryDemo_errorMessage"))

  return (
    <Box p="4" borderWidth="1px" borderColor="border" borderRadius="md">
      <Text mb="2">{t("featureErrorBoundaryDemo_widgetContent")}</Text>
      <Button
        size="sm"
        onClick={() => {
          setShouldThrow(true)
        }}
      >
        {t("featureErrorBoundaryDemo_throwError")}
      </Button>
    </Box>
  )
}

export default function FeatureErrorBoundaryDemoPage() {
  const { t } = useTranslation()

  return (
    <Box>
      <Heading mb="2">{t("featureErrorBoundaryDemo_title")}</Heading>
      <Text mb="4">{t("featureErrorBoundaryDemo_description")}</Text>
      <FeatureErrorBoundary featureLabel={t("featureErrorBoundaryDemo_widgetLabel")}>
        <DemoWidget />
      </FeatureErrorBoundary>
    </Box>
  )
}
