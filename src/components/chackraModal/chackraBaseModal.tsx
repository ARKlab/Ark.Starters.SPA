import { Button, Heading } from "@chakra-ui/react";
import type { JSX } from "react";

import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "../ui/dialog";

export const ChackraUIBaseModal = (props: {
  open: boolean;
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
      <Button
        mr={3}
        onClick={() => {
          executeSubmit();
        }}
      >
        {props.submitButtonText}
      </Button>
    );
  if (props.footerCloseButton) {
    footerCloseButton = (
      <Button colorPalette="error" mr={3} onClick={props.onClose}>
        Close
      </Button>
    );
  }
  props.onClose ??= () => {
      /* do nothing */
    };

  return (
    <>
      <DialogRoot open={props.open} size={props.size}>
        <DialogContent>
          <DialogHeader><Heading> {props.title}</Heading></DialogHeader>
          <DialogCloseTrigger onClick={props.onClose} />
          <DialogBody>{props.body}</DialogBody>
          <DialogFooter>
            {submitSegment}
            {footerCloseButton}
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
