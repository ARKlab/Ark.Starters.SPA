import { Link as ReactRouterLink } from "react-router-dom";
import {
  Link as ChakraLink,
  Image,
  Flex,
  Spacer,
  Center,
  Button,
  Box,
} from "@chakra-ui/react";
import { FaArrowRightFromBracket } from "react-icons/fa6";

const Header = () => {
  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="999" // You can adjust the z-index as needed
      shadow={"md"}
      borderBottom={"2px"}
      borderColor={"lightgrey"}
      width={"100%"}
      height={"60px"}
      bg="white" // Set the background color as needed
    >
      <Flex>
        <Center marginLeft={"20px"}>
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
          <ChakraLink as={ReactRouterLink} to={"/logout"}>
            <Button
              bg={"brand.primary"}
              color="white"
              rightIcon={<FaArrowRightFromBracket />}
              _hover={{ background: "brand.selected" }}
            >
              Exit
            </Button>
          </ChakraLink>
        </Center>
      </Flex>
    </Box>
  );
};

export default Header;
