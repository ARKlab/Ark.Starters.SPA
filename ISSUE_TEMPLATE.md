# Issue Report Template for @reduxjs/toolkit

Use this template when opening an issue at https://github.com/reduxjs/redux-toolkit/issues

---

## Bug Report: "Illegal invocation" error when dispatching resetApiState() actions

### Description

When dispatching multiple `resetApiState()` actions in a loop, a `TypeError: Illegal invocation` occurs in browser environments. The error happens when the RTK Query retry logic attempts to call `AbortController.abort()`.

### Versions

- **@reduxjs/toolkit**: 2.10.1 (also tested with 2.9.2+)
- **Last working version**: 2.9.1
- **Browser**: Electron 138 (Cypress), Chrome, Firefox
- **Node.js**: 24.11.1

### Reproduction

I've created a minimal reproduction that demonstrates the pattern causing this issue:

**Files:**
- `reproduction.js` - Standalone Node.js script showing the pattern
- `REPRODUCTION_README.md` - Detailed documentation

**To see the actual error:**
```bash
npm install @reduxjs/toolkit@2.10.1
npm run test  # Runs Cypress tests where the error occurs
```

**Pattern that triggers the error:**

```javascript
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

// 1. Create API with retry wrapper
const customBaseQuery = (baseUrl) => {
  const baseQuery = fetchBaseQuery({ baseUrl });
  const retryFn = retry(baseQuery, { maxRetries: 2 });
  return (args, api, extraOptions) => 
    retryFn(args, api, extraOptions ?? {});
};

const api1 = createApi({
  reducerPath: 'api1',
  baseQuery: customBaseQuery('https://example.com/'),
  endpoints: (builder) => ({
    getData: builder.query({ query: () => 'data' }),
  }),
});

// 2. Create array of resetApiState actions at module level
const resetApiActions = [
  api1.util.resetApiState(),
  api2.util.resetApiState(),
  api3.util.resetApiState(),
];

// 3. Configure store
const store = configureStore({
  reducer: {
    [api1.reducerPath]: api1.reducer,
    // ...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api1.middleware, /* ... */),
});

// 4. Dispatch actions in loop (e.g., in test cleanup)
for (const action of resetApiActions) {
  store.dispatch(action);  // ❌ Throws "Illegal invocation"
}
```

### Error Stack Trace

```
TypeError: Failed to execute 'abort' on 'AbortController': Illegal invocation
  at Promise.S [as abort] (rtk.js:1:26029)
  at P (rtk.js:1:57456)
  at g (rtk.js:1:57760)
  at resetApiState handler
```

### Expected Behavior

Dispatching `resetApiState()` actions should cleanly reset the RTK Query cache without errors.

### Actual Behavior

The `abort()` method on `AbortController` throws "Illegal invocation" because it loses its `this` context.

### Root Cause Analysis

The issue appears to be related to how `AbortController.abort` is being called within the retry logic. In JavaScript, when a method is detached from its object context and called later, it can result in "Illegal invocation":

```javascript
const controller = new AbortController();
const abort = controller.abort;  // Lost 'this' binding
abort();  // ❌ TypeError: Illegal invocation
```

The `abort` method needs to be either:
1. Called directly: `controller.abort()`
2. Bound to the instance: `controller.abort.bind(controller)`

### Use Case

This pattern is common in test suites where you need to reset all API state between tests:

```javascript
// In Cypress or Jest
afterEach(() => {
  // Reset all API caches
  for (const action of resetApiActions) {
    store.dispatch(action);
  }
});
```

### Workarounds

1. **Downgrade to 2.9.1**: `npm install @reduxjs/toolkit@2.9.1`
2. **Dispatch individually** (loses the benefit of array pattern):
   ```javascript
   store.dispatch(api1.util.resetApiState());
   store.dispatch(api2.util.resetApiState());
   ```
3. **Remove retry wrapper** (not ideal):
   ```javascript
   baseQuery: fetchBaseQuery({ baseUrl: '...' })
   ```

### Additional Context

This is blocking our test suite upgrade as we use Cypress for E2E testing and rely on resetting API state between tests. The pattern has worked flawlessly in 2.9.1 but breaks in 2.9.2+.

### Files to Review

In a typical application structure:
- Custom retry wrapper implementation
- Store configuration with resetApiActions array
- Test cleanup hooks that dispatch these actions

### Questions

1. Was there a change in how `AbortController` is used within the retry logic between 2.9.1 and 2.9.2?
2. Is there a recommended pattern for resetting multiple API slices that avoids this issue?
3. Could the `abort` method be properly bound when stored/used in the retry logic?

---

Thank you for maintaining RTK Query! This library has been excellent for our application, and we'd love to get this resolved so we can upgrade.
