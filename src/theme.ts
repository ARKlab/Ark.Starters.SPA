import { createSystem, defaultBaseConfig, defaultConfig, defineConfig } from "@chakra-ui/react"
import {
  // Simple recipes - basic components
  badgeRecipe,
  buttonRecipe,
  checkmarkRecipe,
  codeRecipe,
  containerRecipe,
  headingRecipe,
  iconRecipe,
  inputRecipe,
  inputAddonRecipe,
  kbdRecipe,
  linkRecipe,
  markRecipe,
  radiomarkRecipe,
  separatorRecipe,
  skeletonRecipe,
  spinnerRecipe,
  textareaRecipe,
  // Slot recipes - complex multi-part components
  accordionSlotRecipe,
  alertSlotRecipe,
  avatarSlotRecipe,
  breadcrumbSlotRecipe,
  cardSlotRecipe,
  checkboxSlotRecipe,
  dialogSlotRecipe,
  drawerSlotRecipe,
  fieldSlotRecipe,
  fieldsetSlotRecipe,
  listSlotRecipe,
  menuSlotRecipe,
  nativeSelectSlotRecipe,
  progressSlotRecipe,
  selectSlotRecipe,
  switchSlotRecipe,
  tableSlotRecipe,
  tagsInputSlotRecipe,
  tooltipSlotRecipe,
  // Import tokens and semanticTokens
  // Note: Selective token imports (e.g., only borders, colors) don't reduce bundle size
  // because bundlers can't tree-shake object properties. See TOKEN_TREESHAKING_ANALYSIS.md
  tokens,
  semanticTokens,
} from "@chakra-ui/react/theme"

const config = defineConfig({
  strictTokens: true, // Keep strict to prevent arbitrary values like px everywhere
  conditions: defaultConfig.conditions, // Import all conditions from defaultConfig
  globalCss: {
    html: { colorPalette: "brandPalette" },
  },
  theme: {
    // Import only the recipes we actually use
    // Type assertions needed due to strictTokens: true compatibility
    recipes: {
      // Simple recipes
      badge: badgeRecipe as any,
      button: buttonRecipe as any,
      checkmark: checkmarkRecipe as any,
      code: codeRecipe as any,
      container: containerRecipe as any,
      heading: headingRecipe as any,
      icon: iconRecipe as any,
      input: inputRecipe as any,
      inputAddon: inputAddonRecipe as any,
      kbd: kbdRecipe as any,
      link: linkRecipe as any,
      mark: markRecipe as any,
      radiomark: radiomarkRecipe as any,
      separator: separatorRecipe as any,
      skeleton: skeletonRecipe as any,
      spinner: spinnerRecipe as any,
      textarea: textareaRecipe as any,
    },
    slotRecipes: {
      // Slot recipes (multi-part components)
      accordion: accordionSlotRecipe as any,
      alert: alertSlotRecipe as any,
      avatar: avatarSlotRecipe as any,
      breadcrumb: breadcrumbSlotRecipe as any,
      card: cardSlotRecipe as any,
      checkbox: checkboxSlotRecipe as any,
      dialog: dialogSlotRecipe as any,
      drawer: drawerSlotRecipe as any,
      field: fieldSlotRecipe as any,
      fieldset: fieldsetSlotRecipe as any,
      list: listSlotRecipe as any,
      menu: menuSlotRecipe as any,
      nativeSelect: nativeSelectSlotRecipe as any,
      progress: progressSlotRecipe as any,
      select: selectSlotRecipe as any,
      switch: switchSlotRecipe as any,
      table: tableSlotRecipe as any,
      tagsInput: tagsInputSlotRecipe as any,
      tooltip: tooltipSlotRecipe as any,
    },
    semanticTokens: {
      colors: {
        ...semanticTokens.colors,
        // Custom semantic tokens for this project
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
          contrast: { value: { base: "black", _dark: "white" } },
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
      shadows: semanticTokens.shadows,
      radii: semanticTokens.radii,
    },

    tokens: {
      // Import all Chakra tokens
      // Note: Selective imports don't reduce bundle size (see TOKEN_TREESHAKING_ANALYSIS.md)
      ...tokens,
      // Override/extend specific categories with custom values
      breakpoints: {
        sm: { value: "480px" },
        md: { value: "768px" },
        lg: { value: "1024px" },
        xl: { value: "1280px" },
        "2xl": { value: "1536px" },
      },
      spacing: {
        ...tokens.spacing,
        inherit: { value: "inherit" },
        "0": { value: "0rem" },
      },
      sizes: {
        ...tokens.sizes,
        "0": { value: "0" }, // needed for "flex" for minWidth and minHeight
      },
      colors: {
        ...tokens.colors,
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
      },
      fonts: {
        ...tokens.fonts,
        heading: { value: `'PTSansRegular', sans-serif` },
        body: { value: `'PTSansRegular', sans-serif` },
      },
    },
  },
})

const theme = createSystem(defaultBaseConfig, config)

export default theme

