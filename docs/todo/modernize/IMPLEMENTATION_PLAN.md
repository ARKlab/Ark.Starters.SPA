# Bundle Size Optimization - Implementation Plan

**Date:** 2026-01-15  
**Target:** Reduce bundle size by 40-50% (from ~513KB to ~250-300KB gzipped)  
**Timeline:** Can be implemented incrementally over 2-3 sprints

---

## Priority Matrix

| Priority | Impact | Effort | Risk       | Focus                |
| -------- | ------ | ------ | ---------- | -------------------- |
| P0       | High   | Low    | Low        | Quick wins           |
| P1       | High   | Medium | Low-Medium | Core optimizations   |
| P2       | Medium | Medium | Medium     | Nice to have         |
| P3       | Low    | Any    | Any        | Future consideration |

---

## Phase 1: Quick Wins (P0) - Week 1

**Expected Savings: ~150-200KB gzipped (~300-400KB uncompressed)**  
**Effort: 1-3 days**  
**Risk: Low**

### 1.1 Optimize Chakra UI Configuration

**Current Issue:** Using `defaultConfig` which includes ALL component recipes and theme tokens.

**Solution:**

```typescript
// ❌ BEFORE (src/theme.ts)
import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  // your customizations
});

// ✅ AFTER
import { createSystem, defaultBaseConfig } from "@chakra-ui/react";
import { buttonRecipe, inputRecipe /* only what you use */ } from "@chakra-ui/react/theme";

const theme = createSystem(defaultBaseConfig, {
  theme: {
    // Import only the recipes you actually use
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      // Add others as needed
    },
  },
  // your other customizations
});
```

**Implementation Steps:**

1. Analyze which Chakra components are actually used:

   ```bash
   grep -r "from \"@chakra-ui/react\"" src --include="*.tsx" | \
   sed 's/.*import.*{\(.*\)}.*/\1/' | \
   tr ',' '\n' | sort | uniq
   ```

2. Replace `defaultConfig` with `defaultBaseConfig` in `src/theme.ts`

3. Import only needed component recipes:
   - Accordion, Alert, Avatar, Badge, Button
   - Card, Checkbox, Dialog, Drawer, Field
   - Input, Menu, Modal, Progress, Select
   - Slider, Switch, Table, Tabs, Tag
   - Tooltip, Others as needed

4. Test all pages to ensure styling works

5. Run build and verify size reduction

**Expected Gain:** 80-120KB gzipped

**Reference:** https://next.chakra-ui.com/guides/component-bundle-optimization

---

### 1.2 Add sideEffects Declaration

**Current Issue:** `package.json` missing `sideEffects` declaration, limiting tree-shaking.

**Solution:**

```json
// package.json
{
  "name": "ark.starters.spa",
  "sideEffects": false
  // ... rest of config
}
```

**Implementation:**

1. Add `"sideEffects": false` to package.json
2. Test thoroughly to ensure no side-effect code is removed
3. If issues arise, whitelist specific files:
   ```json
   "sideEffects": [
     "**/*.css",
     "./src/initGlobals.tsx",
     "./src/lib/mocks/**"
   ]
   ```

**Expected Gain:** 20-40KB gzipped (helps bundler eliminate unused code)

**Reference:** https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free

---

### 1.3 Remove Manual Memoization

**Current Issue:** 32 instances of `useMemo`/`useCallback` while React Compiler is enabled.

**Solution:**
Remove unnecessary manual memoization:

```typescript
// ❌ BEFORE
const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(), []);

// ✅ AFTER (React Compiler handles this)
const memoizedValue = computeValue(a, b);
const memoizedCallback = () => doSomething();
```

**Implementation:**

1. Search for all useMemo/useCallback:

   ```bash
   grep -r "useMemo\|useCallback" src --include="*.tsx" --include="*.ts"
   ```

2. Review each usage:
   - **Keep:** If preventing expensive re-renders in specific hot paths
   - **Remove:** General value computation or simple callbacks
   - **Keep:** If used for referential equality in dependencies

3. Test performance before/after with React DevTools Profiler

**Expected Gain:** Minimal bundle size, but improved runtime and cleaner code

---

## Phase 2: Core Optimizations (P1) - Week 2-3

**Expected Savings: ~200-300KB gzipped**  
**Effort: 5-7 days**  
**Risk: Low-Medium**

### 2.1 Dynamic Authentication Provider Loading

**Current Issue:** Both Auth0 and MSAL are bundled (~150KB combined), but only one is used.

**Solution:**

