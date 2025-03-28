import { Button } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "../ui/dialog";

export const ConfirmationDialog = (props: {
  title: ReactNode;
  body: ReactNode;
  open: boolean;
  onConfirm?: () => void;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation("template");

  return (
    <>
      <DialogRoot open={props.open} initialFocusEl={() => closeRef.current} role="alertdialog">
        <DialogContent>
          <DialogHeader fontSize="lg" fontWeight="bold">
            {props.title}
          </DialogHeader>
          <DialogBody>{props.body}</DialogBody>
          <DialogFooter>
            <DialogCloseTrigger ref={closeRef}>{t("confirmationDialog.button.close")}</DialogCloseTrigger>
            {(props.onConfirm !== undefined ?
              <Button colorPalette="error" onClick={props.onConfirm} ml={3}>
                {t("confirmationDialog.button.confirm")}
              </Button>
              : undefined
            )}
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
