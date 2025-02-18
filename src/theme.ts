import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  globalCss: {
    html: { colorPalette: "brand" },
    "html, body": {
      margin: 0,
      padding: 0,
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        inputBorder: {
          value: { base: "{colors.gray.300}", _dark: "white" }, // Bordo bianco in dark mode
        },
        header: {
          value: { base: "{colors.blue.200}", _dark: "{colors.cyan.700}" },
        },
        page: {
          value: { base: "white", _dark: "{colors.cyan.900}" },
        },
        sider: {
          value: {
            base: "gray.50",
            _dark: "cyan.900",
          },
        },
        brand: {
          selected: { value: { base: "{colors.blue.200}", _dark: "{colors.cyan.900}" } },
          solid: { value: "#4a76ac" },
          contrast: {
            value: { base: "black", _dark: "white" },
          },
          fg: { value: { base: "rgb(101, 131, 162)", _dark: "#a3cfff" } },
          muted: { value: "#14204a" },
          subtle: { value: { base: "rgb(165, 197, 216)", _dark: "#1a3478" } },
          emphasized: { value: "#173da6" },
          focusRing: { value: "#2563eb" },
        },
        primary: {
          //PaletteExample
          solid: { value: "#4a76ac" }, //The bold fill color of the color.
          contrast: { value: "#ffffff" }, //The text color that goes on solid color.
          fg: { value: "#a3cfff" }, //The foreground color used for text, icons, etc.
          muted: { value: "#14204a" }, //The muted color of the color.
          subtle: { value: "#1a3478" }, //The subtle color of the color.
          emphasized: { value: "#173da6" }, //The emphasized version of the subtle color.
          focusRing: { value: "#2563eb" }, //The focus ring color when interactive element is focused.
        },
        error: {
          solid: { value: "#ff5630" },
          contrast: { value: "#ffffff" },
          fg: { value: "#ff745f" },
          muted: { value: "#b00020" },
          subtle: { value: "#ff745f" },
          emphasized: { value: "#ff745f" },
          focusRing: { value: "#ff5630" },
        },
        code: {
          solid: { value: { base: "#f5f5f5", _dark: "#2d2d2d" } },
          contrast: { value: { base: "#d63384", _dark: "#ff79c6" } },
          fg: { value: { base: "#007acc", _dark: "#61dafb" } },
          muted: { value: { base: "#d69d85", _dark: "#e06c75" } },
          subtle: { value: { base: "#795e26", _dark: "#d19a66" } },
          emphasized: { value: { base: "#6a9955", _dark: "#98c379" } },
          focusRing: { value: { base: "#b5cea8", _dark: "#56b6c2" } },
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
          dark: { value: "#194069" },
          errorBackGround: { value: "#ff6565" },
          errorText: { value: "#460e0e" },
        },
        fonts: {
          heading: { value: `'PTSansRegular', sans-serif` },
          body: { value: `'PTSansRegular', sans-serif` },
        },
      },
    },
  },
});

export default theme;
