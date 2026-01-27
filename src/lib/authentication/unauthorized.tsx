import { Box, Heading, Text, Button } from "@chakra-ui/react";

import { useAppDispatch } from "../../app/hooks";

import { Login } from "./authenticationSlice";
import { useAuthContext } from "./components/useAuthContext";

const Unauthorized = () => {
  const { isLogged } = useAuthContext();

  const dispatch = useAppDispatch();
  function login() {
    void dispatch(Login());
  }
  return (
    <Box>
      <Heading as="h2" size="xl">
        Unauthorized
      </Heading>
      {!isLogged ? (
        <>
          <Text fontSize="lg" mt={"4"}>
            You need to be logged in to view this page.
          </Text>
          <Button colorPalette="brand" variant="outline" mt={"4"} onClick={login}>
            Login
          </Button>
        </>
      ) : (
        <Text fontSize="lg" mt={"4"}>
          You do not have the right permissions to access this page.
        </Text>
      )}
    </Box>
  );
};

export default Unauthorized;
