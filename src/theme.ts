import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  strictTokens: true,
  globalCss: {
    html: {
      colorPalette: "brand",
      "--chakra-colors-color-palette-focus-ring": {
        base: "#9ca3af",
        _dark: "#6b7280",
      },
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          info: { value: { _light: "{colors.brand.primary}", _dark: "{colors.cyan.700}" } }, // Sfondo bianco in dark mode
          subtle: { value: { _light: "{colors.gray.50}", _dark: "{colors.gray.800}" } },
        },
        border: {
          value: { _light: "{colors.gray.300}", _dark: "white" }, // Bordo bianco in dark mode
        },
        header: {
          value: { base: "{colors.brand.dark}", _dark: "{colors.cyan.700}" },
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
          selected: { value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" } },
          solid: { value: { _light: "#dad7d7ff", _dark: "#2d3748" } },
          contrast: {
            value: { base: "black", _dark: "white" },
          },
          fg: { value: { base: "rgba(10, 10, 10, 1)", _dark: "#feffffff" } },
          muted: { value: { _light: "#14204a", _dark: "#4a5568" } },
          subtle: { value: { base: "#f7f7f7", _dark: "#1a3478" } },
          emphasized: { value: { _light: "#173da6", _dark: "#2d3748" } },
          focusRing: { value: "#2563eb" },
        },
        primary: {
          //PaletteExample
          solid: { value: { _light: "#4a76ac", _dark: "#2d3748" } }, //The bold fill color of the color - darker in dark mode
          contrast: { value: "#ffffff" }, //The text color that goes on solid color.
          fg: { value: { _light: "#a3cfff", _dark: "#90cdf4" } }, //The foreground color used for text, icons, etc.
          muted: { value: { _light: "#14204a", _dark: "#4a5568" } }, //The muted color of the color.
          subtle: { value: { _light: "#1a3478", _dark: "#2d3748" } }, //The subtle color of the color - darker in dark mode
          emphasized: { value: { _light: "#173da6", _dark: "#1a202c" } }, //The emphasized version - much darker in dark mode
          focusRing: { value: "#2563eb" }, //The focus ring color when interactive element is focused.
        },
        error: {
          solid: { value: "#ff5630" },
          contrast: { value: "#ffffff" },
          fg: { value: "#ff745f" },
          muted: { value: "#b00020" },
          subtle: { value: { _light: "{colors.red.50}", _dark: "{colors.red.900}" } },
          emphasized: { value: "#ff745f" },
          focusRing: { value: "#ff5630" },
        },
        table: {
          expired: {
            value: { _light: "{colors.red.200}", _dark: "{colors.red.800}" },
          },
          expiredHover: {
            value: { _light: "{colors.red.300}", _dark: "{colors.red.700}" },
          },
          expiringSoon: {
            value: { _light: "{colors.orange.50}", _dark: "{colors.orange.800}" },
          },
          expiringSoonHover: {
            value: { _light: "{colors.orange.100}", _dark: "{colors.orange.700}" },
          },
          evenRow: {
            value: { _light: "white", _dark: "{colors.gray.800}" },
          },
          oddRow: {
            value: { _light: "{colors.gray.50}", _dark: "{colors.gray.700}" },
          },
          hover: {
            value: { _light: "{colors.gray.100}", _dark: "{colors.gray.600}" },
          },
        },
        button: {
          hover: {
            value: { _light: "{colors.gray.200}", _dark: "{colors.blue.600}" },
          },
          ghost: {
            hover: {
              value: { _light: "{colors.gray.100}", _dark: "{colors.gray.700}" },
            },
          },
        },
        input: {
          focus: {
            value: { _light: "{colors.gray.200}", _dark: "{colors.blue.600}" },
          },
          border: {
            focus: {
              value: { _light: "#9ca3af", _dark: "#6b7280" },
            },
          },
        },
        status: {
          error: {
            value: { _light: "{colors.red.500}", _dark: "{colors.red.400}" },
          },
          info: {
            value: { _light: "{colors.gray.700}", _dark: "{colors.gray.300}" },
          },
          muted: {
            value: { _light: "{colors.gray.600}", _dark: "{colors.gray.400}" },
          },
          subtle: {
            value: { _light: "{colors.gray.500}", _dark: "{colors.gray.500}" },
          },
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
