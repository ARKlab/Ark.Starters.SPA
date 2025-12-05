import { IconButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

type BackButtonProps = {
  mx?: string;
};

const BackButton = ({ mx }: BackButtonProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <IconButton
      aria-label={t("backButton_goBack")}
      onClick={() => {
        void navigate(-1);
      }}
      rounded={"full"}
      mx={mx ?? "0px"}
    >
      <FaArrowLeft />
    </IconButton>
  );
};

export default BackButton;
