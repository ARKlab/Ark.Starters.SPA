import { extendTheme } from "@chakra-ui/react";
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false, // Set to true if you want to use the system color mode
};
export const theme = extendTheme({
  config,
  colors: {
    brandPalette: {
      100: "#e4f1ff",
      200: "#7F7A91",
      300: "#5A5766",
      500: "#4094D0",
      600: "#104378",
      700: "#FFE6B9",
      800: "#E4572E",
      900: "#ffffff",
    },
    brand: {
      primary: "#4094d0",
      selected: "#104378",
      dark: "#194069",
      darken: "#282c37",
    },
  },
  fonts: {
    heading: `'PTSansRegular', sans-serif`,
    body: `'PTSansRegular', sans-serif`,
  },
});
