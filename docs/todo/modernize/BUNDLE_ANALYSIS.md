# Bundle Size and Performance Analysis

**Date:** 2026-01-15  
**Project:** ARK Starters SPA  
**Framework:** React 19.2 + Vite 7.3 + Chakra UI v3.31

---

## Executive Summary

The production build generates a total bundle size of approximately **2.8MB** (before compression) with the largest assets being:

1. **chakra-DsxGPrcm.js** - 628KB (175.6KB gzipped) ⚠️
2. **initGlobals-BAzI5CbD.js** - 576KB (188.5KB gzipped) ⚠️
3. **index-Cl2F2ajK.js** - 196KB (62.6KB gzipped)
4. **i18n-CfckSkzl.js** - 128KB (39.1KB gzipped)
5. **common-CipxfGVK.js** - 120KB (34.6KB gzipped)

**Key Findings:**
- Chakra UI is the single largest contributor (~628KB)
- Application globals bundle is suspiciously large (~576KB)
- Tree-shaking appears to be working but not optimally
- Good code splitting is already in place for features
- React Compiler is enabled but manual memoization still exists (32 instances)

---

## Detailed Analysis

### 1. Chakra UI Bundle (628KB - TOP CULPRIT)

**Current State:**
- Imports use the main `@chakra-ui/react` package
- Default theme and config are included
- All UI components are bundled even if not used

**Issues:**
- The bundle includes the entire Chakra UI ecosystem
- `defaultConfig` from `@chakra-ui/react` pulls in ALL component recipes
- Theme tokens for ALL components are included
- No modular imports being used

**Evidence:**
```typescript
// src/theme.ts
import { createSystem, defaultConfig } from "@chakra-ui/react";

// src/components/ui/provider.tsx
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
```

**Opportunities:**
- Use `defaultBaseConfig` instead of `defaultConfig` (saves ~100KB)
- Import only needed component recipes explicitly
- Consider ejecting theme for maximum control
- Implement modular component imports (not feasible for v3, but can optimize recipes)

### 2. InitGlobals Bundle (576KB - CRITICAL ISSUE)

**Current State:**
The `initGlobals.tsx` file is deceptively simple but pulls in massive dependencies:

**Major Contributors:**
1. **Redux Store** with ALL API slices loaded eagerly:
   - `configTableApiSlice`
   - `videoGameApiSlice` 
   - `jsonPlaceholderApi`
   - `moviesApiSlice`
   - `rtkqErrorHandlingApi`
   - `globalLoadingSlice`

2. **Authentication Providers** (both Auth0 AND MSAL):
   - `@auth0/auth0-spa-js` (~2.11.2)
   - `@azure/msal-browser` (~4.27.0)

3. **Application Insights** (3 packages):
   - `@microsoft/applicationinsights-web`
   - `@microsoft/applicationinsights-react-js`
   - `@microsoft/applicationinsights-clickanalytics-js`

4. **MSW (Mock Service Worker)** conditionally loaded (NOT in production):
   ```typescript
   // src/initApp.tsx lines 25-28
   if (import.meta.env.DEV || import.meta.env.MODE === "e2e") {
       const { worker } = await import('./lib/mocks/browserWorker');
       await worker.start({ onUnhandledRequest: "warn" });
   }
   ```
   
   **Note:** MSW is correctly excluded from production builds via the conditional check above. The dynamic import ensures tree-shaking removes it from production bundles.

**Issues:**
- All Redux API slices are imported synchronously in `configureStore.ts`
- Both auth providers are bundled even though only one is used at runtime
- Application Insights is loaded even if not configured
- MSW infrastructure is imported (though conditionally loaded)

**Opportunities:**
- Lazy load Redux API slices per feature
- Dynamic import for unused auth provider
- Conditional Application Insights loading
- Code-split authentication providers

### 3. React & Dependencies

