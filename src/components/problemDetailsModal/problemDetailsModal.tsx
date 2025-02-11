import {
  AccordionItem,
  Badge,
  Box,
  Card,
  Code,
  Flex,
  Button,
  AccordionRoot,
  AccordionItemContent,
  AccordionItemTrigger,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import type { DetailsType } from "../../lib/errorHandler/errorHandler";
import { clearError, selectError } from "../../lib/errorHandler/errorHandler";
import { ChackraUIBaseModal } from "../chackraModal/chackraBaseModal";

export const ProblemDetailsModal = () => {
  const problem = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const therIsError = problem.error ?? false;
  const problemDetails = problem.details;

  return (
    <ChackraUIBaseModal
      size={"xl"}
      isOpen={therIsError}
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
        <Badge colorScheme="red">ERROR {problem?.status}</Badge>
      </Flex>
      <Flex my="20px">
        <Card.Root>
          <Code colorScheme="grey">{problem?.originalDetail ? problem.originalDetail : problem?.message}</Code>
        </Card.Root>
      </Flex>
      <Flex my="20px">
        <AccordionRoot w="full">
          <AccordionItem value="stackTrace">
            <AccordionItemTrigger>
              <Box as="span" flex="1" textAlign="left">
                StackTrace
              </Box>
            </AccordionItemTrigger>

            <AccordionItemContent pb={4}>
              {problem?.exceptionDetails ? problem.exceptionDetails[0].raw : "No StackTrace found"}
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      </Flex>
      <Flex justifyContent={"center"}>
        <Button
          onClick={() => {
            navigate(0);
          }}
        >
          Reload Page
        </Button>
      </Flex>
    </>
  );
};
