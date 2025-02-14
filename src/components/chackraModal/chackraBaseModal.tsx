import { Button, DialogHeader } from "@chakra-ui/react";
import type { JSX } from "react";

import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogRoot } from "../ui/dialog";

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
      <Button colorPalette="errorPalette" mr={3} onClick={props.onClose}>
        Close
      </Button>
    );
  }
  if (!props.onClose)
    props.onClose = () => {
      /* do nothing */
    };

  return (
    <>
      <DialogRoot open={props.open} size={props.size}>
        <DialogContent>
          <DialogHeader>{props.title}</DialogHeader>
          <DialogCloseTrigger />
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
