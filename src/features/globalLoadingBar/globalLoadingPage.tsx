import { Box, Heading, HStack, Text, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { Button } from "../../components/ui/button";

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
        <Text>
          {t('globalloadingbar.description')}
        </Text>
        <HStack wrap="wrap" gap={1} my={"20px"}>
          <Flex align="flex-start">
            <Button onClick={async () => triggerSlow()} loading={get.isLoading || slow.isLoading} disabled={get.isLoading || slow.isLoading}>
              {t('globalloadingbar.slowButtonText')}
            </Button>
          </Flex>
          <Flex align="flex-start">
            <Button onClick={async () => triggerFast()} loading={get.isLoading || fast.isLoading} disabled={get.isLoading || slow.isLoading}>
              {t('globalloadingbar.fastButtonText')}
            </Button>
          </Flex>
        </HStack>
      </Box>
    </Box>
  );
};

export default GlobalLoadingBarPage;
