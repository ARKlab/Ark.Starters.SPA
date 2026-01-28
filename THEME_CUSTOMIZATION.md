# Chakra UI Theme Customization Guide

## Overview

This project uses Chakra UI v3 with a custom theme that follows best practices for color management. The theme is designed to be easily customizable by modifying a small set of brand colors, from which all semantic tokens automatically derive.

## Quick Customization

To customize the theme for your brand:

1. **Edit the brand color palette** in `src/theme.ts`:

```typescript
colors: {
  brand: {
    50: { value: "#e8f4fc" },   // Lightest shade
    100: { value: "#d1e9f9" },
    200: { value: "#a3d3f3" },
    300: { value: "#75bded" },
    400: { value: "#5aabde" },
    500: { value: "#4094d0" },  // Primary brand color
    600: { value: "#3376a8" },
    700: { value: "#265980" },
    800: { value: "#1a3b58" },
    900: { value: "#0d1e30" },
    950: { value: "#070f18" },  // Darkest shade
  },
}
```

2. **Regenerate theme types**:

```bash
npx @chakra-ui/cli typegen --strict src/theme.ts
```

3. **Build and test**:

```bash
npm run build
npm test
```

## Color System Architecture

### Graded Color Palette (50-950)

The theme uses a graded color palette from 50 (lightest) to 950 (darkest), following Chakra UI conventions. This allows for:

- Consistent color variations
- Automatic light/dark mode support
- Type-safe color references

### Semantic Tokens

All UI colors derive from semantic tokens that automatically adapt to color modes and use brand colors:

- **`bg.*`** - Background colors (uses brand palette)
  - `bg` - Default background (white/brand.950)
  - `bg.subtle` - Subtle background (brand.50/brand.900)
  - `bg.muted` - Muted background (brand.100/brand.800)
  - `bg.emphasized` - Emphasized background (brand.200/brand.700)
  - `bg.panel` - Panel background (white/brand.950)
  - `bg.info`, `bg.error`, `bg.warning`, `bg.success` - Status backgrounds

- **`fg.*`** - Foreground (text) colors (uses brand palette)
  - `fg` - Default text color (brand.900/brand.50)
  - `fg.muted` - Muted text (brand.600/brand.400)
  - `fg.subtle` - Subtle text (brand.500)
  - `fg.info`, `fg.error`, `fg.warning`, `fg.success` - Status text

- **`border.*`** - Border colors (uses brand palette)
  - `border` - Default border (brand.200/brand.800)
  - `border.muted` - Muted border (brand.100/brand.900)
  - `border.emphasized` - Emphasized border (brand.300/brand.700)
  - `border.info`, `border.error`, `border.warning`, `border.success` - Status borders

### Brand Palette Tokens

Components using `colorPalette="brand"` automatically get access to:

- `brand.solid` - Main brand color for buttons, badges
- `brand.contrast` - Text color on solid brand backgrounds (white)
- `brand.fg` - Brand foreground color for text/icons
- `brand.subtle` - Subtle brand background
- `brand.muted` - Muted brand background
- `brand.emphasized` - Emphasized brand background
- `brand.border` - Brand border color
- `brand.focusRing` - Focus ring color

### Error, Warning, Success States

Use the `error` colorPalette with layerStyles for error states. The `colorPalette` prop and `layerStyle` work together and inherit to children:

```tsx
// ✅ Correct - Use error palette with layerStyle
<Box colorPalette="error" layerStyle="outline.solid">
  <Heading>Error occurred</Heading> {/* Inherits error palette */}
  <Text>Error message</Text> {/* Inherits error palette */}
  <Button>Retry</Button> {/* Inherits error palette */}
</Box>

// ✅ Correct - Use fill.subtle layerStyle for subtle backgrounds
<Box colorPalette="error" layerStyle="fill.subtle">
  <Text>Subtle error message</Text>
</Box>

// ✅ Correct - Use error palette for buttons
<Button colorPalette="error">Delete</Button>

// ❌ Wrong - Manually setting bg and borderColor instead of using layerStyle
<Box colorPalette="error" bg="colorPalette.subtle" borderColor="colorPalette.border">
  <Text>Error message</Text>
</Box>
```

**Available layerStyles** (from Chakra UI):

