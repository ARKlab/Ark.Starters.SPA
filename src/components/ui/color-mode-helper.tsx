import type { IconButtonProps } from "@chakra-ui/react";
import { useTheme } from "next-themes";

// Custom hook for handling color mode
export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };
  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

// Custom hook for getting the color mode value
export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "light" ? light : dark;
}

export type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">;
