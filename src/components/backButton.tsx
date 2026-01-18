import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

type BackButtonProps = {
  mx?: IconButtonProps["mx"];
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
      mx={mx ?? "0"}
    >
      <FaArrowLeft />
    </IconButton>
  );
};

export default BackButton;
