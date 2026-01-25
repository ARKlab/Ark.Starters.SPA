# Chakra UI Optimization - Technical Blocker Analysis

**Date:** 2026-01-25  
**Task:** 1.1 Optimize Chakra UI Configuration  
**Status:** ❌ **BLOCKED** - TypeScript type incompatibilities in Chakra UI v3.31.0  
**Expected Savings:** 80-120KB gzipped (if this could be implemented)

---

## Problem Statement

Task 1.1 from the bundle optimization plan aims to reduce bundle size by replacing `defaultConfig` with `defaultBaseConfig` and importing only needed component recipes. This approach is recommended in the Chakra UI documentation but fails in practice due to TypeScript compilation errors.

---

## Investigation Summary

### Attempt 1: Full Recipe Import (Original Attempt - Reverted)

**Approach:** Import all 73 available recipes (18 simple + 55 slot recipes)

**Result:** 424 TypeScript errors across 55 files

**Root Cause:**
- Chakra UI's `SlotRecipeDefinition` types are incompatible with `SlotRecipeConfig` 
- `RecipeDefinition` types are incompatible with `RecipeDefinition<RecipeVariantRecord>`
- TypeScript strict mode catches these type mismatches

**Example Errors:**
```typescript
// src/theme.ts:87:7 - error TS2322
Type 'SlotRecipeDefinition<"body" | "indicator" | "label" | "root" | "thumb"...>' 
is not assignable to type 'SlotRecipeConfig'

// src/theme.ts:88:7 - error TS2322  
Type 'SlotRecipeDefinition<"body" | "caption" | "cell" | "columnHeader"...>'
is not assignable to type 'SlotRecipeConfig'
```

### Attempt 2: Reduced Recipe Set with `strictTokens: false`

**Approach:** Import only 10 simple recipes and 10 slot recipes with compatible types, disable strict tokens

**Result:** Still 16+ TypeScript errors in theme.ts itself

**Root Cause:** The type incompatibility exists regardless of which recipes are imported or token strictness

### Attempt 3: Minimal Recipe Set

**Approach:** Import only the most basic recipes (badge, button, code, container, etc.)

**Result:** Same fundamental type errors - the recipe definitions from `@chakra-ui/react/theme` are not compatible with the type signatures expected by `createSystem`

---

## Root Cause Analysis

### TypeScript Type System Conflict

The issue stems from a mismatch between:

1. **Exported Recipe Types** (`@chakra-ui/react/theme`):
   - `RecipeDefinition<{variant: {...}, size: {...}}>`
   - `SlotRecipeDefinition<SlotNames, {variant: {...}, size: {...}}>`

2. **Expected Types** in `createSystem()`:
   - `RecipeDefinition<RecipeVariantRecord>`
   - `SlotRecipeConfig`

The variant structures in the exported recipes have specific literal types (e.g., `"1px"`, `"full"`, `"medium"`) that don't match the generic constraint types expected by the system.

### Why This Wasn't Caught by Chakra UI

- The Chakra UI documentation shows this pattern working
- Likely works in non-strict TypeScript mode
- May work in JavaScript projects without type checking
- Could be a version-specific issue (v3.31.0 may have introduced stricter types)

### Verification

**Current Chakra UI version:** 3.31.0 (latest as of 2026-01-25)

```bash
# Confirmed: No newer version available
$ npm view @chakra-ui/react version
3.31.0
```

---

## Alternative Approaches Evaluated

### Option 1: Disable TypeScript Strict Mode ❌ Not Acceptable

**Pros:**
- Might allow the optimization to compile
- Quick fix

**Cons:**
- Violates project's strict TypeScript policy
- Loses type safety benefits
- Could introduce runtime errors
- Not a real solution

**Decision:** Rejected

---

### Option 2: Wait for Chakra UI v4 or Type Fix ⏳ Future

**Pros:**
- Proper upstream fix
- Official support

**Cons:**
- Unknown timeline (could be months)
- May not be prioritized by Chakra UI team
- Project needs optimization now

**Decision:** Monitor but don't block on this

---

### Option 3: Use Type Assertions (`as any`) ❌ Not Recommended

**Pros:**
- Would allow compilation
- Could achieve bundle reduction

**Cons:**
- Defeats the purpose of TypeScript
- High risk of runtime errors
- Code smell
- Maintenance burden

**Decision:** Rejected

---

### Option 4: Manual Tree-Shaking via Build Config ✅ **RECOMMENDED**

**Approach:** Use Vite/Rollup configuration to manually exclude unused Chakra UI code

