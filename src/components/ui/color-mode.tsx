"use client";

import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton, Skeleton } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

import { useColorMode } from "./color-mode-helper";

// ColorModeProvider Component
export function ColorModeProvider() {
  return <ThemeProvider attribute="class" disableTransitionOnChange />;
}

// ColorModeIcon Component
export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "light" ? <LuSun /> : <LuMoon />;
}

// ColorModeButton Component
export const ColorModeButton = React.forwardRef<HTMLButtonElement, Omit<IconButtonProps, "aria-label">>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
      <Skeleton boxSize="8">
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
          size="sm"
          ref={ref}
          {...props}
          css={{
            _icon: {
              width: "5",
              height: "5",
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </Skeleton>
    );
  },
);