```typescript
// ❌ BEFORE (src/config/authProvider.ts)
import { Auth0Provider } from "./lib/authentication/providers/auth0Provider";
import { MsalProvider } from "./lib/authentication/providers/msalProvider";

export const authProvider =
  settings.authType === "auth0" ? new Auth0Provider(settings) : new MsalProvider(settings);

// ✅ AFTER
export async function getAuthProvider(settings: AppSettings): Promise<AuthProvider> {
  if (settings.authType === "auth0") {
    const { Auth0Provider } = await import("./lib/authentication/providers/auth0Provider");
    return new Auth0Provider(settings);
  } else {
    const { MsalProvider } = await import("./lib/authentication/providers/msalProvider");
    return new MsalProvider(settings);
  }
}
```

**Implementation:**

1. Convert `authProvider` to async function
2. Update `initGlobals.tsx` to await provider initialization:
   ```typescript
   const authProvider = await getAuthProvider(appSettings);
   const store = initStore({ authProvider });
   ```
3. Update `configureStore.ts` to handle async provider
4. Test both Auth0 and MSAL authentication flows
5. Verify bundle analyzer shows only one provider in build

**Expected Gain:** 60-80KB gzipped

---

### 2.2 Lazy Load Redux API Slices

**Current Issue:** All Redux API slices loaded in `configureStore.ts`, even for unused features.

**Solution:**

```typescript
// ❌ BEFORE (src/app/configureStore.ts)
import { configTableApiSlice } from "../features/configTable/configTableApi";
import { jsonPlaceholderApi } from "../features/fetchApiExample/jsonPlaceholderApi";
// All imported upfront

const sliceReducers = combineSlices(
  authSlice,
  // All slices added here
  configTableApiSlice,
  jsonPlaceholderApi,
  // ...
);

// ✅ AFTER - Use reducer injection
import { createSlice } from "@reduxjs/toolkit";

// Base store with only essential slices
const baseSliceReducers = combineSlices(
  authSlice,
  envSlice,
  errorReducer,
  // Only core slices
);

// In feature components, inject reducers dynamically:
// src/features/configTable/configTableExample.tsx
import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";

export function ConfigTableExample() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    import("./configTableApi").then(({ configTableApiSlice }) => {
      // Inject reducer if not already present
      if (!store.asyncReducers?.configTableApi) {
        store.injectReducer("configTableApi", configTableApiSlice.reducer);
        dispatch(configTableApiSlice.middleware);
      }
    });
  }, [dispatch]);

  // Component logic
}
```

**Alternative Simpler Approach:**

Use React.lazy for feature bundles:

```typescript
// src/app/routes.tsx
const ConfigTablePage = lazy(() => import("@/features/configTable/configTableExample"));
const MoviesPage = lazy(() => import("@/features/paginatedTable/moviePage"));
```

Each lazy-loaded route component imports its own API slice, automatically code-splitting it.

**Implementation:**

1. **Option A (Advanced):** Implement dynamic reducer injection
   - Add `injectReducer` method to store
   - Update each feature to inject its own API slice
   - Remove imports from configureStore.ts
2. **Option B (Simpler - RECOMMENDED):** Rely on existing lazy loading
   - Verify all route-level components use React.lazy
   - Move API slice imports closer to component usage
   - Let Vite's code splitting handle the rest

**Expected Gain:** 40-60KB gzipped

---

### 2.3 Conditional Application Insights Loading

**Current Issue:** Application Insights loaded even when not configured (~200KB total).

**Solution:**

```typescript
// ❌ BEFORE (src/initApp.tsx)
import { reactPlugin, setupAppInsights } from "./lib/applicationInsights";

// Always executed, even if not configured
if (appSettings.applicationInsights)
    setupAppInsights(appSettings.applicationInsights);

// ✅ AFTER
// Lazy load entire App Insights module
if (appSettings.applicationInsights) {
  const { setupAppInsights } = await import("./lib/applicationInsights");
  setupAppInsights(appSettings.applicationInsights);
}

// Create stub context provider if not loaded
const AppInsightsProvider = appSettings.applicationInsights
  ? (await import("@microsoft/applicationinsights-react-js")).AppInsightsContext.Provider
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;
```

**Implementation:**

1. Wrap Application Insights imports in dynamic import
2. Create stub/no-op provider when not configured
3. Update `main.tsx` to use conditional provider
4. Test with and without Application Insights configured
5. Verify bundle excludes App Insights packages when not needed

**Expected Gain:** 80-120KB gzipped (when not using App Insights)

---

### 2.4 Optimize react-icons Imports

**Current Issue:** Importing from multiple icon sets (lu, hi).

**Solution:**

```typescript
// ❌ BEFORE
import { LuFile, LuUpload } from "react-icons/lu"
import { HiOutlineInformationCircle } from "react-icons/hi"

// ✅ AFTER - Use single icon set or create SVG components
import { LuFile, LuUpload, LuInfo } from "react-icons/lu"
// OR
export const InfoIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48..." />
  </svg>
);
```

