import { Box, Heading, Text, Button } from "@chakra-ui/react";
import React, { useState } from "react";

import { useAuthContext } from "../../lib/authentication/components/useAuthContext";

const UserTypesTest: React.FC = () => {
  const [status, setStatus] = useState<string>("Ready");
  const [response, setResponse] = useState<unknown>(null);
  const { context, isLogged } = useAuthContext();

  const makeDirectRequest = async () => {
    setStatus("Making request...");

    try {
      const token = await context.getToken();

      if (!token) {
        setStatus("No token available");
        return;
      }

      const response = await fetch("/userTypes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus(`Response: ${response.status} ${response.statusText}`);

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (Array.isArray(data) && data.length > 0) {
        console.log("First user type:", data[0]);
      }

      setResponse(data);
    } catch (error) {
      console.error("Request failed:", error);
      setStatus(`Error: ${String(error)}`);
      setResponse(error);
    }
  };

  const forceRelogin = async () => {
    setStatus("Forcing complete logout and re-authentication...");
    try {
      localStorage.clear();
      sessionStorage.clear();
      await context.logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setStatus(`Logout failed: ${String(error)}`);
    }
  };

  return (
    <Box p="4">
      <Heading size="md" mb="4">
        Authenticated HTTP Test
      </Heading>
      <Text mb="2" fontSize="sm">
        Auth Status: {isLogged ? "Logged in" : "Not logged in"}
      </Text>
      <Button onClick={makeDirectRequest} colorScheme="blue" mb="2">
        Make Authenticated Request
      </Button>
      <Button onClick={forceRelogin} colorScheme="orange" mb="4" size="sm">
        Re-login (if needed)
      </Button>
      <Text mb="2">Status: {status}</Text>
      {response !== null && (
        <Box mt="4">
          <Text fontWeight="bold" mb="2">
            Response:
          </Text>
          <Box as="pre" fontSize="sm" bg="bg.subtle" p="2" borderRadius="md" maxH="96" overflow="auto">
            {typeof response === "string" ? response : JSON.stringify(response, null, 2)}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserTypesTest;
