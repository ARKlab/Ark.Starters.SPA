import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

/**
 * Chakra UI Theme Configuration
 * 
 * This theme follows Chakra UI v3 best practices:
 * - Uses a graded color palette (50-950) for the brand
 * - Overrides semantic tokens (bg, fg, border) to use brand colors
 * - Sets global colorPalette to "brand"
 * - Enables strictTokens for type safety
 * - Supports both light and dark modes
 * 
 * To customize:
 * 1. Update the brand color palette below (50-950 scale)
 * 2. Semantic tokens will automatically adapt
 * 3. Run: npx @chakra-ui/cli typegen --strict src/theme.ts
 */

const config = defineConfig({
  strictTokens: true,
  globalCss: {
    html: { colorPalette: "brand" },
  },
  theme: {
    // ===================================================================
    // SEMANTIC TOKENS - Override to customize the theme
    // ===================================================================
    semanticTokens: {
      colors: {
        // Background semantic tokens
        bg: {
          DEFAULT: {
            value: { _light: "white", _dark: "{colors.brand.950}" },
          },
          subtle: {
            value: { _light: "{colors.brand.50}", _dark: "{colors.brand.900}" },
          },
          muted: {
            value: { _light: "{colors.brand.100}", _dark: "{colors.brand.800}" },
          },
          emphasized: {
            value: { _light: "{colors.brand.200}", _dark: "{colors.brand.700}" },
          },
          inverted: {
            value: { _light: "{colors.brand.900}", _dark: "{colors.brand.50}" },
          },
          panel: {
            value: { _light: "white", _dark: "{colors.brand.950}" },
          },
          error: {
            value: { _light: "{colors.red.50}", _dark: "{colors.red.950}" },
          },
          warning: {
            value: { _light: "{colors.orange.50}", _dark: "{colors.orange.950}" },
          },
          success: {
            value: { _light: "{colors.green.50}", _dark: "{colors.green.950}" },
          },
          info: {
            value: { _light: "{colors.brand.50}", _dark: "{colors.brand.900}" },
          },
        },

        // Foreground (text) semantic tokens
        fg: {
          DEFAULT: {
            value: { _light: "{colors.brand.900}", _dark: "{colors.brand.50}" },
          },
          muted: {
            value: { _light: "{colors.brand.600}", _dark: "{colors.brand.400}" },
          },
          subtle: {
            value: { _light: "{colors.brand.500}", _dark: "{colors.brand.500}" },
          },
          inverted: {
            value: { _light: "white", _dark: "{colors.brand.900}" },
          },
          error: {
            value: { _light: "{colors.red.600}", _dark: "{colors.red.400}" },
          },
          warning: {
            value: { _light: "{colors.orange.600}", _dark: "{colors.orange.400}" },
          },
          success: {
            value: { _light: "{colors.green.600}", _dark: "{colors.green.400}" },
          },
          info: {
            value: { _light: "{colors.brand.600}", _dark: "{colors.brand.400}" },
          },
        },

        // Border semantic tokens
        border: {
          DEFAULT: {
            value: { _light: "{colors.brand.200}", _dark: "{colors.brand.800}" },
          },
          muted: {
            value: { _light: "{colors.brand.100}", _dark: "{colors.brand.900}" },
          },
          subtle: {
            value: { _light: "{colors.brand.50}", _dark: "{colors.brand.950}" },
          },
          emphasized: {
            value: { _light: "{colors.brand.300}", _dark: "{colors.brand.700}" },
          },
          inverted: {
            value: { _light: "{colors.brand.800}", _dark: "{colors.brand.200}" },
          },
          error: {
            value: { _light: "{colors.red.500}", _dark: "{colors.red.400}" },
          },
          warning: {
            value: { _light: "{colors.orange.500}", _dark: "{colors.orange.400}" },
          },
          success: {
            value: { _light: "{colors.green.500}", _dark: "{colors.green.400}" },
          },
          info: {
            value: { _light: "{colors.brand.500}", _dark: "{colors.brand.400}" },
          },
        },

        // Brand color palette semantic tokens
        // These work with colorPalette="brand" on components
        brand: {
          contrast: {
            value: { _light: "white", _dark: "white" },
          },
          fg: {
            value: { _light: "{colors.brand.700}", _dark: "{colors.brand.300}" },
          },
          subtle: {
            value: { _light: "{colors.brand.100}", _dark: "{colors.brand.900}" },
          },
          muted: {
            value: { _light: "{colors.brand.200}", _dark: "{colors.brand.800}" },
          },
          emphasized: {
            value: { _light: "{colors.brand.300}", _dark: "{colors.brand.700}" },
          },
          solid: {
            value: { _light: "{colors.brand.600}", _dark: "{colors.brand.600}" },
          },
          focusRing: {
            value: { _light: "{colors.brand.500}", _dark: "{colors.brand.500}" },
          },
          border: {
            value: { _light: "{colors.brand.500}", _dark: "{colors.brand.400}" },
          },
        },

        // Error palette semantic tokens
        error: {
          contrast: {
            value: { _light: "white", _dark: "white" },
          },
          fg: {
            value: { _light: "{colors.red.700}", _dark: "{colors.red.300}" },
          },
          subtle: {
            value: { _light: "{colors.red.100}", _dark: "{colors.red.900}" },
          },
          muted: {
            value: { _light: "{colors.red.200}", _dark: "{colors.red.800}" },
          },
          emphasized: {
            value: { _light: "{colors.red.300}", _dark: "{colors.red.700}" },
          },
          solid: {
            value: { _light: "{colors.red.600}", _dark: "{colors.red.600}" },
          },
          focusRing: {
            value: { _light: "{colors.red.500}", _dark: "{colors.red.500}" },
          },
        },

        // Code syntax highlighting tokens
        code: {
          solid: {
            value: { _light: "{colors.gray.100}", _dark: "{colors.gray.900}" },
          },
          contrast: {
            value: { _light: "{colors.pink.600}", _dark: "{colors.pink.400}" },
          },
          fg: {
            value: { _light: "{colors.blue.600}", _dark: "{colors.blue.400}" },
          },
          muted: {
            value: { _light: "{colors.orange.600}", _dark: "{colors.orange.400}" },
          },
          subtle: {
            value: { _light: "{colors.yellow.700}", _dark: "{colors.yellow.400}" },
          },
          emphasized: {
            value: { _light: "{colors.green.600}", _dark: "{colors.green.400}" },
          },
          focusRing: {
            value: { _light: "{colors.cyan.500}", _dark: "{colors.cyan.400}" },
          },
        },
      },
    },

    // ===================================================================
    // TOKENS - Base color palette and other design tokens
    // ===================================================================
    tokens: {
      spacing: {
        inherit: { value: "inherit" },
        "0": { value: "0rem" },
      },
      sizes: {
        "0": { value: "0" }, // needed for "flex" for minWidth and minHeight
      },
      colors: {
        // Brand color palette - Graded scale from 50 (lightest) to 950 (darkest)
        // Based on primary brand color #4094D0 (blue)
        brand: {
          50: { value: "#e8f4fc" },   // Very light blue
          100: { value: "#d1e9f9" },  // Light blue
          200: { value: "#a3d3f3" },  // Light medium blue
          300: { value: "#75bded" },  // Medium blue
          400: { value: "#5aabde" },  // Medium-dark blue
          500: { value: "#4094d0" },  // Primary brand blue
          600: { value: "#3376a8" },  // Dark blue
          700: { value: "#265980" },  // Darker blue
          800: { value: "#1a3b58" },  // Very dark blue
          900: { value: "#0d1e30" },  // Almost black blue
          950: { value: "#070f18" },  // Darkest blue
        },
        fonts: {
          heading: { value: `'PTSansRegular', sans-serif` },
          body: { value: `'PTSansRegular', sans-serif` },
        },
      },
    },
  },
})

const theme = createSystem(defaultConfig, config)

export default theme
