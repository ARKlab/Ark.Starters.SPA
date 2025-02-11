import { IconButton } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md"; 
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  mx?: string;
};

const BackButton = ({ mx }: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <IconButton
      aria-label="Go back"
      onClick={() => {
        navigate(-1);
      }}
      rounded="full"
      mx={mx ?? "0px"}
    >
      <MdArrowBack/>
    </IconButton>
  );
};

export default BackButton;
