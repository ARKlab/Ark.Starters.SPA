/**
 * Lazy Loading Utilities
 * 
 * This module provides utilities for lazy loading React components with Suspense.
 * 
 * ## Available Utilities:
 * 
 * ### LazyComponent
 * Component-based approach for dynamic lazy loading with props.
 * Use when the loader function might change or when passing props dynamically.
 * 
 * ### createLazyComponent
 * Factory function approach for static lazy loading.
 * Use when creating a reusable lazy-loaded component with a fixed loader.
 * 
 * @example
 * ```tsx
 * // Component-based approach
 * import { LazyComponent } from "@/lib/components/lazy";
 * 
 * <LazyComponent 
 *   loader={() => import('./DynamicPage')} 
 *   userId={123}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Factory function approach
 * import { createLazyComponent } from "@/lib/components/lazy";
 * 
 * const Dashboard = createLazyComponent(() => import('./Dashboard'));
 * 
 * function App() {
 *   return <Dashboard userId={123} />;
 * }
 * ```
 */

export { LazyComponent } from "./LazyComponent";
export { createLazyComponent } from "./createLazyComponent";
