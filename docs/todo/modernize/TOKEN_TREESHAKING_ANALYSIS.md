# Chakra UI Token Tree-Shaking Analysis

**Date:** 2026-01-25  
**Conclusion:** ❌ **NOT WORTH** - No bundle size reduction achieved

---

## Investigation

Attempted to create a "reduced theme" by selectively importing token categories from Chakra UI to enable better tree-shaking.

### Approach Tested

```typescript
// Import aggregated tokens
import { tokens as chakraTokens } from "@chakra-ui/react/theme"

// Destructure only needed categories
const {
  borders,
  colors,
  cursor,
  fonts,
  // ... other needed tokens
} = chakraTokens

// Use in theme config
tokens: {
  borders,
  colors,
  // ...
}
```

### Hypothesis

By only using specific token categories, the bundler would tree-shake unused categories (like `aspectRatios`, `animations`, `blurs`) from the bundle.

### Result

**Bundle size:** 642.34 kB (175.45 KB gzipped)  
**vs Previous:** 642.34 kB (175.45 KB gzipped)  
**Reduction:** 0 KB ❌

### Why It Didn't Work

**JavaScript bundlers cannot tree-shake object properties.** When you import an entire object and then destructure it:

```typescript
import { tokens } from "@chakra-ui/react/theme"
const { borders, colors } = tokens
```

The bundler must include the **entire `tokens` object** because:
1. The import statement pulls in the whole object
2. Destructuring happens at runtime, not build time
3. The bundler can't determine which properties are actually used

### What Would Work (But Isn't Available)

For true tree-shaking, Chakra UI would need to export individual token categories:

```typescript
// This would enable tree-shaking (but these exports don't exist)
import { borders, colors } from "@chakra-ui/react/theme/tokens"
```

However, `@chakra-ui/react/theme` only exports:
- `tokens` (aggregated object)
- `semanticTokens` (aggregated object)
- Individual recipes
- `breakpoints`, `keyframes`, `textStyles`, etc.

Individual token categories (borders, colors, fonts, etc.) are **not separately exported**.

### Alternative Approaches Considered

#### 1. Manual Token Definitions

Define all tokens manually instead of importing:

**Pros:**
- Full control over what's included
- True tree-shaking possible

**Cons:**
- Massive maintenance burden (hundreds of token definitions)
- Loses sync with Chakra UI updates
- Error-prone
- **Not worth the effort** for marginal gains

#### 2. Patch Chakra UI Package

Modify `@chakra-ui/react/theme` to export individual token categories.

**Cons:**
- Requires maintaining a fork
- Breaks on package updates
- Complex setup for team
- **Not practical**

#### 3. Accept Current Bundle Size

Keep importing full `tokens` and `semanticTokens`.

**Pros:**
- Clean, maintainable code
- Easy to update Chakra UI
- Full token system available
- `strictTokens: true` prevents arbitrary values

**Cons:**
- No bundle size reduction from selective imports

**Decision:** ✅ **This is the pragmatic choice**

---

## Findings Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Bundle reduction from selective tokens | Expected: ~10-20 KB | Actual: 0 KB | ❌ |
| Code complexity | Lower | Same/Higher | ❌ |
| Maintainability | Better | Same/Worse | ❌ |

---

## Recommendation

**DO NOT** pursue selective token imports. The approach provides:
- ❌ Zero bundle size benefit
- ❌ Increased code complexity
- ❌ More maintenance burden
- ❌ False sense of optimization

**INSTEAD:**
1. ✅ Import full `tokens` and `semanticTokens` from Chakra UI
2. ✅ Use `strictTokens: true` to prevent arbitrary values
3. ✅ Import `conditions` from `defaultConfig`
4. ✅ Focus optimization efforts elsewhere (already achieved 27 KB reduction from recipes)

---

## Alternative Optimization Opportunities

If further bundle reduction is needed, consider:

1. **Remove Unused Recipes** (already done - 39/73 = 47% reduction)
2. **Lazy Load Heavy Components** (dialogs, modals, complex forms)
3. **Code Splitting by Route** (already done via React Router)
4. **Optimize Dependencies** (date-fns, lodash, etc.)
5. **Image Optimization** (already done)

**Current achievement:** ~27 KB gzipped reduction from Chakra optimization (15.9%)

---

## Conclusion

The "reduced theme" approach is **not worth pursuing**. The current implementation with full token imports is optimal given JavaScript bundler limitations.

**Status:** Analysis complete, reverting to clean full-import approach  
**Recommendation:** Close this optimization path, mark as "investigated - not viable"
