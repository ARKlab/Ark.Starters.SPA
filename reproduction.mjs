// Minimal reproduction for Redux Toolkit 2.10.1 "Illegal invocation" issue
// When dispatching resetApiState() actions that were created before store initialization

import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';

// Create a simple API slice
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    test: builder.query({
      query: () => '/test',
    }),
  }),
});

// CRITICAL: Create the resetApiState action BEFORE the store is configured
// This is what happens in the Ark.Starters.SPA code in configureStore.ts
const resetAction = api.util.resetApiState();

console.log('Reset action created:', resetAction);

// Now create the store
const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

console.log('Store created');

// Try to dispatch the action
console.log('Attempting to dispatch resetApiState...');
try {
  store.dispatch(resetAction);
  console.log('✅ SUCCESS: resetApiState dispatched without error');
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error('Stack:', error.stack);
  throw error;
}
