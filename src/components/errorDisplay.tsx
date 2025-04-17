import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router";
import * as StackTrace from "stacktrace-js";

import useAsyncEffect from "../lib/useAsyncEffect";

import CodeBlock from "./codeBlock";

export const ParsedStackTrace = ({ stack }: { stack?: string }) => {
  const [v, s] = useState(stack);

  useAsyncEffect(async () => {
    if (stack) {
      const res = await StackTrace.fromError({ stack } as Error).catch(_ => undefined);
      if (res) {
        s(res.map(x => x.toString()).join("\n"));
      }
    }
  }, [stack, s]);

  return <CodeBlock>{v}</CodeBlock>;
};

export function ErrorDisplay({ name, message, stack }: { name?: string; message?: string; stack?: string }) {
  const { t } = useTranslation("template");
  return (
    <Box py={10} px={6}>
      <Container>
        <VStack w="100%">
          <Box display="inline-block">
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              bg={"error.solid"}
              rounded={"50px"}
              w={"55px"}
              h={"55px"}
              textAlign="center"
            >
              <IoMdClose color={"fg.error"} />
            </Flex>
          </Box>
          <Heading asChild size="md" mt={6} mb={2}>
            <Link to="" reloadDocument style={{ textDecoration: "underline" }}>
              {t("errorHandler.reload")}{" "}
            </Link>
          </Heading>
          <Heading as="h2" size="xl" mt={6} mb={2}>
            {name ?? t("errorHandler.error")}
          </Heading>
          <Text color={"fg.muted"}>{message}</Text>
          <ParsedStackTrace stack={stack} />
        </VStack>
      </Container>
    </Box>
  );
}
