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

All UI colors derive from semantic tokens that automatically adapt to color modes:

- **`bg.*`** - Background colors
  - `bg` - Default background (white/dark)
  - `bg.subtle` - Subtle background
  - `bg.muted` - Muted background
  - `bg.emphasized` - Emphasized background (uses brand colors)
  - `bg.panel` - Panel background
  - `bg.info`, `bg.error`, `bg.warning`, `bg.success` - Status backgrounds

- **`fg.*`** - Foreground (text) colors
  - `fg` - Default text color
  - `fg.muted` - Muted text
  - `fg.subtle` - Subtle text
  - `fg.info`, `fg.error`, `fg.warning`, `fg.success` - Status text

- **`border.*`** - Border colors
  - `border` - Default border
  - `border.muted` - Muted border
  - `border.emphasized` - Emphasized border
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

## Usage in Components

### ✅ Correct - Using Semantic Tokens

```tsx
// Use semantic tokens
<Box bg="bg.emphasized" color="fg">
  <Button colorPalette="brand">Submit</Button>
</Box>

// Components automatically use the brand palette
<Table.Row _hover={{ bg: "brand.muted" }}>
```

### ❌ Incorrect - Hardcoded Colors

```tsx
// Don't use hardcoded colors
<Box bg="#4094d0" color="black">
  <Button bg="blue.500">Submit</Button>
</Box>
```

## Component Variants

Many components support the `colorPalette` prop:

```tsx
<Button colorPalette="brand">Primary Action</Button>
<Switch colorPalette="brand" />
<Checkbox colorPalette="brand" />
```

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
import { useColorMode } from "@chakra-ui/react"

const { colorMode, toggleColorMode } = useColorMode()
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
- `brand.selected` → `brand.muted`
- `colorPalette="primary"` → `colorPalette="brand"`

## Resources

- [Chakra UI v3 Theming Guide](https://chakra-ui.com/docs/theming/overview)
- [Semantic Tokens Documentation](https://chakra-ui.com/docs/theming/tokens)
- [Color Palette Generator](https://hihayk.github.io/scale/)
