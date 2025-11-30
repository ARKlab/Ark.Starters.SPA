# Redux Toolkit resetApiState() Bug Reproduction

## Summary

This repository contains a minimal reproduction of a bug in `@reduxjs/toolkit` versions 2.9.2+ where calling `resetApiState()` causes an "Illegal invocation" error.

## Bug Description

**Error**: `TypeError: Illegal invocation` (in browsers) or `TypeError: Cannot read private member #signal` (in Node.js)

**Occurs When**:
1. A `resetApiState()` action is created **before** the Redux store is initialized
2. The action is dispatched later when there are **active queries**
3. Using **custom baseQuery wrappers** (e.g., retry middleware)

**Introduced In**: `@reduxjs/toolkit` version 2.9.2 (upgrade from 2.9.1 to 2.10.1 exposed this issue)

## Files

- **`redux-toolkit-resetApiState-issue.mjs`** - Standalone reproduction script
- **`REPRODUCTION-README.md`** - This documentation file

## How to Reproduce

### Prerequisites

```bash
npm install @reduxjs/toolkit
```

### Run the Reproduction

```bash
node redux-toolkit-resetApiState-issue.mjs
```

### Expected vs Actual Behavior

**Expected**: Script completes without errors

**Actual**: Process crashes with:
```
TypeError: Cannot read private member #signal from an object whose class did not declare it
    at AbortSignal.abort (node:internal/abort_controller:507:21)
    ...
    at Promise.abort (.../redux-toolkit.modern.mjs:893:27)
    at abortAllPromises (.../rtk-query.modern.mjs:2188:23)
```

## Context in Ark.Starters.SPA

This bug manifests in the Cypress test suite:

1. **Setup Phase** (`src/app/configureStore.ts`, lines 60-67):
   ```typescript
   export const resetApiActions = [
     jsonPlaceholderApi.util.resetApiState(),  // Created at module init
     configTableApiSlice.util.resetApiState(),
     // ... more APIs
   ];
   ```

2. **Usage Phase** (`src/initGlobals.tsx`, lines 12-17):
   ```typescript
   window.rtkq = {
     resetCache: () => {
       for (const x of resetApiActions)
         store.dispatch(x);  // Dispatched later
     }
   }
   ```

3. **Trigger Point** (`cypress/support/e2e.ts`, line 11):
   ```typescript
   afterEach(() => {
     cy.window().then(win => {
       if (win.rtkq) win.rtkq.resetCache();  // Called after each test
     });
   });
   ```

## Technical Analysis

The issue stems from how `resetApiState()` handles AbortController cleanup:

1. When `resetApiState()` is called before store creation, it creates an action with closure references
2. Later, when dispatched, it tries to abort active queries via `AbortController.abort()`
3. The `abort` method loses its `this` context, causing "Illegal invocation"
4. This happens specifically in `abortAllPromises()` within RTK Query middleware

The error manifests in the event loop and cannot be caught with try/catch or promise rejection handlers.

## Workaround

Instead of pre-creating `resetApiState()` actions, create them at dispatch time:

**Before (broken)**:
```typescript
export const resetApiActions = [
  api.util.resetApiState()  // Pre-created
];

// Later...
for (const action of resetApiActions) {
  store.dispatch(action);
}
```

**After (works)**:
```typescript
export const resetApiFunctions = [
  () => api.util.resetApiState()  // Factory function
];

// Later...
for (const fn of resetApiFunctions) {
  store.dispatch(fn());  // Create fresh action
}
```

## Package Versions

- `@reduxjs/toolkit`: 2.10.1 (issue present)
- `@reduxjs/toolkit`: 2.9.1 (issue NOT present)
- Node.js: 24.x

## Related Issues

This reproduction was created to report the issue to the Redux Toolkit maintainers.

## License

Same as Ark.Starters.SPA (see LICENSE file)
