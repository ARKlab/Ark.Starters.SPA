# How to Report This Issue to Redux Toolkit

## Issue Title

`resetApiState()` causes "Illegal invocation" when dispatched with active queries (v2.9.2+)

## Summary

When `resetApiState()` is called before store creation and dispatched later while queries are active, it causes a `TypeError: Illegal invocation` error. This was working in v2.9.1 but broke in v2.9.2+.

## Bug Report Template

Use this template when creating an issue on https://github.com/reduxjs/redux-toolkit/issues:

---

### Description

Calling `resetApiState()` before store initialization and dispatching it later causes an "Illegal invocation" error when active queries exist. This worked in v2.9.1 but fails in v2.9.2+.

### Reproduction

I've created a minimal reproduction script that demonstrates the issue:

**File**: `redux-toolkit-resetApiState-issue.mjs`
```javascript
[Paste the content of redux-toolkit-resetApiState-issue.mjs here]
```

**How to run**:
```bash
npm install @reduxjs/toolkit
node redux-toolkit-resetApiState-issue.mjs
```

**Expected**: Script completes without errors
**Actual**: Process crashes with `TypeError: Cannot read private member #signal`

### Error Details

**In Node.js**:
```
TypeError: Cannot read private member #signal from an object whose class did not declare it
    at AbortSignal.abort (node:internal/abort_controller:507:21)
    at Promise.abort (.../redux-toolkit.modern.mjs:893:27)
    at abortAllPromises (.../rtk-query.modern.mjs:2188:23)
```

**In Browser**: 
```
TypeError: Illegal invocation
```

### Root Cause

The error occurs in the `abortAllPromises()` function when RTK Query tries to abort active queries. The `AbortController.abort()` method loses its `this` context, causing an illegal invocation.

### Use Case

This pattern is common when:
1. Setting up API slices at module initialization
2. Creating a cache reset utility that dispatches all `resetApiState()` actions
3. Using this in test cleanup hooks (e.g., Cypress `afterEach`)

**Example from production code**:
```typescript
// configureStore.ts - module initialization
export const resetApiActions = [
  api1.util.resetApiState(),
  api2.util.resetApiState(),
];

// Later in test cleanup
resetApiActions.forEach(action => store.dispatch(action));
```

### Workaround

Instead of pre-creating actions, use factory functions:

```typescript
// Before (broken)
export const resetApiActions = [
  api.util.resetApiState()
];

// After (works)
export const resetApiFunctions = [
  () => api.util.resetApiState()
];

// Dispatch
resetApiFunctions.forEach(fn => store.dispatch(fn()));
```

### Environment

- **@reduxjs/toolkit**: 2.10.1 (broken) ❌, 2.9.2+ (broken) ❌, 2.9.1 (works) ✅
- **Node.js**: 24.11.1
- **Browser**: Chrome 131, Firefox 132

**Verified**: Downgrading to v2.9.1 resolves the issue, confirming the regression was introduced in v2.9.2.

### Additional Context

This issue specifically occurs when:
1. Using custom `baseQuery` wrappers (e.g., retry middleware)
2. Active queries are in progress when `resetApiState` is dispatched
3. The `resetApiState` action was created before the store

See the full context in the reproduction repository: [Link to your PR or gist]

---

## Files to Include

When opening the issue, consider:

1. **Creating a Gist** with `redux-toolkit-resetApiState-issue.mjs`
2. **Linking to this PR** for complete context
3. **Including** the workaround section to help other users

## Next Steps

1. Open an issue at: https://github.com/reduxjs/redux-toolkit/issues/new
2. Use the template above
3. Include a link to the reproduction file
4. Monitor the issue for maintainer responses

## Alternative: CodeSandbox

If requested, you can create a browser-based reproduction using CodeSandbox:
- Use React + Redux Toolkit template
- Replicate the pattern in a browser environment
- Show the "Illegal invocation" error in browser console
