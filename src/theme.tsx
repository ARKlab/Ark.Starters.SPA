import { createSystem, defaultConfig } from "@chakra-ui/react";

export const theme = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        header: {
          bg: {
            default: { value: "gray.50" },
            _dark: { value: "cyan.900" },
          },
        },
        sider: {
          bg: {
            default: { value: "gray.50" },
            _dark: { value: "cyan.900" },
          },
        },
      },
    },
    tokens: {
      colors: {
        brandPalette: {
          100: { value: "#e4f1ff" },
          200: { value: "#7F7A91" },
          300: { value: "#5A5766" },
          500: { value: "#4094D0" },
          600: { value: "#104378" },
          700: { value: "#FFE6B9" },
          800: { value: "#E4572E" },
          900: { value: "#ffffff" },
        },
        brand: {
          primary: { value: "#4094d0" },
          selected: { value: "#104378" },
          dark: { value: "#194069" },
          darken: { value: "#282c37" },
        },

        fonts: {
          heading: { value: `'PTSansRegular', sans-serif` },
          body: { value: `'PTSansRegular', sans-serif` },
        },
      },
    },
  },
});
