/**
 * Redux Toolkit 2.10.1 - Illegal Invocation Bug Reproduction
 * 
 * ISSUE: Dispatching resetApiState() causes "Illegal invocation" error when:
 * 1. The resetApiState action is created BEFORE the store is initialized
 * 2. An active query exists when resetApiState is dispatched
 * 3. Custom baseQuery wrappers (like retry) are used
 * 
 * ERROR MANIFESTATION:
 * - In browser: "TypeError: Illegal invocation" on AbortController.abort
 * - In Node.js: "TypeError: Cannot read private member #signal from an object whose class did not declare it"
 * 
 * This issue was introduced in @reduxjs/toolkit version 2.9.2+ (upgrade from 2.9.1 to 2.10.1)
 * 
 * VERIFIED BEHAVIOR:
 * - v2.9.1: ✅ Works without error
 * - v2.9.2+: ❌ Throws "Illegal invocation" error
 * - v2.10.1: ❌ Throws "Illegal invocation" error
 * 
 * CONTEXT:
 * In the Ark.Starters.SPA codebase, resetApiState actions are created at module initialization
 * time in configureStore.ts and stored in an array for later use (see src/app/configureStore.ts
 * lines 60-67). This pattern breaks when resetApiState is dispatched while queries are in progress,
 * which happens in Cypress tests after each test (see cypress/support/e2e.ts line 11).
 * 
 * The error occurs because:
 * 1. resetApiState() is called before the store exists, creating an action with closures
 * 2. When dispatched later, it tries to abort active queries
 * 3. The AbortController's abort method loses its 'this' context, causing illegal invocation
 * 
 * HOW TO RUN:
 * npm install @reduxjs/toolkit@2.10.1
 * node redux-toolkit-resetApiState-issue.mjs
 * 
 * TO VERIFY FIX (should complete without error):
 * npm install @reduxjs/toolkit@2.9.1
 * node redux-toolkit-resetApiState-issue.mjs
 * 
 * EXPECTED (v2.10.1): Throws "TypeError: Cannot read private member #signal"
 * EXPECTED (v2.9.1): Completes successfully without error
 */

import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

// Simulate custom baseQuery wrapper pattern used in Ark.Starters.SPA
// This wraps the base query with retry logic
const arkRetry = (baseQuery, retryConfig) => {
  const retryFn = retry(baseQuery, retryConfig);
  return (args, api, extraOptions) =>
    retryFn(args, api, extraOptions ?? {});
};

const arkFetchBaseQuery = (fetchConfig = {}, arkFetchConfig = {}) => {
  fetchConfig.timeout = fetchConfig.timeout || 30 * 1000;

  const q = async (args, api, extraOptions) => {
    const timeout = extraOptions?.timeout ?? fetchConfig.timeout ?? 60 * 1000;
    const c = { ...fetchConfig, timeout };
    const baseQuery = fetchBaseQuery(c);
    const result = await baseQuery(args, api, extraOptions ?? {});
    
    // Skip retry for non-transient errors
    if (result.error) {
      if (typeof result.error.status === 'number' && result.error.status < 500 && result.error.status !== 429) {
        retry.fail(result.error, result.meta);
      }
      if (result.error.status === 'PARSING_ERROR') {
        retry.fail(result.error, result.meta);
      }
    }
    
    return result;
  };

  const retryConfig = arkFetchConfig?.retryConfig || { maxRetries: 2 };
  return arkRetry(q, retryConfig);
};

// Create API slice with custom baseQuery
const api = createApi({
  reducerPath: 'api',
  baseQuery: arkFetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => '/todos/1',
    }),
  }),
});

// ============================================================================
// CRITICAL: Create the resetApiState action BEFORE the store is configured
// This matches the pattern in Ark.Starters.SPA/src/app/configureStore.ts
// where resetApiActions array is exported at module initialization time
// ============================================================================
const resetAction = api.util.resetApiState();

console.log('✓ Reset action created:', resetAction);
console.log('  Type:', resetAction.type);

// Now create the store (after reset action is created)
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

console.log('✓ Store created');

// Start a query to have active state with pending request
console.log('✓ Starting a query to create active state...');
const querySubscription = store.dispatch(api.endpoints.getTodos.initiate());

// Give the query time to start (not complete, just start)
await new Promise(resolve => setTimeout(resolve, 100));

const apiState = store.getState()[api.reducerPath];
console.log('✓ Query state:');
console.log('  Active queries:', Object.keys(apiState.queries).length);
console.log('  Status:', apiState.queries[Object.keys(apiState.queries)[0]]?.status);

// ============================================================================
// BUG TRIGGER: Dispatch the resetApiState action while query is active
// This causes "Illegal invocation" / "Cannot read private member #signal"
// The error is thrown from the event loop and cannot be caught
// ============================================================================
console.log('\n⚠️  Attempting to dispatch resetApiState with active query...');
console.log('   Expected result: Process crashes with TypeError');
console.log('   The error happens when RTK Query tries to abort the active query\n');

store.dispatch(resetAction);
console.log('✓ resetApiState dispatched (synchronous part succeeded)');
console.log('  Note: The error will appear shortly from the event loop...');

// Wait for the error to manifest
await new Promise(resolve => setTimeout(resolve, 1000));

// If we reach here, the bug was not reproduced (or was fixed)
console.log('\n✅ SUCCESS: No error occurred!');
console.log('   (If you see this, the bug may be fixed!)');
querySubscription.unsubscribe();
process.exit(0);
