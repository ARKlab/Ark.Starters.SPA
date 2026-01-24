# Redux API Slice Lazy Loading

## Overview

This application uses RTK 2.x's `combineSlices().withLazyLoadedSlices()` pattern to dynamically load Redux API slices only when their associated features are accessed. This reduces the initial bundle size and improves application performance.

## Architecture

### Core Store Configuration

The store in `configureStore.ts` contains only essential slices that are needed immediately:

- **Core slices** (always loaded):
  - `authSlice` - Authentication state
  - `envSlice` - Environment configuration
  - `tableStateSlice` - Table UI state
  - `errorHandler` - Global error handling

- **API slices** (lazy-loaded):
  - `moviesApiSlice` - Movies feature API
  - `configTableApiSlice` - Config table API
  - `videoGameApiSlice` - Video games API
  - `jsonPlaceholderApi` - JSON placeholder demo API
  - `globalLoadingSlice` - Global loading demo API
  - `rtkqErrorHandlingApi` - Error handling demo API

### Type Safety

The implementation maintains full TypeScript type safety using type-only imports:

```typescript
// Type-only imports don't bundle the implementation
import type { moviesApiSlice } from "../features/paginatedTable/paginatedTableApi"

// Union type for compile-time safety
export type LazyApiSlice = 
  | typeof moviesApiSlice
  | typeof configTableApiSlice
  // ... other slices

// Typed reducer with lazy loading support
const sliceReducers = rootReducer.withLazyLoadedSlices<
  WithSlice<typeof moviesApiSlice> &
  WithSlice<typeof configTableApiSlice>
  // ... other slices
>()
```

This provides:
- Full IDE autocomplete and type checking
- Compile-time verification of slice types
- No runtime overhead from type information

## Usage

### Adding a New Lazy-Loaded API Slice

1. **Create the API slice** in your feature folder:

```typescript
// src/features/myFeature/myFeatureApi.ts
import { createApi } from "@reduxjs/toolkit/query/react"
import { appFetchQuery } from "../../app/appFetchQuery"

export const myFeatureApiSlice = createApi({
  reducerPath: "myFeatureApi",
  baseQuery: appFetchQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    // Your endpoints here
  }),
})

export const { useGetDataQuery } = myFeatureApiSlice
```

2. **Add the slice type** to `configureStore.ts`:

```typescript
// Add type-only import
import type { myFeatureApiSlice } from "../features/myFeature/myFeatureApi"

// Add to LazyApiSlice union
export type LazyApiSlice = 
  | typeof moviesApiSlice
  | typeof myFeatureApiSlice  // Add your slice
  // ... other slices

// Add to withLazyLoadedSlices type parameter
const sliceReducers = rootReducer.withLazyLoadedSlices<
  WithSlice<typeof moviesApiSlice> &
  WithSlice<typeof myFeatureApiSlice> &  // Add your slice
  // ... other slices
>()
```

3. **Inject the slice** in your feature component:

```typescript
// src/features/myFeature/MyFeaturePage.tsx
import { myFeatureApiSlice, useGetDataQuery } from './myFeatureApi'
import { useInjectApiSlice } from '../../app/useInjectApiSlice'

export default function MyFeaturePage() {
  // Inject the slice when component mounts
  useInjectApiSlice(myFeatureApiSlice)
  
  // Use RTK Query hooks as normal
  const { data, isLoading } = useGetDataQuery()
  
  return <div>{/* Your UI */}</div>
}
```

### How It Works

1. **Initial Load**: Only core slices are in the Redux store
2. **Route Navigation**: User navigates to a feature (e.g., `/movies`)
3. **Component Load**: React.lazy loads the feature component
4. **Slice Injection**: `useInjectApiSlice` hook:
   - Calls `store.injectSlice()` to add the reducer
   - Automatically adds the middleware
   - Registers the reset action for dev/e2e mode
5. **Feature Ready**: RTK Query hooks work as expected

### Development Tools

The slice injection system supports Redux DevTools:

```typescript
// In dev/e2e mode, reset all caches
if (import.meta.env.DEV || import.meta.env.MODE === "e2e") {
  window.rtkq = {
    resetCache: () => {
      for (const action of getResetApiActions()) {
        store.dispatch(action)
      }
    },
  }
}
```

## Bundle Impact

### Before Lazy Loading
- `initGlobals.js`: 351.44 KB (102.54 KB gzipped)
- All API slices bundled in initial load
- Users download code for features they never use

### After Lazy Loading
- `initGlobals.js`: 330.09 KB (94.75 KB gzipped)
- API slices split into feature chunks (2-13 KB each)
- **Savings: 7.79 KB gzipped (7.6%)**

### Feature Chunks
Each feature now has its own chunk with its API slice:
- `moviePage-*.js`: 11 KB (includes moviesApiSlice)
- `videoGamesPage-*.js`: 13 KB (includes videoGameApiSlice)
- `configTableExample-*.js`: 6.9 KB (includes configTableApiSlice)
- etc.

## Best Practices

### Do's ✅
- Use `useInjectApiSlice` in the top-level feature component
- Use type-only imports in `configureStore.ts`
- Keep core slices minimal (auth, env, error handling)
- Test that features work after navigation

### Don'ts ❌
- Don't import API slices directly in `configureStore.ts` (use `import type`)
- Don't inject the same slice multiple times (it's idempotent but wasteful)
- Don't put feature-specific logic in core slices
- Don't forget to add new slices to the `LazyApiSlice` union type

## Troubleshooting

### "Cannot read properties of undefined" in RTK Query hook

**Problem**: Slice not injected before hook is called

**Solution**: Ensure `useInjectApiSlice` is called before any RTK Query hooks:

```typescript
function MyComponent() {
  useInjectApiSlice(myApiSlice)  // ✅ First
  const { data } = useGetDataQuery()  // ✅ After injection
  // ...
}
```

### TypeScript error: "Type X is not assignable to LazyApiSlice"

**Problem**: New slice not added to union type

**Solution**: Add slice to `LazyApiSlice` union in `configureStore.ts`:

```typescript
export type LazyApiSlice = 
  | typeof existingSlice
  | typeof yourNewSlice  // Add this
```

### Bundle still large after adding lazy loading

**Problem**: Accidentally importing slice implementation instead of type

**Solution**: Use type-only import:

```typescript
// ❌ Wrong - bundles the implementation
import { myApiSlice } from "../features/myFeature/myFeatureApi"

// ✅ Correct - only imports the type
import type { myApiSlice } from "../features/myFeature/myFeatureApi"
```

## References

- [RTK Query Code Splitting](https://redux-toolkit.js.org/rtk-query/usage/code-splitting)
- [RTK combineSlices](https://redux-toolkit.js.org/api/combineSlices)
- [RTK withLazyLoadedSlices](https://redux-toolkit.js.org/api/combineSlices#withlazyloadedslices)
