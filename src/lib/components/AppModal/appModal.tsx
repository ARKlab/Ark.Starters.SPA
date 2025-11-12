import { Box, Button, DialogHeader, Flex, Heading } from "@chakra-ui/react";
import type { JSX } from "react";

import { DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogRoot } from "./dialog";

export const AppModal = (props: {
  open: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  submitButton?: boolean;
  footerCloseButton?: boolean;
  submitButtonText?: string;
  title: string;
  body: JSX.Element;
  blurredOverlay?: boolean;
  size: "xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full";
  h?: string;
}) => {
  const executeSubmit = () => {
    if (props.onSubmit) props.onSubmit();
    if (props.onClose) props.onClose();
  };
  let submitSegment = <></>;
  let footerCloseButton = <></>;
  if (props.submitButton)
    submitSegment = (
      <Button
        data-test="appmodal-submit"
        mr={"3"}
        onClick={() => {
          executeSubmit();
        }}
      >
        {props.submitButtonText}
      </Button>
    );
  if (props.footerCloseButton) {
    footerCloseButton = (
      <Button colorPalette="error" mr={"3"} onClick={props.onClose} data-test="appmodal-footer-close">
        Close
      </Button>
    );
  }

  return (
    <>
      <DialogRoot open={props.open} size={props.size}>
        <DialogBackdrop asChild>
          <Box backdropFilter="blur(8px)" data-test="appmodal-backdrop" />
        </DialogBackdrop>
        <DialogContent bg="bg" h={props.h ?? "auto"} data-test="appmodal-content">
          <DialogHeader data-test="appmodal-header">
            <Flex direction="column" align="center">
              <Heading data-test="appmodal-title">{props.title}</Heading>
            </Flex>
          </DialogHeader>
          <DialogBody overflow="auto" data-test="appmodal-body">
            {props.body}
          </DialogBody>
          <DialogCloseTrigger onClick={props.onClose} bg="bg" data-test="appmodal-close-trigger" />
          <DialogFooter data-test="appmodal-footer">
            {submitSegment}
            {footerCloseButton}
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