**Implementation:**

1. Audit all react-icons usage:

   ```bash
   grep -r "from \"react-icons" src --include="*.tsx"
   ```

2. Choose one primary icon set (lucide/lu recommended)

3. Replace icons from other sets with equivalents

4. For custom/unique icons, create SVG components

**Expected Gain:** 20-40KB gzipped

---

## Phase 3: Advanced Optimizations (P2) - Week 4

**Expected Savings: ~100-150KB gzipped**  
**Effort: 3-5 days**  
**Risk: Medium**

### 3.1 Evaluate Application Insights Alternatives

**Current Issue:** Heavy monitoring stack (3 packages, ~200KB).

**Solution:**

Consider lighter alternatives:

- **Sentry Browser SDK:** ~60KB (vs 200KB for App Insights)
- **OpenTelemetry Web:** Modular, pay-for-what-you-use
- **Native Browser APIs:** Performance API + Error boundaries (0KB)

**Implementation:**

1. Research team requirements for monitoring/analytics
2. If only error tracking needed, consider Sentry
3. If full telemetry needed but willing to self-host, try OpenTelemetry
4. If minimal needs, use native APIs with custom reporting

**Decision Criteria:**

- Do you need auto-instrumentation? → Keep App Insights
- Only error tracking? → Switch to Sentry
- Custom telemetry? → OpenTelemetry or native APIs

**Expected Gain:** 100-140KB gzipped (if switching to lighter solution)

---

### 3.2 Review @tanstack/react-table Usage

**Current Issue:** TanStack Table in common chunk (bundled with all pages).

**Analysis:**

```bash
grep -r "@tanstack/react-table" src --include="*.tsx"
```

**Solution:**

If used in <5 places:

- Consider simpler table implementation for basic cases
- Keep TanStack for complex tables only
- Code-split table-heavy features

If used extensively:

- Current approach is optimal

**Implementation:**

1. Count actual usage of TanStack Table
2. Evaluate if simple tables could use native `<table>`
3. Move complex table features to lazy-loaded routes

**Expected Gain:** 20-40KB gzipped (if reduced usage)

---

### 3.3 Optimize Vite Build Configuration

**Current Issue:** Could improve chunk splitting strategy.