**Current State:**
- React 19.2.3 with React Compiler enabled ✓
- 32 instances of manual `useMemo`/`useCallback` remain
- Good use of `React.lazy` for major routes

**Opportunities:**
- Remove manual memoization (React Compiler handles this)
- Ensure all route-level components use lazy loading

### 4. Date & Internationalization

**Current State:**
- `date-fns` 4.1.0: Only 4 imports, well tree-shaken ✓
- `i18next` 25.7.4: Bundle is reasonable at 128KB
- Using custom i18next formatters (good) ✓

**Opportunities:**
- Already optimized, minimal gains available

### 5. Other Dependencies

**Findings:**
- `@tanstack/react-table`: Included in common chunk (118KB)
- `@dnd-kit/*`: Only 4 uses, but all packages imported
- `react-icons`: Multiple imports from different icon sets (lu, hi)
- `zod`: Used for form validation, size is acceptable

**Opportunities:**
- Consider reducing TanStack Table usage if only used in a few places
- Consolidate react-icons to single icon set
- DnD Kit is minimal, acceptable

### 6. Build Configuration Analysis

**Current Vite Config:**

✓ **Good:**
- Manual chunks defined for vendor code splitting
- `esnext` target for modern browsers
- Source maps enabled
- Drop console/debugger in production

⚠️ **Missing:**
- No `sideEffects: false` in package.json
- Could optimize chunk splitting strategy
- Legacy plugin included but may not be needed

---

## Bundle Size Breakdown

### By Category (Estimated)

| Category | Size (uncompressed) | Gzipped | % of Total |
|----------|---------------------|---------|------------|
| Chakra UI | ~628KB | ~176KB | 38% |
| Application Code | ~576KB | ~189KB | 35% |
| React Core | ~100KB | ~34KB | 6% |
| i18n | ~130KB | ~39KB | 8% |
| Common Utils | ~120KB | ~35KB | 7% |
| RTK + Redux | ~70KB | ~25KB | 4% |
| Other | ~40KB | ~15KB | 2% |
| **Total** | **~1.66MB** | **~513KB** | **100%** |

### Critical Path Analysis

**Initial Load Requirements (FCP):**
1. Chakra UI theme + base components: 628KB
2. App initialization + Redux store: 576KB  
3. React runtime: 100KB
4. i18n runtime: 130KB

**Total Critical Path: ~1.4MB uncompressed, ~513KB gzipped**

**Ideal Target: <300KB gzipped for modern SPAs**

---

## Performance Metrics Impact

### Current State (Estimated)

Based on bundle sizes and typical 3G network (750Kbps):

- **Download Time:** ~5.5s (513KB @ 750Kbps)
- **Parse Time:** ~800ms (1.66MB of JavaScript)
- **Time to Interactive (TTI):** ~7-8s

### Target State (After Optimization)

- **Download Time:** ~2.5s (200-250KB gzipped)
- **Parse Time:** ~300ms (<600KB JavaScript)
- **Time to Interactive (TTI):** ~3-4s

**Expected Improvement: 50-60% reduction in TTI**

---

## Tree Shaking Assessment

### What's Working ✓

1. **Vite's default tree-shaking** for ES modules
2. **Date-fns**: Only used functions imported
3. **Named imports** from most libraries
4. **Code splitting** by route/feature

### What's NOT Working ⚠️

1. **Chakra UI**: `defaultConfig` pulls entire theme
2. **Redux API slices**: All imported synchronously
3. **Dual auth providers**: Both bundled
4. **Application Insights**: All 3 packages loaded
5. **No sideEffects declaration**: `package.json` missing optimization hint

### Root Causes

1. **Barrel file pattern**: Some dependencies use index re-exports
2. **Static imports**: Critical path imports aren't lazy
3. **Default configs**: Using "kitchen sink" defaults instead of custom builds
4. **No build-time pruning**: Dependencies included even when unused

---

## Comparison with Best Practices

### Industry Standards (2024-2025)

