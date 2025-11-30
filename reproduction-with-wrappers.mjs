// Minimal reproduction for Redux Toolkit 2.10.1 "Illegal invocation" issue
// This time with custom baseQuery wrappers similar to the Ark.Starters.SPA pattern

import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

// Simulate the arkRetry wrapper from arkBaseQuery.ts
const arkRetry = (baseQuery, retryConfig) => {
  const retryFn = retry(baseQuery, retryConfig);
  return (args, api, extraOptions) =>
    retryFn(args, api, extraOptions ?? {});
};

// Simulate the arkFetchBaseQuery pattern
const arkFetchBaseQuery = (fetchConfig, arkFetchConfig) => {
  fetchConfig = fetchConfig || {};
  fetchConfig.timeout = fetchConfig.timeout || 30 * 1000;

  const q = async (args, api, extraOptions) => {
    const timeout = extraOptions?.timeout ?? fetchConfig.timeout ?? 60 * 1000;
    const c = { ...fetchConfig, timeout };
    const baseQuery = fetchBaseQuery(c);
    const result = await baseQuery(args, api, extraOptions ?? {});
    
    // SKIP retry if the error doesn't look transient
    if (result.error) {
      if (typeof result.error.status === 'number' && result.error.status < 500 && result.error.status !== 429) {
        retry.fail(result.error, result.meta);
      }
      if (result.error.status === 'PARSING_ERROR') retry.fail(result.error, result.meta);
    }
    
    return result;
  };

  let retryConfig = arkFetchConfig?.retryConfig;
  retryConfig = retryConfig || { maxRetries: 2 };

  return arkRetry(q, retryConfig);
};

// Create an API slice with the custom base query
const api = createApi({
  reducerPath: 'api',
  baseQuery: arkFetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    test: builder.query({
      query: () => '/test',
    }),
  }),
});

// CRITICAL: Create the resetApiState action BEFORE the store is configured
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
  process.exit(1);
}
