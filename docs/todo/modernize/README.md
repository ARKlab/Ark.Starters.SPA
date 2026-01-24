# Bundle Size & Performance Modernization

**Created:** 2026-01-15  
**Status:** Analysis Complete - Ready for Implementation  
**Priority:** High  
**Tracking:** See [IMPLEMENTATION_TRACKING.md](./IMPLEMENTATION_TRACKING.md) for detailed task tracking

---

## 📋 Overview

This directory contains a comprehensive analysis and implementation plan for reducing the bundle size and improving the performance of the ARK Starters SPA project.

---

## 📊 Key Findings

### Current State

- **Total Bundle Size:** ~513KB gzipped (1.66MB uncompressed)
- **Largest Chunks:**
  - Chakra UI: 628KB (175KB gzipped) - 38% of total
  - Application Globals: 576KB (189KB gzipped) - 35% of total
- **Time to Interactive:** ~7-8 seconds on 3G
- **Main Issues:** Inefficient library imports, eager loading, lack of optimization hints

### Target State

- **Target Bundle Size:** ~250-300KB gzipped (50% reduction)
- **Target TTI:** ~3-4 seconds on 3G (60% improvement)
- **Implementation Time:** 2-3 sprints
- **Risk Level:** Low to Medium

---

## 📁 Documents

### 1. [IMPLEMENTATION_TRACKING.md](./IMPLEMENTATION_TRACKING.md) ⭐ NEW

**Real-time implementation progress tracker:**

- Task-by-task checklist with status
- Verifiable success criteria for each task
- Actual vs expected results tracking
- Time tracking and blocker documentation
- Overall progress dashboard

**Use this** to track implementation progress and record results.

### 2. [BUNDLE_ANALYSIS.md](./BUNDLE_ANALYSIS.md)

**Comprehensive bundle analysis including:**

