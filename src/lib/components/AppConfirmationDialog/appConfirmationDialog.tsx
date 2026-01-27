import { Button } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "../../../components/ui/dialog";

export const AppConfirmationDialog = (props: {
  title: ReactNode;
  body: ReactNode;
  open: boolean;
  onConfirm?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("template");

  return (
    <>
      <DialogRoot
        open={props.open}
        initialFocusEl={() => closeRef.current}
        role="alertdialog"
        data-test="appconfirmationdialog-root"
      >
        <DialogContent data-test="appconfirmationdialog-content">
          <DialogHeader fontSize="lg" fontWeight="bold" data-test="appconfirmationdialog-title">
            {props.title}
          </DialogHeader>
          <DialogBody data-test="appconfirmationdialog-body">{props.body}</DialogBody>
          <DialogFooter data-test="appconfirmationdialog-footer">
            <DialogCloseTrigger ref={closeRef} data-test="appconfirmationdialog-close">
              {t("confirmationDialog.button.close")}
            </DialogCloseTrigger>
            {props.onConfirm !== undefined ? (
              <Button
                colorPalette="red"
                onClick={() => {
                  props.onConfirm?.();
                  props.onOpenChange?.(false);
                }}
                ml={"3"}
                data-test="appconfirmationdialog-confirm"
              >
                {t("confirmationDialog.button.confirm")}
              </Button>
            ) : undefined}
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
