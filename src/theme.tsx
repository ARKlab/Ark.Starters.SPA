import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brandPalette: {
      100: "#e4f1ff",
      200: "#7F7A91",
      300: "#5A5766",
      500: "#4094D0",
      600: "#104378",
      700: "#FFE6B9",
      800: "#E4572E",
      900: "#194069",
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
  components: {
    WrapItem: {
      _hover: {
        background: "brand.primary",
        color: "white",
        transitionDuration: "0.4s",
        transitionTimingFunction: "ease-in-out",
      },
    },
    Button: {
      baseStyle: {
        color: "white",
      },
    },
  },
});
