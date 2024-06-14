import type { StyleFunctionProps } from '@chakra-ui/react';
import { extendTheme, baseTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { mode } from "@chakra-ui/theme-tools";

const config = {
  useSystemColorMode: true,
  initialColorMode: 'system'
}
export const theme = extendTheme({
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
      100: '#e4f1ff',
      200: '#7F7A91',
      300: '#5A5766',
      500: '#4094D0',
      600: '#104378',
      700: '#FFE6B9',
      800: '#E4572E',
      900: '#ffffff',
    },
    brand: {
      primary: '#4094d0',
      selected: '#104378',
      dark: '#194069',
      darken: '#282c37',
    }
  },
  semanticTokens: {
    colors: {
      header: {
        bg: {
          default: baseTheme.colors.gray[500],
          _dark: baseTheme.colors.gray[800],
        },
      },
      sider: {
        bg: {
          default: baseTheme.colors.white,
          _dark: baseTheme.colors.gray[800],
        },
      }
    }
  },
  fonts: {
    heading: `'PTSansRegular', sans-serif`,
    body: `'PTSansRegular', sans-serif`,
  },

},
  withDefaultColorScheme({ colorScheme: 'brandPalette' }),
)
