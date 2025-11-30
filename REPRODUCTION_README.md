# Reproduction for @reduxjs/toolkit "Illegal invocation" Issue

## Issue Summary

When dispatching `resetApiState()` actions in a loop, an "Illegal invocation" error occurs when calling `AbortController.abort()` **in browser environments**. This issue was introduced in `@reduxjs/toolkit` version 2.9.2 and persists in 2.10.1.

## ⚠️ Important Note About Reproductions

**The Node.js script (`reproduction.js`) demonstrates the CODE PATTERN but does NOT reproduce the actual error** because Node.js's `AbortController` implementation is more lenient than browser implementations.

**To see the ACTUAL error, you must run in a browser environment:**
1. Run the Cypress tests: `npm run test`
2. Run the standalone Cypress reproduction: `npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts`
3. Open `test-reproduction.html` in a web browser (Chrome, Firefox, etc.)

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

### Method 1: Run Existing Cypress Tests (ACTUAL ERROR)

```bash
npm run test
```

The error will occur in the `configTable.e2e.ts` test during the `afterEach` hook when `window.rtkq.resetCache()` is called.

### Method 2: Run Standalone Cypress Reproduction (ACTUAL ERROR)

```bash
npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts
```

This is a minimal test that demonstrates the exact issue.

### Method 3: Browser HTML Test (ACTUAL ERROR - if issue is present)

Open `test-reproduction.html` in a web browser (Chrome, Firefox, Safari, Edge). The page will show either:
- ✅ Green success message (if issue is fixed)
- ❌ Red error message with "Illegal invocation" (if issue is present)

### Method 4: Node.js Pattern Demo (NO ERROR - for reference only)

```bash
node reproduction.js
```

**Note**: This script will NOT show the error. It only demonstrates the code pattern. The error only occurs in browser environments.

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