- Detailed breakdown of all bundle components
- Identification of size culprits (Chakra UI, Redux, Auth, App Insights)
- Tree-shaking assessment (what works, what doesn't)
- Comparison with industry standards
- Technical debt identification
- Performance impact analysis

**Read this first** to understand the current state and issues.

### 3. [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)

**Step-by-step implementation guide with:**

- 4 phases of optimization (Quick Wins → Core → Advanced → Future)
- Detailed code examples for each optimization
- Expected savings for each change
- Risk assessment and mitigation strategies
- Success metrics and testing approach
- Timeline and effort estimates

**Use this** as the implementation roadmap.

---

## 🎯 Quick Start - Top 5 Optimizations

If you only have time for the highest-impact changes:

### 1. Optimize Chakra UI Config (P0)

**Impact:** 80-120KB savings  
**Effort:** 2-4 hours  
**Risk:** Low

Switch from `defaultConfig` to `defaultBaseConfig` and import only needed component recipes.

**How to add more components:**

```typescript
// src/theme.ts - Add import at top
import {
  buttonRecipe,
  inputRecipe,
  // Add new recipe imports here as you use components:
  selectRecipe,
  modalRecipe,
  // etc.
} from "@chakra-ui/react/theme"

const theme = createSystem(defaultBaseConfig, {
  theme: {
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      // Add corresponding recipe here:
      select: selectRecipe,
      modal: modalRecipe,
      // etc.
    },
  },
  // your customizations
})
```

**Recipe naming pattern:** Component name + "Recipe" (e.g., `Button` → `buttonRecipe`, `Select` → `selectRecipe`)

→ See [Implementation Plan §1.1](./IMPLEMENTATION_PLAN.md#11-optimize-chakra-ui-configuration)

### 2. Dynamic Auth Provider Loading (P1)

**Impact:** 60-80KB savings  
**Effort:** 4-6 hours  
**Risk:** Low

Load only the authentication provider that's actually used (Auth0 OR MSAL, not both).

→ See [Implementation Plan §2.1](./IMPLEMENTATION_PLAN.md#21-dynamic-authentication-provider-loading)

### 3. Conditional App Insights (P1)

**Impact:** 80-120KB savings  
**Effort:** 3-4 hours  
**Risk:** Low-Medium

Lazy load Application Insights only when configured.

→ See [Implementation Plan §2.3](./IMPLEMENTATION_PLAN.md#23-conditional-application-insights-loading)

### 4. Add sideEffects Declaration (P0)

**Impact:** 20-40KB savings  
**Effort:** 15 minutes  
**Risk:** Very Low

Add `"sideEffects": false` to package.json to improve tree-shaking.

→ See [Implementation Plan §1.2](./IMPLEMENTATION_PLAN.md#12-add-sideeffects-declaration)

### 5. Lazy Load Redux Slices (P1)

**Impact:** 40-60KB savings  
**Effort:** 6-8 hours  
**Risk:** Medium

Move Redux API slices from eager to lazy loading.

→ See [Implementation Plan §2.2](./IMPLEMENTATION_PLAN.md#22-lazy-load-redux-api-slices)

**Total Expected Savings from Top 5:** ~280-420KB gzipped (55-82% of target)

---

## 📈 Expected Results

### Bundle Size Reduction

| Phase   | Changes                        | Savings (gzipped) | Cumulative | % of Target |
| ------- | ------------------------------ | ----------------- | ---------- | ----------- |
| Phase 1 | Chakra + sideEffects + cleanup | 150-200KB         | 150-200KB  | 60-80%      |
| Phase 2 | Dynamic imports + optimization | 200-300KB         | 350-500KB  | 100%+       |
| Phase 3 | Advanced optimizations         | 100-150KB         | 450-650KB  | 150%+       |

### Performance Improvement

| Metric           | Before | After P1 | After P2 | Improvement |
| ---------------- | ------ | -------- | -------- | ----------- |
| Bundle (gzipped) | 513KB  | 350KB    | 250KB    | 51%         |
| TTI (3G)         | 7-8s   | 5s       | 3-4s     | 50-57%      |
| Parse Time       | 800ms  | 500ms    | 300ms    | 62%         |
| FCP              | 2-3s   | 1.5s     | 1s       | 50-67%      |

---

## 🚀 Implementation Approach

### Recommended Path

**Week 1: Quick Wins (Phase 1)**

- Day 1-2: Chakra UI optimization
- Day 2-3: Add sideEffects, remove manual memoization
- Day 3-4: Test and validate
- Day 5: Deploy and monitor

**Week 2: Core Optimizations Part 1 (Phase 2)**

- Day 1-2: Dynamic auth provider loading
- Day 3-4: Conditional App Insights loading
- Day 5: Test and validate

**Week 3: Core Optimizations Part 2 (Phase 2)**

- Day 1-2: Lazy load Redux slices
- Day 3: Optimize react-icons
- Day 4-5: Test, validate, deploy

**Week 4+: Advanced (Phase 3) - As needed**

- Evaluate based on results from Phases 1-2
- Implement remaining optimizations if targets not met

### Feature Flags

For risky changes, use feature flags:

```typescript
// Example: Gradual rollout of optimizations
const useOptimizedChakra = import.meta.env.VITE_OPTIMIZED_CHAKRA === "true"
```

---

## ✅ Success Criteria

### Must Have (Phase 1-2)

- [ ] Bundle size < 350KB gzipped (32% reduction)
- [ ] TTI < 5 seconds on 3G (37% improvement)
- [ ] All E2E tests passing
- [ ] No production errors related to changes
- [ ] Lighthouse score improvement > 10 points

### Nice to Have (Phase 3)

- [ ] Bundle size < 250KB gzipped (51% reduction)
- [ ] TTI < 3 seconds on 3G (62% improvement)
- [ ] Perfect Lighthouse score (100)

### Continuous Monitoring

- [ ] Bundle size tracked in CI/CD
- [ ] Performance budgets enforced
- [ ] Lighthouse CI integrated
- [ ] Bundle analyzer run on every PR

---

## 🔍 Verification

After each phase, verify improvements:

```bash
# 1. Run bundle analyzer
npm run analyze

# 2. Check sizes
ls -lh build/assets/*.js | awk '{print $5, $9}' | sort -h

# 3. Compare with baseline
echo "Before: 513KB gzipped"
du -sh build/ | awk '{print "After:", $1}'

# 4. Performance test
lighthouse http://localhost:4321 --view --preset=desktop

# 5. Check gzip sizes
gzip -c build/assets/chakra-*.js | wc -c
gzip -c build/assets/initGlobals-*.js | wc -c
```

---

## ⚠️ Important Notes

### Tree-Shaking Status

**Good News:** Tree-shaking IS working for most dependencies!

- ✓ date-fns: Well tree-shaken (only 4 imports)
- ✓ Most modern ES modules: Working correctly
- ⚠️ Chakra UI: Needs configuration optimization
- ❌ Redux slices: All loaded eagerly
- ❌ Auth providers: Both bundled

The issues are primarily **import patterns** and **lazy loading**, not fundamental tree-shaking failures.

### React Compiler

React Compiler is already enabled and working! The remaining manual memoization (32 instances) can be safely removed as part of Phase 1.

---

## 📚 Additional Resources

### Benchmarks & References

- **Chakra UI Optimization Guide:** https://next.chakra-ui.com/guides/component-bundle-optimization
- **Vite Performance Guide:** https://vite.dev/guide/performance
- **React 19 Best Practices:** https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- **Web.dev Performance:** https://web.dev/performance/

### Tools Used

- **Vite Bundle Analyzer:** rollup-plugin-visualizer (already installed)
- **Lighthouse:** For performance metrics
- **DevTools:** Network and Performance panels

### Similar Optimizations

- **Vercel Next.js:** https://nextjs.org/docs/app/building-your-application/optimizing
- **Material-UI Migration:** https://mui.com/material-ui/guides/minimizing-bundle-size/

---

## 🤝 Getting Help

### For Questions About:

- **Analysis:** See BUNDLE_ANALYSIS.md
- **Implementation:** See IMPLEMENTATION_PLAN.md
- **Chakra UI:** https://chakra-ui.com/docs
- **Vite:** https://vite.dev/guide/
- **React:** https://react.dev/

### Before Starting Implementation:

1. Read both documents completely
2. Review current codebase
3. Set up bundle analyzer
4. Document baseline metrics
5. Discuss plan with team

---

## 📝 Changelog

### 2026-01-15

- Initial analysis completed
- Bundle size breakdown identified
- Implementation plan created
- Priority matrix established
- Target metrics defined

---

**Status:** ✅ Analysis Complete - Ready for Implementation

For detailed analysis, see [BUNDLE_ANALYSIS.md](./BUNDLE_ANALYSIS.md)  
For implementation steps, see [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
