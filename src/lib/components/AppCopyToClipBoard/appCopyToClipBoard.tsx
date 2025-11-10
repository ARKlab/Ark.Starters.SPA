import { Button, Clipboard } from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa";

export const AppCopyToClipBoard = ({ value, useIcon }: { value: string; useIcon?: boolean }) => {
  return (
    <Clipboard.Root value={value} data-test="copyclip-root">
      <Clipboard.Trigger asChild data-test="copyclip-trigger">
        {useIcon ? (
          <span data-test="copyclip-icon-trigger">
            <FaCopy />
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
