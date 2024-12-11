import {
  Accordion,
  AccordionItem,
  AccordionIcon,
  Badge,
  Box,
  Card,
  Code,
  Flex,
  AccordionButton,
  AccordionPanel,
  Button,
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
        <Card>
          <Code colorScheme="grey">{problem?.originalDetail ? problem.originalDetail : problem?.message}</Code>
        </Card>
      </Flex>
      <Flex my="20px">
        <Accordion w="full">
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  StackTrace
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {problem?.exceptionDetails ? problem.exceptionDetails[0].raw : "No StackTrace found"}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
      <Flex justifyContent={"center"}>
        <Button
          onClick={() => {
            void navigate(0);
          }}
        >
          Reload Page
        </Button>
      </Flex>
    </>
  );
};
