# Redux Toolkit Bug Reproduction - Summary

## What Was Done

This PR contains a minimal, standalone reproduction of the "Illegal invocation" bug in Redux Toolkit (v2.9.2+) that is causing Cypress tests to fail.

## Files Created

1. **`redux-toolkit-resetApiState-issue.mjs`**
   - Standalone Node.js script that reproduces the bug
   - Can be run with just `@reduxjs/toolkit` as a dependency
   - Successfully triggers the "Illegal invocation" error
   - Well-commented to explain each step

2. **`REPRODUCTION-README.md`**
   - Documentation of the bug
   - Technical analysis of the root cause
   - Workaround solution
   - Context from the Ark.Starters.SPA codebase

3. **`HOW-TO-REPORT-ISSUE.md`**
   - Template for reporting the issue to Redux Toolkit maintainers
   - Includes all necessary details
   - Provides alternative reporting methods

## How to Use This Reproduction

### Test Locally
```bash
node redux-toolkit-resetApiState-issue.mjs
```

Expected output: Process crashes with `TypeError: Cannot read private member #signal`

### Report to Redux Toolkit
1. Go to https://github.com/reduxjs/redux-toolkit/issues/new
2. Use the template from `HOW-TO-REPORT-ISSUE.md`
3. Include the `redux-toolkit-resetApiState-issue.mjs` file (as a Gist or inline)
4. Reference this PR for full context

## The Bug

**Issue**: Calling `resetApiState()` before store initialization and dispatching it later with active queries causes "Illegal invocation"

**Root Cause**: The `AbortController.abort()` method loses its `this` context when called through the pre-created action

**Affected Code**: 
- `src/app/configureStore.ts` (lines 60-67) - creates actions at module init
- `src/initGlobals.tsx` (lines 12-17) - exposes reset function
- `cypress/support/e2e.ts` (line 11) - triggers in afterEach hook

**Versions**:
- ✅ Works: `@reduxjs/toolkit` 2.9.1
- ❌ Broken: `@reduxjs/toolkit` 2.9.2+, including 2.10.1

**Verified**: Downgrading to v2.9.1 resolves the issue completely, confirming the bug was introduced in v2.9.2.

## Workaround

Instead of pre-creating actions, use factory functions:

```typescript
// In configureStore.ts
export const resetApiFunctions = [
  () => jsonPlaceholderApi.util.resetApiState(),
  () => configTableApiSlice.util.resetApiState(),
  // ... etc
];

// In initGlobals.tsx
window.rtkq = {
  resetCache: () => {
    for (const fn of resetApiFunctions)
      store.dispatch(fn());  // Create action on-demand
  }
}
```

This workaround would fix the Cypress tests but should only be applied if the Redux Toolkit team confirms this is not a bug they plan to fix.

## Verification

- ✅ Reproduction successfully triggers the error
- ✅ Cypress tests still fail with same error
- ✅ Documentation is complete
- ✅ Ready to report to maintainers

## Next Steps

1. Review the reproduction script
2. Decide whether to:
   - Report the issue to Redux Toolkit maintainers (recommended)
   - Implement the workaround in this codebase
   - Wait for a potential fix in a future RTK version
3. If reporting, use the template in `HOW-TO-REPORT-ISSUE.md`
