import { createSystem, defaultConfig } from "@chakra-ui/react";

/**
 * Default theme configuration (original theme)
 * This is the base theme that was originally used
 */
const defaultThemeConfig = {
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
        siderBg: { value: { base: "gray.50", _dark: "cyan.900" } },
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
        warning: {
          solid: { value: { _light: "{colors.yellow.500}", _dark: "{colors.yellow.600}" } },
          contrast: { value: "#000000" },
          fg: { value: { _light: "{colors.yellow.700}", _dark: "{colors.yellow.400}" } },
          muted: { value: { _light: "{colors.yellow.600}", _dark: "{colors.yellow.500}" } },
          subtle: { value: { _light: "{colors.yellow.50}", _dark: "{colors.yellow.900}" } },
          emphasized: { value: { _light: "{colors.yellow.600}", _dark: "{colors.yellow.300}" } },
          focusRing: { value: "{colors.yellow.500}" },
        },
        success: {
          solid: { value: { _light: "{colors.green.500}", _dark: "{colors.green.600}" } },
          contrast: { value: "#ffffff" },
          fg: { value: { _light: "{colors.green.700}", _dark: "{colors.green.400}" } },
          muted: { value: { _light: "{colors.green.600}", _dark: "{colors.green.500}" } },
          subtle: { value: { _light: "{colors.green.50}", _dark: "{colors.green.900}" } },
          emphasized: { value: { _light: "{colors.green.600}", _dark: "{colors.green.300}" } },
          focusRing: { value: "{colors.green.500}" },
        },
        table: {
          expired: {
            value: { _light: "#ff8317", _dark: "{colors.yellow.900}" },
          },
          expiredHover: {
            value: { _light: "#e67615", _dark: "{colors.yellow.900}" },
          },
          k4viewEmail: {
            value: { _light: "#e10019", _dark: "{colors.red.900}" },
          },
          k4viewEmailHover: {
            value: { _light: "#c80016", _dark: "{colors.red.900}" },
          },
          k4viewEmailExpired: {
            value: { _light: "#fce053", _dark: "{colors.yellow.800}" },
          },
          k4viewEmailExpiredHover: {
            value: { _light: "#e3c94b", _dark: "{colors.yellow.800}" },
          },
          expiringSoon: {
            value: { _light: "{colors.orange.50}", _dark: "{colors.yellow.900}" },
          },
          expiringSoonHover: {
            value: { _light: "{colors.orange.100}", _dark: "{colors.yellow.900}" },
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
} as const;

/**
 * Available theme configurations
 */
export const availableThemes = {
  default: defaultThemeConfig,
} as const;

export type ThemeName = keyof typeof availableThemes;

/**
 * Get theme configuration by name
 * @param themeName - Name of the theme to retrieve
 * @returns Theme configuration object
 */
export function getThemeConfig(themeName: ThemeName = "default") {
  return availableThemes[themeName];
}

/**
 * Create a theme system based on the theme name
 * @param themeName - Name of the theme to create
 * @returns Chakra UI theme system
 */
export function createTheme(themeName: ThemeName = "default") {
  const themeConfig = getThemeConfig(themeName);
  return createSystem(defaultConfig, themeConfig);
}

// Default theme export for backward compatibility
const theme = createTheme("default");

export default theme;
