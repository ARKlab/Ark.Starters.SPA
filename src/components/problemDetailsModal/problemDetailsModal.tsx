import { Badge, Box, Card, Code, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import type { DetailsType } from "../../lib/errorHandler/errorHandler";
import { clearError, selectError } from "../../lib/errorHandler/errorHandler";
import { ChackraUIBaseModal } from "../chackraModal/chackraBaseModal";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "../ui/accordion";

export const ProblemDetailsModal = () => {
  const problem = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const therIsError = problem.error ?? false;
  const problemDetails = problem.details;

  return (
    <ChackraUIBaseModal
      size={"xl"}
      open={therIsError}
      onClose={() => {
        dispatch(clearError());
      }}
      title={problemDetails?.title ?? ""}
      body={<ProblemDetailsModalBody problem={problemDetails} />}
      blurredOverlay={true}
    />
  );
};

const ProblemDetailsModalBody = (props: { problem: DetailsType | null }) => {
  const problem = props.problem;
  const navigate = useNavigate();
  return (
    <>
      <Flex>
        <Badge colorPalette="errorPalette">ERROR {problem?.status}</Badge>
      </Flex>
      <Flex my="20px">
        <Card.Root>
          <Card.Body>
            <Code colorPalette="greyPalette">
              {problem?.originalDetail ? problem.originalDetail : problem?.message}
            </Code>
          </Card.Body>
        </Card.Root>
      </Flex>
      <Flex my="20px">
        <AccordionRoot w="full">
          <AccordionItem value={"AccordionButton"}>
            <h2>
              <AccordionItemTrigger>
                <Box as="span" flex="1" textAlign="left">
                  StackTrace
                </Box>
              </AccordionItemTrigger>
            </h2>
            <AccordionItemContent pb={4}>
              {problem?.exceptionDetails ? problem.exceptionDetails[0].raw : "No StackTrace found"}
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      </Flex>
      <Flex justifyContent={"center"}>
        <Button
          onClick={async () => {
            await navigate(0);
          }}
        >
          Reload Page
        </Button>
      </Flex>
    </>
  );
};
