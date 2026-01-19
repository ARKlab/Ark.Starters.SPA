import { Button, Clipboard } from "@chakra-ui/react";
import { LuCopy } from "react-icons/lu";

export const AppCopyToClipBoard = ({ value, useIcon }: { value: string; useIcon?: boolean }) => {
  return (
    <Clipboard.Root value={value} data-test="copyclip-root">
      <Clipboard.Trigger asChild data-test="copyclip-trigger">
        {useIcon ? (
          <span data-test="copyclip-icon-trigger">
            <LuCopy />
            <Clipboard.Indicator data-test="copyclip-indicator" />
          </span>
        ) : (
          <Button size="xs" data-test="copyclip-button-trigger">
            <Clipboard.Indicator data-test="copyclip-indicator" />
          </Button>
        )}
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
};