**Implementation:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep Chakra core separate
          if (id.includes('@chakra-ui/react')) {
            // Split by feature
            if (id.includes('accordion')) return 'chakra-accordion'
            if (id.includes('alert')) return 'chakra-alert'
            // ... other components
            return 'chakra-core'
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@chakra-ui/react',
      // List only the Chakra components actually used
    ]
  }
})
```

**Expected Savings:** 30-50KB gzipped (partial optimization)

**Pros:**
- No TypeScript issues
- Works with current code
- Achieves some bundle reduction
- Maintainable

**Cons:**
- Less savings than full optimization (30-50KB vs 80-120KB)
- Requires manual maintenance
- More complex build configuration

**Decision:** Implement this as Phase 1.1a

---

### Option 5: Switch to Chakra UI Alternatives 🔍 Consider

**Options:**
- **Mantine** - Modern, TypeScript-first
- **Radix UI** - Unstyled, full control
- **shadcn/ui** - Tailwind-based components
- **Material-UI (MUI)** - Mature, widely used

**Pros:**
- Fresh start with better tree-shaking
- Potentially smaller bundle
- Modern architecture

**Cons:**
- **MASSIVE** migration effort (weeks/months)
- Breaking changes across entire codebase
- Re-training for team
- Risk of new issues
- Not justified for bundle size alone

**Decision:** Not recommended for this optimization effort

---

### Option 6: Custom Chakra Build ⚙️ Advanced

**Approach:** Fork Chakra UI and fix type definitions ourselves

**Pros:**
- Full control
- Could achieve target savings
- Contributes back to OSS

**Cons:**
- Very high effort (40-80 hours)
- Maintenance burden
- Need deep Chakra UI knowledge
- May conflict with future updates

**Decision:** Too risky and time-consuming

---

## Recommended Path Forward

### Immediate Actions (Phase 1.1a)

1. **Implement Manual Tree-Shaking** via Vite config
   - Expected savings: 30-50KB gzipped
   - Effort: 4-6 hours
   - Risk: Low

2. **Audit and Remove Unused Components**
   - Delete unused UI components from `/src/components/ui/`
   - Remove unused Chakra imports
   - Expected savings: 10-20KB gzipped
   - Effort: 2-3 hours
   - Risk: Very Low

**Combined Expected Savings:** 40-70KB gzipped (50-60% of original target)

### Medium-Term (Q2 2026)

1. **Monitor Chakra UI Updates**
   - Watch for v3.32+ releases
   - Test if type issues are resolved
   - Retry optimization if fixed

2. **Alternative Evaluation**
   - If Chakra UI remains blocked, evaluate switching UI library
   - Detailed cost-benefit analysis
   - Phased migration plan

### Long-Term

- Consider contributing type fixes to Chakra UI
- Share findings with Chakra UI community
- Document learnings for future projects

---

## Impact Assessment

### Current Bundle State (After Phases 2-3)

- **Total Bundle:** 395 KB gzipped (modern browsers)
- **Chakra UI Chunk:** 175 KB gzipped (44% of total)
- **Target:** 250 KB gzipped
- **Gap:** 145 KB reduction needed

### With Manual Tree-Shaking (Phase 1.1a)

- **Expected Reduction:** 40-70 KB gzipped
- **New Total:** 325-355 KB gzipped
- **% of Target Achieved:** 73-86%
- **Remaining Gap:** 75-105 KB

### If Full Optimization Were Possible

- **Expected Reduction:** 80-120 KB gzipped
- **New Total:** 275-315 KB gzipped
- **% of Target Achieved:** 85-100%

**Conclusion:** Even with this blocker, we can achieve 73-86% of target through alternative approaches.

---

## Lessons Learned

### For Future Projects

1. **Evaluate UI Library Tree-Shaking** during selection
   - Test with actual build before committing
   - Verify TypeScript compatibility
   - Check bundle size with realistic usage

2. **Prefer Libraries with Proven Tree-Shaking**
   - Radix UI (unstyled primitives)
   - Headless UI (Tailwind Labs)
   - Mantine (explicit tree-shaking support)

3. **Bundle Size as Selection Criteria**
   - Make it a top-3 factor
   - Test optimization approaches early
   - Document bundle size in ADRs

4. **TypeScript Strict Mode Implications**
   - Some optimizations may be incompatible
   - Trade-off between type safety and bundle size
   - Evaluate case-by-case

---

## Documentation for Stakeholders

### Why Can't We Complete Task 1.1?

Chakra UI v3.31.0 has TypeScript type definitions that are incompatible with the tree-shaking optimization approach recommended in their documentation. Specifically:

1. The recipe type definitions exported by Chakra UI don't match the type signatures expected when building a custom theme
2. This causes 400+ TypeScript compilation errors
3. The only workarounds involve disabling TypeScript safety (unacceptable) or using type assertions (risky)

### What's the Alternative?

We can achieve 50-60% of the target savings (40-70 KB instead of 80-120 KB) using:
- Manual tree-shaking via build configuration
- Removing unused components
- Optimizing Chakra imports

This is a safer approach with lower risk.

### When Can We Revisit This?

- Monitor Chakra UI releases for type fixes (Q2 2026)
- Consider UI library migration if Chakra remains blocked (Q3 2026)
- Contribute type fixes to Chakra UI OSS (optional)

---

## References

- **Chakra UI Optimization Guide:** https://next.chakra-ui.com/guides/component-bundle-optimization
- **Original Implementation Plan:** `IMPLEMENTATION_PLAN.md` §1.1
- **Previous Attempt:** Commit ce60840 (reverted in merge 7838414)
- **TypeScript Error Log:** 424 errors across 55 files (see build output)
- **Chakra UI GitHub Issues:** Search for "defaultBaseConfig TypeScript" (none found as of 2026-01-25)

---

**Status:** ❌ **BLOCKED** - Type incompatibility in Chakra UI v3.31.0  
**Recommendation:** Implement Option 4 (Manual Tree-Shaking) as alternative  
**Next Action:** Create Phase 1.1a task for manual optimization approach  
**Expected Timeline:** 1 week for alternative implementation
