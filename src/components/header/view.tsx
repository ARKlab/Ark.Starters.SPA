import { Link as ReactRouterLink } from "react-router-dom";
import {
  Link as ChakraLink,
  Image,
  Flex,
  Spacer,
  Center,
  Button,
  Box,
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { Logout } from "../../features/authentication/authenticationSlice";
import { useAppDispatch } from "../../app/hooks";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  var dispatch = useAppDispatch();
  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex={"banner"} // You can adjust the z-index as needed
      shadow={"md"}
      width={"100%"}
      height={"60px"}
      bg="gray.800"
    >
      <Flex>
        <Center marginLeft={"20px"} paddingTop={"5px"}>
          <Image
            height={"50px"}
            src="https://ark-energy.eu/wp-content/uploads/2022/07/logo-white.png"
            alt=""
          />
        </Center>
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Center marginRight={"20px"}>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? "Dark" : "Light"} Mode
          </Button>
        </Center>
        <Center marginRight={"20px"}>
          <Button
            onClick={() => dispatch(Logout())}
            colorScheme="brandPalette"
            rightIcon={<FaArrowRightFromBracket />}
            _hover={{ background: "brand.selected" }}
          >
            Exit
          </Button>
        </Center>
      </Flex>
    </Box>
  );
};

export default Header;