- `fill.subtle`, `fill.muted`, `fill.surface`, `fill.solid` - Background + text color combinations
- `outline.subtle`, `outline.solid` - Border + text color combinations
- `indicator.bottom`, `indicator.top`, `indicator.start`, `indicator.end` - Indicator lines

The `error` palette automatically provides contextual semantic tokens:

- `colorPalette.solid` - Solid error background
- `colorPalette.subtle` - Subtle error background
- `colorPalette.fg` - Error text color
- `colorPalette.border` - Error border color
- `colorPalette.muted`, `colorPalette.emphasized`, `colorPalette.contrast`, `colorPalette.focusRing`

These work with layerStyles and are inherited by children.

## Usage in Components

### ✅ Correct - Using Semantic Tokens and Variants

```tsx
// Use semantic tokens - colorPalette is already set globally to "brand"
<Box bg="bg.emphasized" color="fg">
  <Button>Submit</Button>
</Box>

// Components automatically use the brand palette through variants
<Table.Row _hover={{ bg: "brand.emphasized" }}>
```

### ❌ Incorrect - Hardcoded Colors or Explicit Palette

```tsx
// Don't use hardcoded colors
<Box bg="#4094d0" color="black">
  <Button bg="blue.500">Submit</Button>
</Box>

// Don't set colorPalette on individual components - it's already global
<Button colorPalette="brand">Submit</Button>
```

## Component Variants and Recipes

Components automatically use the global brand palette through Chakra's recipe system. No need to set `colorPalette` on individual components:

## Component Variants and Recipes

Components automatically use the global brand palette through Chakra's recipe system. No need to set `colorPalette` on individual components:

```tsx
// ✅ Correct - Just use the component, it uses brand colors automatically
<Button>Primary Action</Button>
<Switch />
<Checkbox />

// ✅ Correct - Use specific palettes when needed (e.g., for destructive actions)
<Button colorPalette="red">Delete</Button>
```

The global `colorPalette: "brand"` setting in `theme.ts` ensures all components use brand colors by default through their variants and recipes.

**Color Palette Inheritance**: The `colorPalette` prop is inherited by all children. Use `layerStyle` for common styling patterns instead of manually setting colors:

```tsx
// colorPalette and layerStyle are set once and inherited by all children
<Box colorPalette="error" layerStyle="fill.subtle">
  <Heading>Error</Heading> {/* Uses error palette */}
  <Text>Message</Text> {/* Uses error palette */}
  <Button>Action</Button> {/* Uses error palette */}
</Box>
```

**Using LayerStyles**: Chakra provides pre-defined layerStyles that work with colorPalette:

- `fill.subtle` - Subtle background with appropriate text color
- `fill.solid` - Solid background with contrast text
- `outline.solid` - Border with appropriate text color
- `outline.subtle` - Subtle border with text color

## Light and Dark Mode

The theme automatically supports both light and dark modes. Semantic tokens define different values for each mode:

```typescript
bg: {
  DEFAULT: {
    value: { _light: "white", _dark: "{colors.gray.950}" },
  },
}
```

Toggle color mode programmatically:

```tsx
import { useColorMode } from "@chakra-ui/react";

const { colorMode, toggleColorMode } = useColorMode();
```

## Strict Tokens Mode

The theme uses `strictTokens: true` for type safety. This ensures:

- Only defined tokens can be used
- TypeScript will error on invalid color values
- Better autocomplete in IDE

## Migration from Old Theme

The new theme replaces:

- `brandPalette` → Proper graded `brand` palette
- `header` → `bg.emphasized`
- `page` → `bg`
- `brand.primary` → `brand.solid`
- `brand.selected` → `brand.emphasized`
- `colorPalette="primary"` → removed (global default is "brand")
- `colorPalette="brand"` → removed (global, only use for exceptions)
- Direct color tokens → colorPalette with layerStyle:
  - `bg="bg.error" borderColor="border.error"` → `colorPalette="error" layerStyle="outline.solid"`
  - `bg="bg.error"` → `colorPalette="error" layerStyle="fill.subtle"`
  - `color="fg.error"` → `colorPalette="error"` (text inherits palette automatically)

## Resources

- [Chakra UI v3 Theming Guide](https://chakra-ui.com/docs/theming/overview)
- [Semantic Tokens Documentation](https://chakra-ui.com/docs/theming/tokens)
- [Color Palette Generator](https://hihayk.github.io/scale/)
