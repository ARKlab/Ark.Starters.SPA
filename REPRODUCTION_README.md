# Reproduction for @reduxjs/toolkit "Illegal invocation" Issue

## Issue Summary

When dispatching `resetApiState()` actions in a loop, an "Illegal invocation" error occurs when calling `AbortController.abort()`. This issue was introduced in `@reduxjs/toolkit` version 2.9.2 and persists in 2.10.1.

## Error Details

```
TypeError: Failed to execute 'abort' on 'AbortController': Illegal invocation
  at Promise.S [as abort] (rtk.js:1:26029)
  at P (rtk.js:1:57456)
  at g (rtk.js:1:57760)
  at resetApiState handler
```

## Affected Versions

- **Working**: `@reduxjs/toolkit@2.9.1`
- **Broken**: `@reduxjs/toolkit@2.9.2` and later (confirmed in 2.10.1)

## Reproduction Steps

### Quick Test (Node.js - may not show the error)

```bash
node reproduction.js
```

**Note**: The error may only manifest in browser environments where `AbortController` is stricter about `this` binding.

### Full Test (Cypress - shows the actual error)

```bash
npm run test
```

The error will occur in the `configTable.e2e.ts` test during the `afterEach` hook.

## Code Pattern That Triggers the Issue

### 1. Create API slices with retry wrapper

```javascript
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

const customBaseQuery = (baseUrl) => {
  const baseQuery = fetchBaseQuery({ baseUrl });
  const retryFn = retry(baseQuery, { maxRetries: 2 });
  return (args, api, extraOptions) => 
    retryFn(args, api, extraOptions ?? {});
};

const api1 = createApi({
  reducerPath: 'api1',
  baseQuery: customBaseQuery('https://example.com/'),
  endpoints: (builder) => ({ /* ... */ }),
});
```

### 2. Create array of resetApiState actions at module level

```javascript
// This is done BEFORE store is configured
const resetApiActions = [
  api1.util.resetApiState(),
  api2.util.resetApiState(),
  api3.util.resetApiState(),
];
```

### 3. Dispatch actions in a loop

```javascript
// In Cypress afterEach hook or similar cleanup
for (const action of resetApiActions) {
  store.dispatch(action);  // ❌ Throws "Illegal invocation"
}
```

## Application Context

This pattern is used in our React SPA for test cleanup:

- **src/lib/rtk/arkBaseQuery.ts**: Custom retry wrapper `arkRetry()`
- **src/app/configureStore.ts**: `resetApiActions` array (lines 60-67)
- **src/initGlobals.tsx**: `window.rtkq.resetCache()` function (lines 12-17)
- **cypress/support/e2e.ts**: `afterEach` hook calls `resetCache()` (lines 10-11)

## Expected Behavior

Dispatching `resetApiState()` actions should cleanly reset the RTK Query cache without errors.

## Actual Behavior

The `abort()` method on `AbortController` throws "Illegal invocation" because it loses its `this` context when called from within the reset handler.

## Possible Causes

1. Change in how `AbortController` is used within retry logic between 2.9.1 and 2.9.2
2. The `abort` method being stored/called without proper `this` binding
3. Changes to how `resetApiState()` handles cleanup of pending queries

## Workaround

Until this is fixed, potential workarounds include:

1. **Don't use retry wrapper**: Remove retry from baseQuery (not ideal)
2. **Dispatch individually**: Don't store actions in an array
   ```javascript
   store.dispatch(api1.util.resetApiState());
   store.dispatch(api2.util.resetApiState());
   ```
3. **Downgrade**: Use `@reduxjs/toolkit@2.9.1`

## Environment

- **@reduxjs/toolkit**: 2.10.1
- **Node.js**: 24.11.1
- **Browser**: Electron 138 (Cypress), Chrome, Firefox
- **OS**: Ubuntu (GitHub Actions runner)

## Files Included

- `reproduction.js` - Minimal standalone reproduction
- `REPRODUCTION_README.md` - This file with context and details

## Additional Notes

The issue is likely related to how JavaScript methods are bound to their context. When `AbortController.abort` is stored or passed around without proper binding, calling it results in "Illegal invocation" because the method expects to be called with the `AbortController` instance as `this`.

This is a known JavaScript gotcha:
```javascript
const controller = new AbortController();
const abort = controller.abort;  // Lost 'this' binding
abort();  // ❌ TypeError: Illegal invocation

const boundAbort = controller.abort.bind(controller);
boundAbort();  // ✅ Works
```
