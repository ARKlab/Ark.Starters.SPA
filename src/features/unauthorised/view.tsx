import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useAuthContext } from "../../lib/authentication/authenticationContext";
import { LoginStatus } from "../../lib/authentication/authTypes";
import { useAppDispatch } from "../../app/hooks";
import { Login } from "../authentication/authenticationSlice";

const Unauthorised = () => {
  const { context, isLogged } = useAuthContext();

  const dispatch = useAppDispatch();
  function login() {
    dispatch(Login());
  }
  return (
    <Box my="70px">
      <Heading as="h2" size="xl">
        Unauthorized
      </Heading>
      {!isLogged ? (
        <>
          <Text fontSize="lg" mt={4}>
            You need to be logged in to view this page.
          </Text>
          <Button colorScheme="teal" variant="outline" mt={4} onClick={login}>
            Login
          </Button>
        </>
      ) : (
        <Text fontSize="lg" mt={4}>
          You do not have the right permissions to access this page.
        </Text>
      )}
    </Box>
  );
};

export default Unauthorised;
