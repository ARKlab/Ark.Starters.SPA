# Tooling Strategy

This document explains the tooling choices made for this project and the rationale behind them.

## TypeScript Compilation

### Development & Testing: tsgo (TypeScript-Native)

- **Package**: `@typescript/native-preview@7.0.0-dev.20260124.1`
- **Commands**: `npm run typecheck`, `npm run typecheck:cypress`, `npm run typecheck:all`
- **Use Cases**:
  - Development type-checking (`npm run typecheck`)
  - E2E test type-checking (`npm run typecheck:cypress`)
  - CI parallel type-checking (`npm run typecheck:all`)
- **Benefits**: ~10x faster type-checking due to Go-based native implementation
- **Limitations**: Preview/alpha software, rapid iteration

### Production Builds: TypeScript v5

- **Package**: `typescript@5.9.3`
- **Command**: `npm run build` (uses `tsc && vite build`)
- **Rationale**:
  - Battle-tested, stable release
  - Maximum ecosystem compatibility
  - Production builds prioritize correctness over speed
  - No risk from preview software in production artifacts

## Linting & Formatting

### Linting: oxlint with tsgo support

- **Packages**: `oxlint`, `oxlint-tsgolint`, `vite-plugin-oxlint`
- **Command**: `npm run lint`
- **Configuration**: `.oxlintrc.json`
- **Benefits**:
  - 20-40x faster than ESLint
  - Type-aware linting powered by tsgo
  - Rust-based for maximum performance
  - Preserves all custom banned import rules
- **Vite Integration**: Runs automatically during development

### Formatting: oxfmt

- **Package**: `oxfmt`
- **Commands**: `npm run format`, `npm run format:check`
- **Configuration**: `.oxfmtrc.json` (Prettier-compatible)
- **Benefits**:
  - Faster than Prettier
  - Rust-based implementation
  - Drop-in Prettier replacement

## Custom Rules Preserved

The migration to oxlint successfully preserved all project-specific linting rules:

1. **Banned react-redux imports**: Must use pre-typed versions from `src/app/hooks.ts`
2. **Banned @reduxjs/toolkit imports**: Must use pre-typed createSlice/createAsyncThunk
3. **Banned fetchBaseQuery**: Must use appFetchQuery from `src/app/appFetchQuery.ts`
4. **Banned date-fns format**: Must use i18n 't' function for date formatting

## VS Code Integration

- **Extensions**:
  - `oxc.oxc-vscode` - oxlint and oxfmt integration (replaces ESLint and Prettier extensions)
  - `typescriptteam.native-preview` - TypeScript Native Preview for tsgo language server
- **Configuration**: `.vscode/settings.json`
- **Features**:
  - Format on save with oxfmt
  - Lint on type with oxlint
  - Type-aware diagnostics with oxlint
  - TypeScript language server powered by tsgo (10x faster IntelliSense)

### TypeScript Native Preview (tsgo)

The project is configured to use the experimental TypeScript Native Preview extension, which provides:

- **10x faster IntelliSense** - Go-based language server
- **Faster completions** - Native performance for autocomplete
- **Faster navigation** - Go-to-definition, find references
- **Experimental status** - Preview of TypeScript 7 features

**Configuration**: `"typescript.experimental.useTsgo": true` in `.vscode/settings.json`

**Note**: Some advanced features (auto-imports, certain refactorings) may still be in development. You can disable it by setting the value to `false` or using the Command Palette: "TypeScript Native Preview: Disable".

## Migration Notes

- Removed 120 ESLint/Prettier packages
- Installed 4 oxc-based packages
- All custom rules successfully migrated
- Build and test pipelines verified working
