/**
 * CODE PATTERN DEMONSTRATION for "Illegal invocation" error in @reduxjs/toolkit 2.10.1
 * 
 * ⚠️  IMPORTANT: This Node.js script demonstrates the CODE PATTERN that causes the issue,
 * but does NOT reproduce the actual error because Node.js's AbortController is more lenient
 * than browser implementations.
 * 
 * TO SEE THE ACTUAL ERROR: Run the Cypress tests in this repository with `npm run test`
 * 
 * This demonstrates the pattern used in the application where resetApiState() causes
 * "Illegal invocation" when dispatched in a loop, introduced in @reduxjs/toolkit >= 2.9.2
 * 
 * The issue appears when:
 * 1. API slices are created with custom baseQuery using retry() wrapper
 * 2. resetApiState() actions are collected in an array at module level
 * 3. In browser/Cypress tests, these actions are dispatched in a loop to reset state
 * 4. The abort() method on AbortController loses its 'this' context when called
 * 
 * APPLICATION CONTEXT:
 * - src/lib/rtk/arkBaseQuery.ts:83-87 - arkRetry wrapper function
 * - src/lib/rtk/appFetchBaseQuery.ts:194 - arkFetchBaseQuery uses arkRetry
 * - src/app/configureStore.ts:60-67 - resetApiActions array
 * - src/initGlobals.tsx:12-17 - window.rtkq.resetCache() loops and dispatches
 * - cypress/support/e2e.ts:10-11 - afterEach calls window.rtkq.resetCache()
 * 
 * To run this pattern demo: node reproduction.js
 * To see actual error: npm run test (runs Cypress tests)
 * 
 * Expected in browser: TypeError: Illegal invocation at AbortController.abort
 * Actual in Node.js: No error (Node.js AbortController is more lenient)
 */

import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

// Create custom base query with retry wrapper (similar to arkRetry in the application)
const customBaseQuery = (baseUrl) => {
  const baseQuery = fetchBaseQuery({ baseUrl });
  // Wrap with retry, similar to arkRetry function in src/lib/rtk/arkBaseQuery.ts
  const retryFn = retry(baseQuery, { maxRetries: 2 });
  return (args, api, extraOptions) => 
    retryFn(args, api, extraOptions ?? {});
};

// Create a simple API slice similar to the pattern used in the application
const api1 = createApi({
  reducerPath: 'api1',
  baseQuery: customBaseQuery('https://example.com/'),
  endpoints: (builder) => ({
    getData: builder.query({
      query: () => 'data',
    }),
  }),
});

const api2 = createApi({
  reducerPath: 'api2',
  baseQuery: customBaseQuery('https://example.com/'),
  endpoints: (builder) => ({
    getData: builder.query({
      query: () => 'data',
    }),
  }),
});

const api3 = createApi({
  reducerPath: 'api3',
  baseQuery: customBaseQuery('https://example.com/'),
  endpoints: (builder) => ({
    getData: builder.query({
      query: () => 'data',
    }),
  }),
});

// THIS IS IMPORTANT: Create the actions BEFORE the store is configured
// This matches the pattern in src/app/configureStore.ts (lines 60-67)
// The actions are created at module initialization time
const resetApiActions = [
  api1.util.resetApiState(),
  api2.util.resetApiState(),
  api3.util.resetApiState(),
];

// Configure the store AFTER creating the resetApiActions array
// This timing is important and matches the actual application structure

// Configure the store
const store = configureStore({
  reducer: {
    [api1.reducerPath]: api1.reducer,
    [api2.reducerPath]: api2.reducer,
    [api3.reducerPath]: api3.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api1.middleware, api2.middleware, api3.middleware),
});

console.log('Store initialized successfully');
console.log('resetApiActions array created:', resetApiActions.length, 'actions');

// Start some queries to simulate active requests
console.log('\\nInitiating some queries...');
const promise1 = store.dispatch(api1.endpoints.getData.initiate());
const promise2 = store.dispatch(api2.endpoints.getData.initiate());
const promise3 = store.dispatch(api3.endpoints.getData.initiate());

console.log('Queries initiated');

// Wait a moment for queries to start (but not complete)
await new Promise(resolve => setTimeout(resolve, 10));

// This is the pattern used in src/initGlobals.tsx (lines 13-16)
// Dispatching these actions in a loop causes "Illegal invocation" error
console.log('\\nAttempting to dispatch resetApiState actions while queries are in progress...');
try {
  for (const action of resetApiActions) {
    console.log('Dispatching action:', action.type);
    store.dispatch(action);
  }
  console.log('✅ SUCCESS: All resetApiState actions dispatched without error');
} catch (error) {
  console.error('❌ ERROR: Failed to dispatch resetApiState actions');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}

// Clean up
promise1.unsubscribe();
promise2.unsubscribe();
promise3.unsubscribe();

console.log('\\n✓ Pattern demonstration completed successfully');
console.log('\\n⚠️  IMPORTANT: This script demonstrates the CODE PATTERN but does NOT');
console.log('   reproduce the actual error in Node.js because Node\'s AbortController');
console.log('   implementation is more lenient than browser implementations.');
console.log('\\n   TO SEE THE ACTUAL ERROR:');
console.log('   Run the Cypress tests with: npm run test');
console.log('\\n   The error occurs in: cypress/support/e2e.ts (line 11)');
console.log('   When calling: window.rtkq.resetCache()');
console.log('   Which dispatches the resetApiActions array from: src/app/configureStore.ts');
console.log('\\n   Actual error from Cypress (browser environment):');
console.log('   TypeError: Illegal invocation');
console.log('   at Promise.S [as abort] (rtk.js:1:26029)');
console.log('   at resetApiState handler');
console.log('\\n   For a browser-based reproduction, open: test-reproduction.html in a browser');
