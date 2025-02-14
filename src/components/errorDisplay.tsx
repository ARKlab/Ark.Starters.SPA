import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

import CodeBlock from "./codeBlock";

export function ErrorDisplay({ name, message, stack }: { name?: string; message?: string; stack?: string }) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={"brand.errorBackGround"}
          rounded={"50px"}
          w={"55px"}
          h={"55px"}
          textAlign="center"
        >
          <IoMdClose color={"white"} />
        </Flex>
      </Box>
      <Container centerContent>
        <VStack w="100%">
          <Heading asChild size="md" mt={6} mb={2}>
            <Link to="" reloadDocument style={{ textDecoration: "underline" }}>
              Force Reload
            </Link>
          </Heading>
          <Heading as="h2" size="xl" mt={6} mb={2}>
            {name ?? "Sorry, unknown error."}
          </Heading>
          <Text color={"fg.muted"}>{message}</Text>
          <CodeBlock>{stack}</CodeBlock>
        </VStack>
      </Container>
    </Box>
  );
}
