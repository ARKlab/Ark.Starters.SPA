import { DetailsType, errorModalType } from "../../redux/modules/errorHandler";
import { ChackraUIBaseModal } from "../chackraModal/chackraBaseModal";
import {
  Accordion,
  AccordionItem,
  AccordionIcon,
  Badge,
  Box,
  Card,
  Code,
  Flex,
  useDisclosure,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";
import { useEffect } from "react";

export const ProblemDetailsModal = (props: { problem: errorModalType }) => {
  const therIsError =
    props.problem.error !== undefined ? props.problem.error : false;
  const problemDetails = props.problem.details;
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (therIsError === true) {
      onOpen();
    }
  }, [therIsError, onOpen]);
  return (
    <ChackraUIBaseModal
      size={"xl"}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      title={problemDetails?.title || ""}
      body={<ProblemDetailsModalBody problem={problemDetails} />}
      blurredOverlay={true}
    />
  );
};

const ProblemDetailsModalBody = (props: { problem: DetailsType | null }) => {
  const problem = props.problem;

  return (
    <>
      <Flex>
        <Badge colorScheme="red">
          {problem?.originalTitle}: ERROR {problem?.status}
        </Badge>
      </Flex>
      <Flex my="20px">
        <Card>
          <Code colorScheme="grey">{problem?.originalDetail}</Code>
        </Card>
      </Flex>
      <Flex my="20px">
        <Accordion>
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
              {problem?.exceptionDetails
                ? problem?.exceptionDetails[0].raw
                : "No StackTrace found"}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </>
  );
};
