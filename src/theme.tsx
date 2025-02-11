import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";

const config = {
  useSystemColorMode: true,
  initialColorMode: "system",
};

// Define the theme directly
export const theme = {
  config,
  styles: {
    global: (props: StyleFunctionProps) => {
      const bgLight = props.theme.colors.gray[50];
      const bgDark = props.theme.colors.gray[900];
      return {
        "html, body": {
          background: mode(bgLight, bgDark)(props),
        },
      };
    },
  },
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
  semanticTokens: {
    colors: {
      background: {
        default: "#F0F4F8",
        _dark: "#1A202C",
      },
      header: {
        bg: {
          default: "#E2E8F0",
          _dark: "#2D3748",
        },
      },
    },
  },
  fonts: {
    heading: `'PTSansRegular', sans-serif`,
    body: `'PTSansRegular', sans-serif`,
  },
};
