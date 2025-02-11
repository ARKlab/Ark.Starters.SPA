import {
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogBackdrop,
  Button,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { If, Then } from "react-if";

export const ConfirmationDialog = (props: {
  title: ReactNode;
  body: ReactNode;
  isOpen: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation('template');

  return (
    <>
      <DialogRoot
        role="alertdialog"
        open={props.isOpen}
        onOpenChange={props.onClose}
      >
        <DialogBackdrop>
          <DialogContent>
            <DialogHeader fontSize="lg" fontWeight="bold">
              {props.title}
            </DialogHeader>
            <DialogBody>{props.body}</DialogBody>
            <DialogFooter>
              <Button ref={closeRef} onClick={props.onClose}>
                {t("confirmationDialog.button.close")}
              </Button>
              <If condition={props.onConfirm !== undefined}>
                <Then>
                  <Button colorScheme="red" onClick={props.onConfirm} ml={3}>
                    {t("confirmationDialog.button.confirm")}
                  </Button>
                </Then>
              </If>
            </DialogFooter>
          </DialogContent>
        </DialogBackdrop>
      </DialogRoot>
    </>
  );
};
