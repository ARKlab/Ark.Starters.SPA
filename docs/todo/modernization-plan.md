# ARK Starters SPA - Modernization & Performance Improvement Plan

> **Created**: 2026-01-13  
> **Status**: Planning Phase  
> **Version**: 1.0

## Executive Summary

This document outlines a comprehensive modernization and performance improvement plan for the ARK Starters SPA project. The plan addresses 14 key areas identified through codebase analysis, focusing on:

- **Dependency Updates**: Replacing abandoned or outdated libraries
- **Performance Optimization**: Code splitting, memoization, and lazy loading
- **Bundle Size Reduction**: Eliminating redundancies and optimizing imports
- **Developer Experience**: Better tooling and error handling
- **Runtime Performance**: Virtualization and efficient rendering

**Important Note**: This project uses React Compiler (babel-plugin-react-compiler), which automatically memoizes components and hooks. Before implementing manual memoization (issues #3, #5, #8), measure the actual performance impact to avoid unnecessary complexity.

---

## Issue Tracking

### Priority Levels
- **🔴 High**: Critical for performance or maintenance
- **🟡 Medium**: Valuable improvements with moderate impact
- **🟢 Low**: Nice-to-have enhancements

### Complexity Levels
- **Simple**: 1-2 hours
- **Moderate**: 3-6 hours
- **Complex**: 1-2 days

---

## 1. Replace `react-dnd` with Modern Alternative

**Priority**: 🔴 High  
**Complexity**: Complex  
**Impact**: Better maintenance, smaller bundle size, improved accessibility  
**Status**: ✅ **COMPLETED** (2026-01-13)

### Current State
~~Using `react-dnd` v16.0.1 and `react-dnd-html5-backend` v16.0.1 marked as abandoned.~~
Successfully migrated to `@dnd-kit/core` and `@dnd-kit/sortable`.

### Implementation Checklist

- [x] **Research & Planning**
  - [x] Audit current `react-dnd` usage across codebase
  - [x] Identify all components using drag-and-drop functionality
  - [x] Document current behavior and features used
  - [x] Review @dnd-kit documentation and migration guide

- [x] **Setup**
  - [x] Install @dnd-kit packages:
    ```bash
    npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
    ```
  - [x] Update package.json to remove react-dnd dependencies
  - [x] Update TypeScript types if needed

- [x] **Migration**
  - [x] Migrate draggableColumnHeader.tsx to use @dnd-kit/sortable
  - [x] Update AppArkApiTable.tsx to use DndContext and SortableContext
  - [x] Test migrated component thoroughly
  - [x] Update vite.config.ts manual chunks configuration

- [x] **Testing & Validation**
  - [x] Run existing Cypress tests (53/53 passing)
  - [x] Verify bundle builds successfully
  - [x] Test column drag-and-drop in browser
  - [x] Linter passes

- [x] **Documentation**
  - [x] Update AGENTS.md to reference @dnd-kit

### Files Modified
- `src/lib/components/AppArkApiTable/draggableColumnHeader.tsx` - Migrated from useDrag/useDrop to useSortable
- `src/lib/components/AppArkApiTable/AppArkApiTable.tsx` - Replaced DndProvider with DndContext
- `vite.config.ts` - Updated manual chunks from react-dnd to @dnd-kit packages
- `package.json` - Removed react-dnd/react-dnd-html5-backend, added @dnd-kit packages
- `AGENTS.md` - Updated DnD library reference

### Implementation Details
- Replaced react-dnd's `useDrag` and `useDrop` hooks with @dnd-kit's `useSortable` hook
- Replaced `DndProvider` with `DndContext` and `SortableContext`
- Used `horizontalListSortingStrategy` for column reordering
- Implemented drag end handler using `arrayMove` utility
- Maintained all existing functionality (column reordering, visual feedback, reset button)

### Actual Impact
- **Bundle size**: Reduced by ~7 packages (removed react-dnd and dependencies)
- **Maintenance**: Now using actively maintained library with better TypeScript support
- **Accessibility**: @dnd-kit provides better keyboard navigation and screen reader support
- **Test coverage**: All 53 E2E tests passing
- **Touch support**: Built-in touch device support with @dnd-kit

---

## 2. Implement Route-Based Code Splitting for Non-Lazy Components

**Priority**: 🟡 Medium  
**Complexity**: Simple  
**Impact**: Improved initial bundle size, faster first paint  
**Status**: ✅ **COMPLETED** (2026-01-13)

### Current State
~~In `src/siteMap/siteMap.tsx`, some components are imported directly~~
All components are now lazy-loaded.

### Implementation Checklist

- [x] **Convert Bomb Component**
  - [x] Change from: `component: <Bomb />`
  - [x] Change to: `lazy: async () => import("../components/Bomb")`
  - [x] Ensure Bomb.tsx has default export
  - [x] Test error boundary behavior

- [x] **Convert ComponentsTestPage**
  - [x] Change from: `component: <ComponentsTestPage />`
  - [x] Change to: `lazy: async () => import("../features/tests/ComponentsPage")`
  - [x] Verify test page loads correctly

- [x] **Convert DetailsPage Components**
  - [x] Convert DetailsPageExampleMainView to lazy
  - [x] Convert DetailsPage to lazy
  - [x] Test navigation between main view and detail view
  - [x] Verify route parameters still work

- [x] **Convert NoEntryPoint**
  - [x] Change to lazy import
  - [x] Test in nested subsection context

- [x] **Validation**
  - [x] Build production bundle
  - [x] Analyze bundle chunks to verify splitting
  - [x] Test all converted routes in browser
  - [x] Run Cypress E2E tests (53 tests passed)
  - [x] Measure bundle size improvement

### Files Modified
- `src/siteMap/siteMap.tsx` - Updated all route definitions to use lazy loading
- `src/components/Bomb.tsx` - Changed from named export to default export

### Actual Impact
- **Initial bundle size reduction**: ~44.71 KB (~14.34 KB gzipped)
  - Before: `initGlobals-*.js` = 646.73 kB (208.45 kB gzipped)
  - After: `initGlobals-*.js` = 602.02 kB (194.11 kB gzipped)
- **New code-split chunks created**:
  - `Bomb-*.js` = 0.11 kB (0.13 kB gzipped)
  - `staticPage-*.js` = 0.48 kB (0.36 kB gzipped)
  - `detailsPage-*.js` = 0.96 kB (0.60 kB gzipped)
  - `detailsPageExampleMainView-*.js` = 1.37 kB (0.70 kB gzipped)
  - `ComponentsPage-*.js` = 26.75 kB (9.66 kB gzipped)
- **All E2E tests pass**: 53/53 tests passing
- **Improved time to interactive**: Initial bundle loads faster, components load on-demand
- Improved time to interactive for initial route

---

## 3. Add `useCallback` Memoization for Event Handlers

**Priority**: 🟢 Low  
**Complexity**: Simple  
**Impact**: Prevent unnecessary re-renders (if React Compiler doesn't already handle)

### ⚠️ IMPORTANT: React Compiler Consideration
This project uses `babel-plugin-react-compiler` which **automatically memoizes components and hooks**. Before implementing manual `useCallback`, you should:

1. **Measure first**: Use React DevTools Profiler to identify actual performance issues
2. **Check compiler output**: Review compiled code to see if memoization is already applied
3. **Benchmark**: Compare performance with and without manual `useCallback`

**Only proceed if you find evidence that manual memoization provides measurable benefits.**

### Current State
Several components define inline functions that may be recreated on every render:
- `src/features/tests/ComponentsPage.tsx` - pagination handlers
- `src/features/paginatedTable/moviePage.tsx` - filter handlers
- `src/features/formWizard/wizard.tsx` - navigation and submit handlers

### Implementation Checklist

- [ ] **Performance Analysis** (REQUIRED FIRST STEP)
  - [ ] Use React DevTools Profiler on ComponentsPage
  - [ ] Profile moviePage with filters
  - [ ] Profile wizard navigation
  - [ ] Document baseline performance metrics
  - [ ] Review React Compiler debug output ([see docs](https://react.dev/learn/react-compiler/debugging))

- [ ] **IF Performance Issues Found:**
  - [ ] Add useCallback to ComponentsPage pagination handlers
  - [ ] Add useCallback to moviePage filter handlers
  - [ ] Add useCallback to wizard navigation handlers
  - [ ] Re-measure performance
  - [ ] Document improvement (or lack thereof)

- [ ] **Testing**
  - [ ] Verify functionality unchanged
  - [ ] Run Cypress tests
  - [ ] Check for any regression in behavior

### Files to Review
- `src/features/tests/ComponentsPage.tsx`
- `src/features/paginatedTable/moviePage.tsx`
- `src/features/formWizard/wizard.tsx`

### References
- [React Compiler Debugging](https://react.dev/learn/react-compiler/debugging)
- [useCallback Hook](https://react.dev/reference/react/useCallback)

---

## 4. Consolidate Duplicate Lazy Loading Components

**Priority**: 🟡 Medium  
**Complexity**: Moderate  
**Impact**: Better code maintainability, reduced confusion  
**Status**: ✅ **COMPLETED** (2026-01-13)

### Current State
~~Two similar implementations for lazy loading exist~~
Lazy loading utilities are now consolidated and properly organized.

### Implementation Checklist

- [x] **Analysis**
  - [x] Search for all usages of `lazyLoad.tsx`
  - [x] Search for all usages of `createLazyComponent.tsx`
  - [x] Document use cases for each
  - [x] Determine if both patterns are actually needed

- [x] **Design Decision**
  - [x] Decide on unified API (both factory and component approaches retained)
  - [x] Consider backwards compatibility
  - [x] Design TypeScript types for unified utility

- [x] **Implementation**
  - [x] Create new utilities in `src/lib/components/`
    - `LazyComponent.tsx` - Component-based approach
    - `createLazyComponent.tsx` - Factory function approach
    - `lazy.ts` - Barrel export for clean imports
  - [x] Include comprehensive JSDoc documentation
  - [x] Export both factory and component versions
  - [x] Add usage examples in comments

- [x] **Migration**
  - [x] Update `index.tsx` to use new utility
  - [x] Update `lib/router.tsx` to use new utility
  - [x] Deprecate old files with re-exports for backwards compatibility
  - [x] Plan removal in future version

- [x] **Documentation**
  - [x] Add to AGENTS.md under "Code Standards and Patterns"
  - [x] Document when to use lazy loading
  - [x] Provide code examples

- [x] **Cleanup**
  - [x] Mark old utility files as deprecated with comments
  - [x] Update imports across codebase
  - [x] Run tests to ensure nothing broke

### Files Modified/Created
- Created: `src/lib/components/LazyComponent.tsx` - Component-based lazy loading
- Created: `src/lib/components/createLazyComponent.tsx` - Factory function approach
- Modified: `src/index.tsx` - Updated import path
- Modified: `src/lib/router.tsx` - Updated import path
- Modified: `AGENTS.md` - Added compact lazy loading documentation

### Implementation Details

**Two Approaches Retained:**

1. **LazyComponent** (Component-based):
   - For dynamic lazy loading with props
   - Used in router for route-based code splitting
   - Memoizes lazy component based on loader function
   - Accepts custom fallback prop

2. **createLazyComponent** (Factory function):
   - For static lazy loading
   - Creates a reusable wrapped component
   - Used in `index.tsx` for InitGlobals
   - More efficient for fixed loaders

**React Fast Refresh Compliance:**
- Split into separate files to avoid exporting both components and functions from same file
- Each file only exports components OR functions, not both

### Testing & Validation
- [x] Linter passes without errors
- [x] Build successful
- [x] All 61 E2E tests passing
- [x] No bundle size regression
- [x] React Fast Refresh works correctly

### Actual Impact
- **Code Organization**: Clear separation between component-based and factory approaches
- **Developer Experience**: Compact documentation, direct imports
- **Maintainability**: Single source of truth in `lib/components/`
- **React Fast Refresh**: Fully compliant (separate files for components vs functions)

---

## 5. Add React.memo to Frequently Re-rendered Components

**Priority**: 🟢 Low  
**Complexity**: Simple  
**Impact**: Prevent unnecessary re-renders (if React Compiler doesn't already handle)

### ⚠️ IMPORTANT: React Compiler Consideration
Same as Issue #3 - React Compiler may already handle this automatically. **Measure performance first before adding manual memoization.**

### Current State
Several pure presentation components could potentially benefit from `React.memo()`:
- Table cell renderers
- Menu items in `sideBar.tsx`
- Pagination components
- Rating components

### Implementation Checklist

- [ ] **Performance Analysis** (REQUIRED FIRST STEP)
  - [ ] Use React DevTools Profiler on table components
  - [ ] Profile sidebar menu rendering
  - [ ] Profile pagination component updates
  - [ ] Document baseline render counts
  - [ ] Review React Compiler auto-memoization

- [ ] **IF Performance Issues Found:**
  - [ ] Identify pure components that re-render unnecessarily
  - [ ] Wrap with React.memo()
  - [ ] Add custom comparison function if needed
  - [ ] Re-measure performance
  - [ ] Document improvements

- [ ] **Testing**
  - [ ] Verify UI behavior unchanged
  - [ ] Test edge cases
  - [ ] Run full test suite

### Candidate Components
- Table cell renderers in `AppArkApiTable` and `AppSimpleTable`
- Sidebar menu items
- Pagination buttons/controls
- Rating display component

### References
- [React.memo documentation](https://react.dev/reference/react/memo)
- [React Compiler Debugging](https://react.dev/learn/react-compiler/debugging)

---

## 6. Implement Web Vitals Reporting Integration

**Priority**: 🟡 Medium  
**Complexity**: Simple  
**Impact**: Better performance monitoring and debugging  
**Status**: ✅ **COMPLETED** (2026-01-13)

### Current State
~~`reportWebVitals.ts` exists but only logs to console implicitly~~
Web Vitals are now integrated with Application Insights.

### Implementation Checklist

- [x] **Setup**
  - [x] Review Application Insights configuration
  - [x] Verify `@microsoft/applicationinsights-web` is properly initialized
  - [x] Check if custom events are already being tracked

- [x] **Implementation**
  - [x] Create callback function to send metrics to Application Insights
  - [x] Add development mode console logging
  - [x] Update `index.tsx` to pass callback to `reportWebVitals()`
  - [x] Add proper TypeScript types

- [x] **Metrics to Track**
  - [x] CLS (Cumulative Layout Shift)
  - [x] FCP (First Contentful Paint)
  - [x] LCP (Largest Contentful Paint)
  - [x] TTFB (Time to First Byte)
  - [x] INP (Interaction to Next Paint) - added from web-vitals v5

- [x] **Testing**
  - [x] Test in development mode (console logs)
  - [x] Build production bundle successfully
  - [x] Linter passes without errors

### Files Modified
- `src/reportWebVitals.ts` - Added Application Insights integration with sendToAnalytics function
- `src/index.tsx` - Pass sendToAnalytics callback to reportWebVitals

### Implementation Details
- Added `sendToAnalytics` function that sends metrics to Application Insights
- Console logs metrics in development mode for debugging
- Properly typed with `IApplicationInsights` interface
- Retrieves appInsights instance from window (attached after initialization in initApp.tsx)
- Tracks all 5 Core Web Vitals metrics (CLS, FCP, LCP, TTFB, INP)

---

## 7. [Reserved for Future Use]

*Issue #7 was skipped in the original list*

---

## 8. Optimize TanStack Table Column Definitions with useMemo

**Priority**: 🟢 Low  
**Complexity**: Simple  
**Impact**: Prevent unnecessary table re-renders (if React Compiler doesn't already handle)

### ⚠️ IMPORTANT: React Compiler Consideration
Same as Issues #3 and #5 - React Compiler may automatically optimize this. **Measure first!**

### Current State
In `src/features/paginatedTable/moviePage.tsx` and similar table views, column definitions are recreated on every render.

### Implementation Checklist

- [ ] **Performance Analysis** (REQUIRED FIRST STEP)
  - [ ] Profile moviePage table rendering
  - [ ] Count unnecessary re-renders with React DevTools
  - [ ] Check React Compiler output for auto-memoization
  - [ ] Document baseline performance

- [ ] **IF Performance Issues Found:**
  - [ ] Wrap column definitions in useMemo in moviePage.tsx
  - [ ] Add proper dependency array (likely empty or [t] for translations)
  - [ ] Apply to other table components if needed
  - [ ] Re-measure performance

- [ ] **Testing**
  - [ ] Verify table filtering still works
  - [ ] Test sorting functionality
  - [ ] Test pagination
  - [ ] Ensure translations update correctly
  - [ ] Run Cypress tests

### Files to Review
- `src/features/paginatedTable/moviePage.tsx`
- `src/features/configTable/configTableExample.tsx` (if applicable)
- `src/features/formExample/videoGamesPage.tsx` (if applicable)

### Example Implementation
```typescript
const columns = useMemo(
  () => [
    columnHelper.accessor(row => row.title, {
      id: "title",
      cell: info => info.getValue(),
      header: () => <span>{t("movies_title")}</span>,
      meta: { type: "string" },
    }),
    // ... more columns
  ] as ColumnDef<Movie>[],
  [t], // Dependency on translation function
);
```

---

## 9. Add Bundle Analysis Tooling

**Priority**: 🟡 Medium  
**Complexity**: Simple  
**Impact**: Better visibility into bundle size, identify optimization opportunities  
**Status**: ✅ **COMPLETED** (2026-01-13)

### Current State
~~No bundle analysis tools configured in the project.~~
Bundle analysis is now available via `npm run analyze`.

### Implementation Checklist

- [x] **Installation**
  - [x] Install rollup-plugin-visualizer

- [x] **Configuration**
  - [x] Add plugin to `vite.config.ts`
  - [x] Configure output format (HTML treemap)
  - [x] Set up separate build command for analysis
  - [x] Add .gitignore entry for stats files

- [x] **Scripts**
  - [x] Add `analyze` script to package.json
  - [x] Document usage in AGENTS.md

- [x] **Testing**
  - [x] Verify regular build still works
  - [x] Test analyze command and stats.html generation
  - [x] Linter passes

### Files Modified
- `vite.config.ts` - Added visualizer plugin for analyze mode
- `package.json` - Added `analyze` script
- `.gitignore` - Added stats.html to ignore list
- `AGENTS.md` - Documented analyze command

### Configuration Details
- Plugin only active in `analyze` mode to avoid slowing down regular builds
- Generates interactive HTML treemap at `build/stats.html`
- Shows both gzip and brotli sizes
- Automatically opens in browser when run locally

### Usage
```bash
npm run analyze
# Generates build/stats.html with interactive bundle visualization
```

### Size Budgets (Current Baseline)
- Initial bundle (initGlobals): 602.83 kB (194.38 kB gzipped)
- Lazy-loaded chunks: < 30 kB each (< 10 kB gzipped)
- Total precache: 3966.83 kB (PWA)

---

## 10. Implement Image Lazy Loading with Intersection Observer

**Priority**: 🟡 Medium  
**Complexity**: Moderate  
**Impact**: Faster initial page load, reduced bandwidth usage

### Current State
- `ViteImageOptimizer` is configured for build-time optimization
- No runtime lazy loading for images in lists/tables
- All images load eagerly

### Proposed Solution
Add native lazy loading and/or Intersection Observer for images in dynamic content.

### Implementation Checklist

- [ ] **Audit**
  - [ ] Identify all image usage across the app
  - [ ] Find images in lists, tables, or below the fold
  - [ ] Document current loading behavior

- [ ] **Native Lazy Loading**
  - [ ] Add `loading="lazy"` to `<img>` tags
  - [ ] Test browser compatibility (should be good with modern browsers)
  - [ ] Verify images load when scrolled into view

- [ ] **Create Lazy Image Component (if needed)**
  - [ ] Create `src/lib/components/LazyImage.tsx`
  - [ ] Use Intersection Observer for more control
  - [ ] Add placeholder/blur effect during loading
  - [ ] Handle error states

- [ ] **Apply to Lists/Tables**
  - [ ] Update table cell renderers if they display images
  - [ ] Update list items with images
  - [ ] Update card components with images

- [ ] **Testing**
  - [ ] Test on slow 3G network simulation
  - [ ] Verify images load when scrolled into view
  - [ ] Check for layout shift (CLS)
  - [ ] Test accessibility (alt text, etc.)
  - [ ] Run Lighthouse audit

- [ ] **Documentation**
  - [ ] Document LazyImage component usage
  - [ ] Add to AGENTS.md component guidelines

### Files to Create/Modify
- Create: `src/lib/components/LazyImage.tsx` (if custom component needed)
- Modify: Any components rendering images in lists/tables
- Update: Component documentation

### Example Implementation
```typescript
// Simple approach - native lazy loading
<img src={imageSrc} alt={alt} loading="lazy" />

// Advanced approach - custom component with Intersection Observer
<LazyImage 
  src={imageSrc} 
  alt={alt} 
  placeholder={placeholderSrc}
  threshold={0.1}
/>
```

---

## 11. [Reserved for Future Use]

*Issue #11 was skipped in the original list*

---

## 12. Replace lodash-es Selective Imports

**Priority**: 🟢 Low  
**Complexity**: Simple  
**Impact**: Reduced bundle size

### Current State
The codebase uses `lodash-es` for utilities:
- `isEqual` - Deep equality comparison
- `set` - Nested object property setting
- Possibly others

### Proposed Solution
Replace with smaller alternatives or native JavaScript where possible.

### Implementation Checklist

- [ ] **Audit**
  - [ ] Search for all lodash-es imports:
    ```bash
    grep -r "from 'lodash-es'" src/
    ```
  - [ ] Document each usage and context
  - [ ] Measure current bundle impact

- [ ] **Replacement Strategy**
  - [ ] For `isEqual`:
    - [ ] Consider `fast-deep-equal` (~1KB vs ~17KB)
    - [ ] Or implement shallow comparison if sufficient
  - [ ] For `set`:
    - [ ] Use native spreading for shallow updates
    - [ ] Use `structuredClone` + manual setting for deep updates
    - [ ] Or keep lodash.set if heavily used
  - [ ] For other utilities:
    - [ ] Evaluate native alternatives
    - [ ] Consider micro-libraries

- [ ] **Implementation**
  - [ ] Install alternatives if needed (e.g., fast-deep-equal)
  - [ ] Create utility functions in `src/lib/utils/` for common patterns
  - [ ] Replace imports one file at a time
  - [ ] Test each replacement thoroughly

- [ ] **Testing**
  - [ ] Run full test suite after each replacement
  - [ ] Verify behavior is identical
  - [ ] Check for edge cases (null, undefined, circular references)

- [ ] **Cleanup**
  - [ ] Remove lodash-es from dependencies if fully replaced
  - [ ] Update package.json
  - [ ] Run bundle analysis to verify size reduction

### Files to Review
- Search results from `grep -r "lodash-es" src/`
- `package.json` - dependencies

### Example Replacements
```typescript
// Before
import { isEqual } from 'lodash-es';
const same = isEqual(obj1, obj2);

// After
import equal from 'fast-deep-equal';
const same = equal(obj1, obj2);

// Before
import { set } from 'lodash-es';
const updated = set(obj, 'a.b.c', value);

// After
const updated = {
  ...obj,
  a: {
    ...obj.a,
    b: {
      ...obj.a.b,
      c: value,
    },
  },
};
```

---

## 13. Add Error Boundary Granularity

**Priority**: 🟡 Medium  
**Complexity**: Moderate  
**Impact**: Better UX with partial failures, improved error recovery

### Current State
- Global error boundary in `index.tsx`
- Route-level error boundaries (likely in router setup)
- No feature-level error boundaries

### Proposed Solution
Add feature-level error boundaries around:
- Table components (network errors shouldn't crash the whole page)
- Form sections
- Widget/card components

### Implementation Checklist

- [ ] **Planning**
  - [ ] Review current error boundary implementation
  - [ ] Identify components that should be isolated
  - [ ] Design fallback UI components

- [ ] **Create Feature Error Boundaries**
  - [ ] Create `src/lib/components/FeatureErrorBoundary.tsx`
  - [ ] Design appropriate fallback UI
  - [ ] Include retry mechanism
  - [ ] Add error reporting to Application Insights

- [ ] **Apply to Tables**
  - [ ] Wrap AppArkApiTable with error boundary
  - [ ] Wrap AppSimpleTable with error boundary
  - [ ] Test network failure scenarios
  - [ ] Verify rest of page remains functional

- [ ] **Apply to Forms**
  - [ ] Wrap form sections with error boundaries
  - [ ] Test validation errors vs runtime errors
  - [ ] Ensure form state is preserved when possible

- [ ] **Apply to Widgets/Cards**
  - [ ] Identify card/widget components
  - [ ] Add error boundaries at appropriate level
  - [ ] Test isolated failures

- [ ] **Testing**
  - [ ] Simulate network errors
  - [ ] Simulate component errors
  - [ ] Test retry functionality
  - [ ] Verify errors are logged correctly
  - [ ] Run Cypress tests

- [ ] **Documentation**
  - [ ] Document error boundary strategy in AGENTS.md
  - [ ] Add guidelines for when to use error boundaries
  - [ ] Document fallback UI patterns

### Files to Create/Modify
- Create: `src/lib/components/FeatureErrorBoundary.tsx`
- Modify: Table components, form components, widget components
- Update: `AGENTS.md` with error handling guidelines

### Example Implementation
```typescript
// src/lib/components/FeatureErrorBoundary.tsx
interface Props {
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: React.ReactNode;
}

export function FeatureErrorBoundary({ 
  fallback, 
  onError, 
  children 
}: Props) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        fallback || (
          <Box p={4} bg="error.subtle" borderRadius="md">
            <Text color="error.fg">Something went wrong</Text>
            <Button onClick={resetErrorBoundary} size="sm">
              Try again
            </Button>
          </Box>
        )
      )}
      onError={onError}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// Usage in table
<FeatureErrorBoundary>
  <AppArkApiTable {...props} />
</FeatureErrorBoundary>
```

---

## 14. Implement Virtualization for Large Lists

**Priority**: 🟡 Medium  
**Complexity**: Moderate  
**Impact**: Improved rendering performance for large datasets

### Current State
- `AppSimpleTable` and `AppArkApiTable` render all rows in the current page
- No virtualization for lists with many items
- Performance may degrade with large page sizes

### Proposed Solution
Add virtualization using `@tanstack/react-virtual` (integrates well with TanStack Table)

### Implementation Checklist

- [ ] **Research**
  - [ ] Test current performance with large datasets (100+ rows)
  - [ ] Determine if virtualization is actually needed
  - [ ] Review @tanstack/react-virtual documentation
  - [ ] Check integration with TanStack Table

- [ ] **Installation**
  - [ ] Install @tanstack/react-virtual:
    ```bash
    npm install @tanstack/react-virtual
    ```

- [ ] **Create Virtualized Table Component**
  - [ ] Create `src/lib/components/AppVirtualTable.tsx`
  - [ ] Integrate with existing AppArkApiTable
  - [ ] Handle row height calculation
  - [ ] Preserve existing features (sorting, filtering, pagination)

- [ ] **Testing**
  - [ ] Test with various dataset sizes (10, 100, 1000+ rows)
  - [ ] Test scrolling performance
  - [ ] Test with dynamic row heights if applicable
  - [ ] Verify sorting and filtering still work
  - [ ] Test accessibility (keyboard navigation)

- [ ] **Documentation**
  - [ ] Document when to use virtualized vs regular tables
  - [ ] Add usage examples
  - [ ] Update AGENTS.md with performance guidelines

- [ ] **Optional: List Virtualization**
  - [ ] Identify other lists that could benefit
  - [ ] Create generic VirtualList component
  - [ ] Apply to relevant components

### Files to Create/Modify
- Create: `src/lib/components/AppVirtualTable.tsx`
- Modify: Existing table components to optionally use virtualization
- Update: Documentation

### Example Implementation
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedTable({ data, columns }) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50, // Estimated row height
    overscan: 5,
  });
  
  const virtualRows = rowVirtualizer.getVirtualItems();
  
  return (
    <Box ref={tableContainerRef} h="500px" overflow="auto">
      <Box h={`${rowVirtualizer.getTotalSize()}px`} position="relative">
        {virtualRows.map(virtualRow => {
          const row = data[virtualRow.index];
          return (
            <Box
              key={virtualRow.key}
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h={`${virtualRow.size}px`}
              transform={`translateY(${virtualRow.start}px)`}
            >
              {/* Render row */}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
```

### Performance Targets
- Support 1000+ rows without significant lag
- Scroll at 60fps
- Initial render < 100ms for visible rows

### References
- [@tanstack/react-virtual documentation](https://tanstack.com/virtual/latest)
- [TanStack Table + Virtual Integration](https://tanstack.com/virtual/latest/docs/framework/react/examples/table)

---

## Implementation Strategy

### Phase 1: Quick Wins (1-2 weeks)
Focus on high-impact, low-complexity items:
1. ✅ Issue #2 - Route-based code splitting (Simple)
2. ✅ Issue #6 - Web Vitals reporting (Simple)
3. ✅ Issue #9 - Bundle analysis tooling (Simple)

### Phase 2: Dependency Updates (1 week)
1. ✅ Issue #1 - Replace react-dnd (Complex, but high priority)

### Phase 3: Code Quality (1-2 weeks)
1. ✅ Issue #4 - Consolidate lazy loading (Moderate)
2. ✅ Issue #13 - Error boundary granularity (Moderate)

### Phase 4: Performance Optimization (2-3 weeks)
**Note**: Measure first, optimize only if needed
1. ⚠️ Issue #3 - useCallback memoization (Only if React Compiler doesn't handle)
2. ⚠️ Issue #5 - React.memo (Only if React Compiler doesn't handle)
3. ⚠️ Issue #8 - useMemo for columns (Only if React Compiler doesn't handle)
4. ✅ Issue #10 - Image lazy loading (Moderate)
5. ✅ Issue #14 - Virtualization (Moderate, if large datasets exist)

### Phase 5: Bundle Optimization (1 week)
1. ✅ Issue #12 - Replace lodash-es (Simple)

---

## Measurement & Success Criteria

### Before Starting
- [ ] Run Lighthouse audit for baseline scores
- [ ] Measure initial bundle size
- [ ] Document current performance metrics
- [ ] Run React DevTools Profiler on key pages

### After Each Phase
- [ ] Re-run Lighthouse audit
- [ ] Compare bundle sizes
- [ ] Measure performance improvements
- [ ] Document changes and impact

### Target Metrics
- **Lighthouse Performance**: > 90
- **Bundle Size**: Reduce by 15-20%
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

---

## Risk Management

### Potential Risks

1. **React Compiler Conflicts**
   - **Risk**: Manual memoization may conflict with React Compiler
   - **Mitigation**: Always test with React Compiler enabled, measure performance impact

2. **Breaking Changes in Migration**
   - **Risk**: Replacing react-dnd could break existing functionality
   - **Mitigation**: Comprehensive testing, feature flags, gradual rollout

3. **Bundle Size Increase**
   - **Risk**: Adding new libraries might increase bundle size
   - **Mitigation**: Use bundle analyzer, tree-shaking, dynamic imports

4. **Over-optimization**
   - **Risk**: Premature optimization adding complexity without benefit
   - **Mitigation**: Always measure first, document performance improvements

### Rollback Plan
- All changes should be in separate commits
- Feature flags for major changes
- Keep old code until new code is verified
- Document rollback procedures

---

## Notes

### React Compiler Considerations
This project uses `babel-plugin-react-compiler` which provides automatic memoization. Before implementing manual optimization (useCallback, React.memo, useMemo):

1. **Check compiler output**: `npm run build` and review compiled code
2. **Use React DevTools Profiler**: Measure actual render performance
3. **Reference debugging guide**: https://react.dev/learn/react-compiler/debugging
4. **Document findings**: Keep notes on whether manual optimization helped

### Development Workflow
1. Create feature branch for each issue
2. Implement changes with tests
3. Run full test suite
4. Update documentation
5. Create PR with before/after metrics
6. Code review and approval
7. Merge to main

### Documentation Updates
Keep these documents updated:
- `AGENTS.md` - Add new patterns and guidelines
- `README.md` - Update features and setup instructions
- This document - Track progress and learnings

---

## Progress Tracking

### Legend
- ⬜ Not started
- 🟦 In progress
- ✅ Completed
- ⏸️ Paused/Blocked
- ❌ Cancelled

### Overall Progress

| Issue | Priority | Status | Assigned To | Target Date | Completed Date |
|-------|----------|--------|-------------|-------------|----------------|
| 1 - Replace react-dnd | 🔴 High | ✅ | Agent | - | 2026-01-13 |
| 2 - Route code splitting | 🟡 Medium | ✅ | Agent | - | 2026-01-13 |
| 3 - useCallback | 🟢 Low | ⬜ | - | - | - |
| 4 - Consolidate lazy loading | 🟡 Medium | ✅ | Agent | - | 2026-01-13 |
| 5 - React.memo | 🟢 Low | ⬜ | - | - | - |
| 6 - Web Vitals | 🟡 Medium | ✅ | Agent | - | 2026-01-13 |
| 8 - useMemo columns | 🟢 Low | ⬜ | - | - | - |
| 9 - Bundle analysis | 🟡 Medium | ✅ | Agent | - | 2026-01-13 |
| 10 - Image lazy loading | 🟡 Medium | ⬜ | - | - | - |
| 12 - Replace lodash-es | 🟢 Low | ⬜ | - | - | - |
| 13 - Error boundaries | 🟡 Medium | ⬜ | - | - | - |
| 14 - Virtualization | 🟡 Medium | ⬜ | - | - | - |

### Phase Completion
- [x] Phase 1: Quick Wins (3/3) ✅ **COMPLETED**
  - [x] Issue 2 - Route code splitting
  - [x] Issue 6 - Web Vitals integration
  - [x] Issue 9 - Bundle analysis tooling
- [x] Phase 2: Dependency Updates (1/1) ✅ **COMPLETED**
  - [x] Issue 1 - Replace react-dnd
- [ ] Phase 3: Code Quality (1/2) 🟦 **IN PROGRESS**
  - [x] Issue 4 - Consolidate lazy loading ✅ **COMPLETED**
  - [ ] Issue 13 - Error boundary granularity
- [ ] Phase 4: Performance Optimization (0/5)
- [ ] Phase 5: Bundle Optimization (0/1)

---

## Appendix

### Useful Commands

```bash
# Development
npm start                    # Start dev server
npm run build               # Production build
npm run preview             # Preview production build

# Analysis
npm run lint                # Run ESLint
npm test                    # Run Cypress E2E tests
npm run analyze             # Bundle analysis (after Issue #9)

# Package Management
npm outdated                # Check for updates
npm update <package>        # Update specific package
npx npm-check-updates       # Check all updates

# Performance
npm run build -- --mode=production  # Production build
# Then analyze bundle in dist/stats.html (after Issue #9)
```

### External Resources

- [React 19 Documentation](https://react.dev/)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Vite Documentation](https://vite.dev/)
- [TanStack Table](https://tanstack.com/table/latest)
- [Chakra UI v3](https://www.chakra-ui.com/)
- [Web Vitals](https://web.dev/vitals/)
- [Performance Budgets](https://web.dev/performance-budgets-101/)

### Contact

For questions or suggestions about this modernization plan, please:
- Open an issue in the repository
- Contact the development team
- Review the AGENTS.md for project guidelines

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-13  
**Next Review**: After Phase 1 completion
