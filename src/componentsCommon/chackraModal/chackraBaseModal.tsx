import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export const ChackraUIBaseModal = (props: {
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onSubmit?: () => void;
  submitButton?: boolean;
  footerCloseButton?: boolean;
  submitButtonText?: string;
  title: string;
  body: JSX.Element;
  blurredOverlay?: boolean;
  size: "xs" | "sm" | "md" | "lg" | "xl";
}) => {
  const executeSubmit = () => {
    if (props.onSubmit) props.onSubmit();
    if (props.onClose) props.onClose();
  };
  let submitSegment = <></>;
  let footerCloseButton = <></>;
  if (props.submitButton)
    submitSegment = (
      <Button colorScheme="brandPalette" mr={3} onClick={() => executeSubmit()}>
        {props.submitButtonText}
      </Button>
    );
  if (props.footerCloseButton) {
    footerCloseButton = (
      <Button colorScheme="red" mr={3} onClick={props.onClose}>
        Close
      </Button>
    );
  }
  if (!props.onClose) props.onClose = () => {};
  let overlay = <ModalOverlay />;
  if (props.blurredOverlay)
    overlay = <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />;
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size={props.size}>
        {overlay}
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{props.body}</ModalBody>
          <ModalFooter>
            {submitSegment}
            {footerCloseButton}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