| Metric | This Project | Industry Target | Status |
|--------|--------------|-----------------|--------|
| Initial Bundle (gzipped) | 513KB | <200KB | ❌ 2.5x over |
| Largest Chunk | 628KB | <300KB | ❌ 2x over |
| Time to Interactive | ~7-8s | <3s | ❌ 2.5x over |
| Code Splitting | ✓ Good | ✓ Required | ✓ Pass |
| Tree Shaking | Partial | Aggressive | ⚠️ Needs work |
| Lazy Loading | ✓ Routes | ✓ Routes+Libs | ⚠️ Partial |

---

## Modernization Opportunities

### React 19 Features

1. **React Compiler** ✓ Enabled
   - **Action:** Remove manual `useMemo`/`useCallback` (32 instances found)
   - **Expected gain:** Minimal bundle, but cleaner code

2. **Server Components** ❌ Not applicable (SPA)

3. **Improved JSX Transform** ✓ Already using

### Vite 7 Features

1. **Improved Rollup Integration** ✓ Active
2. **Better Chunk Splitting** ⚠️ Could be optimized
3. **Module Federation** ❌ Not needed for this architecture

### Chakra UI v3 Features

1. **Modular Recipes** ⚠️ Not using
   - Import only needed component recipes
   - Expected gain: ~100-150KB

2. **Base Config** ⚠️ Using full config
   - Switch from `defaultConfig` to `defaultBaseConfig`
   - Expected gain: ~80-100KB

3. **Theme Ejection** 🎯 Advanced option (⚠️ NOT RECOMMENDED)
   - Full control over included styles
   - Expected gain: ~150-200KB
   - **Impact for Template Users:**
     - ❌ **Loses ability to receive Chakra UI theme updates** - Must manually merge theme changes from new Chakra versions
     - ❌ **Increases maintenance burden** - Team becomes responsible for maintaining entire theme codebase
     - ❌ **Breaks upgrade path** - Cannot simply `npm update @chakra-ui/react` without reviewing ejected theme files
     - ❌ **Knowledge requirement** - Requires deep understanding of Chakra internals to maintain
     - ✅ **When appropriate** - Only for projects that have stabilized their design system and don't need Chakra updates
   - **Recommendation:** Use `defaultBaseConfig` + selective recipe imports instead (achieves 80% of the savings without the maintenance cost)

---

## Technical Debt Identified

1. **Dual Authentication Providers**
   - Both Auth0 and MSAL bundled
   - Only one used at runtime based on config

2. **Eager Redux Store**
   - All API slices loaded upfront
   - Should be lazy-loaded per feature

3. **Application Insights**
   - Heavy monitoring SDKs (~200KB combined)
   - Loaded even when not configured

4. **Manual Memoization**
   - 32 instances with React Compiler enabled
   - Should be removed

5. **Missing Build Hints**
   - No `sideEffects: false` in package.json
   - Limits tree-shaking effectiveness

---

## Browser Compatibility Considerations

**Current Config:**
- Target: `esnext`
- Legacy plugin enabled for older browsers
- Polyfills: ~65KB

**Recommendation:**
- Modern browsers are 95%+ of traffic in 2025
- Consider dropping legacy support or making it optional
- Potential savings: ~65KB polyfills + faster parsing

---

## Conclusion

The main bundle size culprits are:

1. **Chakra UI (628KB)** - Using full config instead of optimized approach
2. **Application Globals (576KB)** - Eager loading of all dependencies
3. **Dual Auth Providers** - Both included when only one is used
4. **Application Insights** - Heavy monitoring stack

**Total Optimization Potential: 600-800KB reduction (40-50% smaller bundle)**

The good news: Tree-shaking IS working for most modern dependencies (date-fns, etc.). The issues are primarily with how libraries are imported and initialized, not fundamental tree-shaking failures.

---

## Next Steps

See `IMPLEMENTATION_PLAN.md` for detailed, prioritized optimization strategies with step-by-step implementation guidance.
