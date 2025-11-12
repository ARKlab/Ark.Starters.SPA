import { Box, Flex, Button, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { AppModal } from "../../lib/components/AppModal/appModal";
import type { ErrorDetailsType } from "../../lib/errorHandler/errorHandler";
import { clearError, selectError } from "../../lib/errorHandler/errorHandler";
import CodeBlock from "../codeBlock";
import { ParsedStackTrace } from "../errorDisplay";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "../ui/accordion";

export const AppErrorModal = () => {
  const problem = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const therIsError = problem.error ?? false;
  const problemDetails = problem.details;

  return (
    <AppModal
      size={"xl"}
      open={therIsError}
      onClose={() => {
        dispatch(clearError());
      }}
      title={problemDetails?.title ?? ""}
      body={<ModalBody problem={problemDetails} />}
      blurredOverlay={true}
    />
  );
};

const ModalBody = (props: { problem: ErrorDetailsType | null }) => {
  const problem = props.problem;
  const navigate = useNavigate();
  const { t } = useTranslation("template");
  return (
    <>
      <Stack>
        <CodeBlock variant={"plain"}>{problem?.message}</CodeBlock>

        <AccordionRoot w="full" multiple>
          {problem?.details ? (
            <AccordionItem value={"details"}>
              <h2>
                <AccordionItemTrigger>
                  <Box as="span" flex="1" textAlign="left">
                    {t("errorHandler.details")}
                  </Box>
                </AccordionItemTrigger>
              </h2>
              <AccordionItemContent pb={4}>
                <CodeBlock>{problem.details}</CodeBlock>
              </AccordionItemContent>
            </AccordionItem>
          ) : null}

          {problem?.stack ? (
            <AccordionItem value={"stack"}>
              <h2>
                <AccordionItemTrigger>
                  <Box as="span" flex="1" textAlign="left">
                    StackTrace
                  </Box>
                </AccordionItemTrigger>
              </h2>
              <AccordionItemContent pb={4}>
                <ParsedStackTrace stack={problem.stack} />
              </AccordionItemContent>
            </AccordionItem>
          ) : null}
        </AccordionRoot>
        <Flex justifyContent={"right"}>
          <Button
            colorPalette={"error"}
            onClick={async () => {
              await navigate(0);
            }}
          >
            {t("errorHandler.reload")}
          </Button>
        </Flex>
      </Stack>
    </>
  );
};
