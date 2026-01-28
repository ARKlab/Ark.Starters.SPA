# Coding Guidelines

> **Purpose**: Mandatory coding standards for ARK Starters SPA. All contributions MUST follow these rules.

## Language

- **MUST** write all code in English (variable names, function names, comments, etc.)
- **MUST NOT** use non-English names in code
- **Exception**: Translation files in `src/locales/*/`

## Internationalization (i18n)

- **MUST** use translation keys for all UI text
- **MUST NOT** use hardcoded strings in components
- **MUST** use `libComponents` namespace for components in `src/lib/components/`
- **MUST** use default `translation` namespace for `src/components/` and `src/features/`
- **MUST** use `useTranslation()` hook for date formatting in React components
- **MUST** use helpers from `@/lib/i18n/formatDate` for date formatting in utility functions
- **MUST NOT** import `date-fns` directly in components

## Styling

- **MUST** use semantic tokens from `theme.ts` for all colors
- **MUST NOT** use hardcoded color values (hex, rgb, named colors)
- **MUST** use Chakra UI predefined z-index values only
- **MUST NOT** use custom z-index values
- **MUST** use Chakra tokens for text sizes and element dimensions
- **MUST** use Chakra spacing tokens for margins and padding

### Allowed z-index Values

```typescript
hide: -1, auto: "auto", base: 0, docked: 10,
dropdown: 1000, sticky: 1100, banner: 1200, overlay: 1300,
modal: 1400, popover: 1500, skipLink: 1600,
toast: 1700, tooltip: 1800
```

## Icons

- **MUST** use a single icon set for the whole App. Lucide is the default.
- **MUST** use Lucide icon set (`react-icons/lu`) exclusively
- **MUST NOT** import icons from other `react-icons` packages (fa, md, io, etc.)
- **Reason**: Using a single icon set ensures optimal bundle size through better tree-shaking

## TypeScript

- **MUST** use TypeScript strict mode
- **MUST NOT** use `any` type
- **MUST** use `unknown` instead of `any` for dynamic types
- **MUST** prefer type inference over explicit types where possible
- **MUST** use `interface` for object shapes
- **MUST** use `type` for unions and intersections

## Exports

- **MUST** prefer named exports
- **MUST NOT** use default exports (avoid when possible)

## Color Mode

- **MUST** set a custom localStorage key for color mode to avoid conflicts:
  ```typescript
  const colorModeManager = createLocalStorageManager("appName-ColorMode");
  ```

## Commit Messages

- **MUST** follow Conventional Commits specification
- **Format**: `<type>(<scope>): <subject>`
- **Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **Example**: `feat(auth): add support for custom MSAL scopes`

## Testing

- **MUST** run `bun run lint` before committing
- **MUST** run `bun run build` to verify build success
- **MUST** run `bun run test` for E2E tests when modifying functionality

## Bundle Optimization & Performance

> **Lessons from modernization effort** - Follow these practices to maintain optimal bundle size and performance.

### Imports and Tree-Shaking

- **MUST** use named imports from libraries for better tree-shaking
  ```typescript
  // ✅ GOOD
  import { format, parseISO } from "date-fns";
  
  // ❌ BAD
  import * as dateFns from "date-fns";
  ```
- **MUST** declare `sideEffects` appropriately when creating packages
- **MUST** verify tree-shaking effectiveness with bundle analyzer before assuming it works

### React Best Practices

- **SHOULD** trust React Compiler for optimization instead of manual `useMemo`/`useCallback`
- **MUST** keep manual memoization only for:
  - Third-party library compatibility (e.g., TanStack Table columns)
  - Expensive computations in performance-critical paths
  - Referential equality requirements in dependency arrays
- **MUST** profile before optimizing - measure, don't guess

### Conditional Features

- **MUST** use lazy loading for optional features (analytics, monitoring)
  ```typescript
  // ✅ GOOD - Conditional lazy loading
  if (settings.appInsights) {
    const { setupAppInsights } = await import("./lib/applicationInsights");
    setupAppInsights(settings.appInsights);
  }
  ```
- **MUST NOT** use dynamic imports in critical initialization paths
- **MUST** maintain synchronous initialization for E2E test compatibility

### Build-Time vs Runtime Optimization

- **MUST** prefer build-time configuration over runtime for starter templates
  - Use commenting or environment variables for one-time configuration
  - Ensures better tree-shaking and test compatibility
- **SHOULD** use runtime dynamic loading only for:
  - Multi-tenant applications with variable configuration
  - Feature flags in production environments
  - Non-critical optional features

### Type Safety Trade-offs

- **MUST NOT** sacrifice type safety for minor bundle size improvements
- **MUST NOT** use `as any`, `@ts-ignore`, or disable strict checks for optimization
- **MUST** reject optimizations that create high maintenance burden relative to savings
- **SHOULD** maintain strict TypeScript configuration as primary goal

### Browser Support

- **MUST** use feature detection over browser version numbers
  ```typescript
  // ✅ GOOD - Feature-based targeting
  modernTargets: [
    'baseline widely available with downstream and ' +
    'fully supports css-variables and ' +
    'fully supports serviceworkers'
  ]
  
  // ❌ BAD - Version-based targeting
  modernTargets: ['chrome>=90', 'firefox>=88']
  ```
- **MUST** document required features and their rationale
- **SHOULD** use Web Platform Baseline for modern browser definition

### Decision Documentation

- **MUST** document optimization decisions with clear rationale
- **MUST** record failed approaches to prevent repeated attempts
- **SHOULD** create evaluation documents for significant trade-off decisions
- **SHOULD** update documentation as understanding evolves

### Verification

- **MUST** run E2E tests after any optimization changes
- **MUST** verify bundle impact with `npm run analyze`
- **MUST** compare before/after measurements
- **SHOULD** monitor bundle size in CI/CD to prevent regressions
>>>>>>> origin/master
