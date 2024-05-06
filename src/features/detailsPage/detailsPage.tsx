import { Box, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import BackButton from "../../components/backButton";

const DetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <Box>
      <Heading>
        <BackButton mx="20px" /> {t("Playground")}
      </Heading>
      <Box>
        <Heading size="md" my={"20px"}>
          {t("Details for ID:")} {id}
        </Heading>
      </Box>
    </Box>
  );
};

export default DetailsPage;
