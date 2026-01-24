import { Box, Button, Heading, Text, Wrap, WrapItem } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

import { useSlowGetQuery, useFastMutationMutation, useSlowMutationMutation } from "./globalLoadingSlice"

const GlobalLoadingBarPage = () => {
  const { t } = useTranslation()

  const get = useSlowGetQuery()

  const [triggerSlow, slow] = useSlowMutationMutation()
  const [triggerFast, fast] = useFastMutationMutation()

  return (
    <Box>
      <Heading>{t("globalloadingbar.title")}</Heading>
      <Box>
        <Text>{t("globalloadingbar.description")}</Text>
        <Wrap gap={"1"} my={"5"}>
          <WrapItem>
            <Button
              onClick={async () => triggerSlow()}
              loading={get.isLoading || slow.isLoading}
              disabled={get.isLoading || slow.isLoading}
            >
              {t("globalloadingbar.slowButtonText")}
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={async () => triggerFast()}
              loading={get.isLoading || fast.isLoading}
              disabled={get.isLoading || slow.isLoading}
            >
              {t("globalloadingbar.fastButtonText")}
            </Button>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  )
}

export default GlobalLoadingBarPage
