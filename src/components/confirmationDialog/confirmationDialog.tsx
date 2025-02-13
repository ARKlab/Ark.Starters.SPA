import { Button, DialogCloseTrigger, DialogContent } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { If, Then } from "react-if";

import { DialogBody, DialogFooter, DialogHeader, DialogRoot } from "../ui/dialog";

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
      <DialogRoot open={props.open} initialFocusEl={() => closeRef.current}>
        <DialogContent>
          <DialogHeader fontSize="lg" fontWeight="bold">
            {props.title}
          </DialogHeader>
          <DialogBody>{props.body}</DialogBody>
          <DialogFooter>
            <DialogCloseTrigger ref={closeRef}>{t("confirmationDialog.button.close")}</DialogCloseTrigger>
            <If condition={props.onConfirm !== undefined}>
              <Then>
                <Button colorPalette="red" onClick={props.onConfirm} ml={3}>
                  {t("confirmationDialog.button.confirm")}
                </Button>
              </Then>
            </If>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
