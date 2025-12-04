import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
//import prettier from "eslint-plugin-prettier/recommended";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginCypress from "eslint-plugin-cypress/flat";
import pluginMocha from "eslint-plugin-mocha";
import pluginChaiFriendly from "eslint-plugin-chai-friendly";

export default tseslint.config(
  {
    ignores: ["src/components/ui/**/*.{ts,tsx}"],
  },

  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  jsxA11y.flatConfigs.strict,
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
  },
  {
    files: ["src/**/*.{ts,tsx,mtsx}", "pwa-assets.config.{ts,tsx,mtsx}", "vite.config.{ts,tsx,mtsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ["./tsconfig.json"],
      },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx", ".mtsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["tsconfig.json"],
        },
      },
    },
  },
  {
    files: ["cypress/**/*.{ts,tsx,mtsx}", "cypress.config.{ts,tsx,mtsx}"],
    extends: [
      pluginMocha.configs.recommended,
      pluginCypress.configs.recommended,
      pluginChaiFriendly.configs.recommendedFlat,
    ],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ["./cypress/tsconfig.json"],
      },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx", ".mtsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./cypress/tsconfig.json"],
        },
      },
    },
    rules: {
      "mocha/no-exclusive-tests": "error",
      "mocha/no-pending-tests": "error",
      "mocha/no-mocha-arrows": "off",
      "cypress/no-unnecessary-waiting": "off",
      "mocha/no-top-level-hooks": "off",
    },
  },
  {
    rules: {
      "no-restricted-imports": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-redux",
              importNames: ["useSelector", "useStore", "useDispatch"],
              message: "Please use pre-typed versions from `src/app/hooks.ts` instead.",
            },
            {
              name: "@reduxjs/toolkit",
              importNames: ["createSlice"],
              message: "Please use pre-typed versions from from `src/app/createAppSlice.ts` instead.",
            },
            {
              name: "@reduxjs/toolkit",
              importNames: ["createAsyncThunk"],
              message: "Please use pre-typed versions from `src/app/createAppAsyncThunk.ts` instead.",
            },
            {
              name: "@reduxjs/toolkit/query",
              importNames: ["fetchBaseQuery"],
              message: "Please use appFetchQuery from `src/app/appFetchQuery.ts` instead.",
            },
            {
              name: "@reduxjs/toolkit/query/react",
              importNames: ["fetchBaseQuery"],
              message: "Please use appFetchQuery from `src/app/appFetchQuery.ts` instead.",
            },
            {
              name: "@reduxjs/toolkit/query/react",
              importNames: ["retry"],
              message: "Please use retry from `@reduxjs/toolkit/query` instead.",
            },
            {
              name: "date-fns",
              importNames: ["format", "formatDate"],
              message: "Please use i18n 't' function for date formatting. Examples: t('date', { val: new Date() }) or use AppDateFormatter component. See src/features/localization/localizationPage.tsx for examples.",
            },
          ],
        },
      ],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNullish: true,
        },
      ],
      "@typescript-eslint/restrict-plus-operands": [
        "error",
        {
          allowNullish: true,
        },
      ],
      "@typescript-eslint/no-invalid-void-type": ["off"],
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",

      "@typescript-eslint/no-explicit-any": ["error"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksConditionals: false,
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
      "@typescript-eslint/no-unused-expressions": "error",

      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/promise-function-async": "warn",
      "import/default": "error",
      "import/export": "error",
      "import/named": "error",
      "import/no-cycle": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "error",
      "import/no-useless-path-segments": "warn",
      "import/order": [
        "warn",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
          "newlines-between": "always",
        },
      ],
      "no-constant-binary-expression": "error",
      "no-constant-condition": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "no-empty-pattern": "error",
      "no-extra-boolean-cast": "error",
      "no-redeclare": "error",
      "no-return-await": "error",
      "no-unsafe-negation": "warn",
      "no-unused-private-class-members": "error",
      "prefer-const": "warn",
      "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],

      // Prevent unexpected parseInt() output that does not return the number calculated in decimal when given a value such as parseInt(071).
      radix: "error",
      "require-atomic-updates": ["error", { allowProperties: true }],
      "valid-typeof": "warn",
    },
  },
  {
    files: ["**/*.{jsx,mjsx,tsx,mtsx,ts}"],
    ...react.configs.flat.recommended,
    plugins: {
      react,
      "react-hooks": hooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...hooks.configs["recommended-latest"].rules,
      "react-refresh/only-export-components": ["error", { allowConstantExport: true }],
      "react-hooks/exhaustive-deps": ["error"],
      "react-hooks/rules-of-hooks": "error",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: [
      ".vscode/**",
      "node_modules/**",
      "public/**",
      "build/**",
      "dist/**",
      "cypress/dist/**",
      "coverage/**",
      ".github/**",
      ".swc/**",
      "dev-dist/**",
      "eslint.config.mjs",
    ],
  },
);
