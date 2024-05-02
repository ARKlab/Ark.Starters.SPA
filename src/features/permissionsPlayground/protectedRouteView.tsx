import { Box, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import BackButton from "../../components/backButton";

const ProtectedRouteView = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Heading my="10px">
        <BackButton mx="20px" />
        {t("permissionsPlayground_protected_route")}
      </Heading>
    </Box>
  );
};

export default ProtectedRouteView;
