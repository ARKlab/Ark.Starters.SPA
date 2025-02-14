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
        header: {
          value: { base: "{colors.blue.200}", _dark: "{colors.cyan.900}" },
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
          solid: { value: "#2563eb" },
          contrast: { value: "#ffffff" },
          fg: { value: "#a3cfff" },
          muted: { value: "#14204a" },
          subtle: { value: "#1a3478" },
          emphasized: { value: "#173da6" },
          focusRing: { value: "#2563eb" },
          sideBarItem: { value: { base: "black", _dark: "white" } },
        },
        primaryPalette: {
          //PaletteExample
          solid: { value: "#2563eb" }, //The bold fill color of the color.
          contrast: { value: "#ffffff" }, //The text color that goes on solid color.
          fg: { value: "#a3cfff" }, //The foreground color used for text, icons, etc.
          muted: { value: "#14204a" }, //The muted color of the color.
          subtle: { value: "#1a3478" }, //The subtle color of the color.
          emphasized: { value: "#173da6" }, //The emphasized version of the subtle color.
          focusRing: { value: "#2563eb" }, //The focus ring color when interactive element is focused.
        },
        errorPalette: {
          solid: { value: "#ff5630" },
          contrast: { value: "#ffffff" },
          fg: { value: "#ff745f" },
          muted: { value: "#b00020" },
          subtle: { value: "#ff745f" },
          emphasized: { value: "#ff745f" },
          focusRing: { value: "#ff5630" },
        },
        mutedPalette: {
          solid: { value: "#42526e" },
          contrast: { value: "#ffffff" },
          fg: { value: "#6b778c" },
          muted: { value: "#1c1f2b" },
          subtle: { value: "#6b778c" },
          emphasized: { value: "#6b778c" },
          focusRing: { value: "#42526e" },
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
