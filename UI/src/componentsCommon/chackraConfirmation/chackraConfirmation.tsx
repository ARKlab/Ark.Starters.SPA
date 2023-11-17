import React, { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { Action } from "redux";

export const ChackraConfirmation = (props: {
  title: string;
  message: string;
  isOpen: boolean;
  confirmAction: (p: any) => Action;
  paramsForConfirmAction: any;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const handleConfirm = () => {
    dispatch(props.confirmAction(props.paramsForConfirmAction));
    props.onClose();
  };
  return (
    <>
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.title}
            </AlertDialogHeader>
            <AlertDialogBody>{props.message}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={props.onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
