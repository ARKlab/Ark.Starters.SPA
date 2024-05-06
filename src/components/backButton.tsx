import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  mx?: string;
};

const BackButton = ({ mx }: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <IconButton
      aria-label="Go back"
      icon={<ArrowBackIcon />}
      onClick={() => navigate(-1)}
      isRound
      mx={mx || "0px"}
    />
  );
};

export default BackButton;