**Solution:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendors by frequency of change
          "react-core": ["react", "react-dom", "react-router"],
          state: ["@reduxjs/toolkit", "react-redux"],
          "ui-chakra": ["@chakra-ui/react", "@emotion/react"],
          "ui-icons": ["react-icons/lu"], // After consolidating
          i18n: ["i18next", "react-i18next"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          tables: ["@tanstack/react-table"], // If kept
          utils: ["date-fns", "@dnd-kit/core", "@dnd-kit/sortable"],
        },
      },
    },
  },
});
```

**Implementation:**

1. Update manual chunks configuration
2. Analyze bundle to verify optimal splitting
3. Test caching effectiveness with version updates

**Expected Gain:** No size reduction, but better caching (fewer re-downloads)

---

### 3.4 Consider Dropping Legacy Browser Support

**Current Issue:** Legacy polyfills add 65KB.

**Analysis:**

- Check analytics for browser versions
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+) are 95%+ in 2025

**Solution:**

```typescript
// vite.config.ts
legacy({
  renderLegacyChunks: false, // Already set ✓
  modernTargets: [
    // Tighten requirements further
    'chrome>=100',
    'firefox>=100',
    'safari>=15',
    'edge>=100',
  ],
  modernPolyfills: false, // Remove polyfills entirely
}),
```

**Implementation:**

1. Review browser analytics
2. Discuss with stakeholders
3. Update browserslist if approved
4. Remove or reduce polyfills

**Expected Gain:** 40-65KB gzipped (if dropping legacy entirely)

---

## Phase 4: Future Considerations (P3)

**Expected Savings: Variable**  
**Effort: High**  
**Risk: Medium-High**

### 4.1 Chakra UI Theme Ejection

**Description:** Eject Chakra theme for complete control.

**When:**

- After exhausting other optimizations
- If need <100KB Chakra bundle
- Team comfortable maintaining custom theme

**Process:**

```bash
npx @chakra-ui/cli eject
```

**Expected Gain:** 100-150KB gzipped  
**Maintenance Cost:** High

---

### 4.2 Evaluate Date Library Alternatives

**Current:** date-fns 4.1.0 (minimal usage, well tree-shaken)

**Alternatives:**

- Native `Intl.DateTimeFormat` (0KB)
- Temporal API (when available)
- Keep date-fns (currently optimal)

**Recommendation:** Keep current implementation (already efficient)

---

### 4.3 Explore Micro-Frontends

**When:** If app grows to 50+ routes

**Approach:**

- Split into separate apps by domain
- Use module federation
- Independent deployment

**Expected Gain:** Depends on architecture  
**Complexity:** Very High

---

## Implementation Checklist

### Before Starting

- [ ] Create feature branch: `optimize/bundle-size`
- [ ] Set up bundle analyzer in CI:
  ```bash
  bun run analyze
  ```
- [ ] Document baseline metrics
- [ ] Communicate plan to team

### Phase 1 (Quick Wins)

- [ ] Optimize Chakra UI config (2.1)
- [ ] Add sideEffects declaration (2.2)
- [ ] Remove manual memoization (2.3)
- [ ] Test all changes
- [ ] Run bundle analyzer
- [ ] Document size improvements
- [ ] Merge to main

### Phase 2 (Core)

- [ ] Dynamic auth provider loading (3.1)
- [ ] Lazy load Redux slices (3.2)
- [ ] Conditional App Insights (3.3)
- [ ] Optimize react-icons (3.4)
- [ ] Test thoroughly
- [ ] Run bundle analyzer
- [ ] Document improvements
- [ ] Merge to main

### Phase 3 (Advanced)

- [ ] Evaluate monitoring alternatives (4.1)
- [ ] Review table library usage (4.2)
- [ ] Optimize Vite config (4.3)
- [ ] Consider legacy support (4.4)
- [ ] Test and validate
- [ ] Final bundle analysis
- [ ] Merge to main

---

## Success Metrics

### Bundle Size Targets

| Metric        | Before | Target | Stretch |
| ------------- | ------ | ------ | ------- |
| Total Gzipped | 513KB  | 300KB  | 250KB   |
| Largest Chunk | 628KB  | 300KB  | 200KB   |
| Initial Load  | 1.4MB  | 800KB  | 600KB   |

### Performance Targets

| Metric       | Before | Target | Stretch |
| ------------ | ------ | ------ | ------- |
| TTI (3G)     | 7-8s   | 4s     | 3s      |
| FCP          | 2-3s   | 1.5s   | 1s      |
| Bundle Parse | 800ms  | 400ms  | 300ms   |

### Measurement

Use Lighthouse CI:

```bash
bun install -g @lhci/cli
lhci autorun --config=lighthouserc.json
```

Track over time in CI/CD pipeline.

---

## Risk Mitigation

### Testing Strategy

1. **Unit Tests:** Verify functionality unchanged
2. **E2E Tests:** Run full Cypress suite
3. **Manual Testing:** Test all auth flows
4. **Performance Testing:** Lighthouse before/after
5. **Bundle Analysis:** Compare at each phase

### Rollback Plan

1. Keep Git tags at each phase
2. Feature flags for risky changes
3. Gradual rollout (10% → 50% → 100%)
4. Monitor error rates in production

### Communication

- Weekly updates on progress
- Demo size improvements to stakeholders
- Document any breaking changes

---

## Resources & References

### Documentation

- Chakra UI Optimization: https://next.chakra-ui.com/guides/component-bundle-optimization
- Vite Performance: https://vite.dev/guide/performance
- React 19 Compiler: https://react.dev/learn/react-compiler
- Tree Shaking Guide: https://webpack.js.org/guides/tree-shaking/

### Tools

- Bundle Analyzer: Already configured (`bun run analyze`)
- Lighthouse CI: For performance tracking
- webpack-bundle-analyzer: Alternative visualization

### Community Examples

- Next.js Performance: https://nextjs.org/docs/app/building-your-application/optimizing
- Vercel Analytics: https://vercel.com/analytics

---

## Appendix A: Quick Reference Commands

```bash
# Analyze bundle
bun run analyze

# Check bundle sizes
du -sh build/assets/*.js | sort -h

# Find large dependencies
bun install -g cost-of-modules
cost-of-modules

# Audit imports
grep -r "import.*from" src --include="*.tsx" | cut -d'"' -f2 | sort | uniq -c | sort -rn

# Check tree-shaking
NODE_ENV=production bun run build -- --mode analyze

# Performance test
lighthouse http://localhost:3000 --view

# Dependency analysis
npx depcheck
```

---

## Appendix B: Example PRs

Create incremental PRs for review:

1. **PR #1: Chakra UI Optimization**
   - Switch to defaultBaseConfig
   - Import only needed recipes
   - Add sideEffects declaration

2. **PR #2: Dynamic Imports**
   - Auth provider lazy loading
   - Redux slice code splitting
   - App Insights conditional loading

3. **PR #3: Dependency Cleanup**
   - Consolidate react-icons
   - Remove manual memoization
   - Update Vite config

Each PR should:

- Show bundle size comparison
- Include performance metrics
- Pass all tests
- Be independently deployable

---

**End of Implementation Plan**

For questions or clarifications, refer to the detailed analysis in `BUNDLE_ANALYSIS.md`.
