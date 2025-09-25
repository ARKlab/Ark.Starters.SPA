import { IconButton } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";

type BackButtonProps = {
  mx?: string;
};

const BackButton = ({ mx }: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <IconButton
      aria-label="Go back"
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
