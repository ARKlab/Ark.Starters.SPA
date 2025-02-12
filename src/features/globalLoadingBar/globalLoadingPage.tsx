import { Box, Button, Heading, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { useSlowGetQuery, useFastMutationMutation, useSlowMutationMutation } from "./globalLoadingApi";

const GlobalLoadingBarPage = () => {
  const { t } = useTranslation();

  const get = useSlowGetQuery();

  const [triggerSlow, slow] = useSlowMutationMutation();
  const [triggerFast, fast] = useFastMutationMutation();

  return (
    <Box>
      <Heading>{t("globalloadingbar.title")}</Heading>
      <Box>
        <Text>{t("globalloadingbar.description")}</Text>
        <Wrap spacing={1} my={"20px"}>
          <WrapItem>
            <Button
              onClick={async () => triggerSlow()}
              isLoading={get.isLoading || slow.isLoading}
              disabled={get.isLoading || slow.isLoading}
            >
              {t("globalloadingbar.slowButtonText")}
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={async () => triggerFast()}
              isLoading={get.isLoading || fast.isLoading}
              disabled={get.isLoading || slow.isLoading}
            >
              {t("globalloadingbar.fastButtonText")}
            </Button>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  );
};

export default GlobalLoadingBarPage;
