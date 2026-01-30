/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from "react"
import { lazy, Suspense } from "react"

import CenterSpinner from "../../components/centerSpinner"

/**
 * createLazyComponent - Factory function approach for static lazy loading
 *
 * Use this when you want to create a reusable lazy-loaded component that
 * doesn't need to change its loader function. This is more efficient for
 * static imports as the lazy component is created once.
 *
 * The returned component is a wrapper that handles Suspense and can accept
 * all props that the original component accepts.
 *
 * @template C - The component type being lazy loaded
 * @param loader - Function that returns a promise resolving to the component module
 * @param fallback - Optional custom fallback to show while loading
 * @returns A component that lazy loads and renders the target component
 *
 * @example
 * // Create a lazy-loaded component
 * const DashboardPage = createLazyComponent(() => import('./DashboardPage'));
 *
 * // Use it like a regular component
 * function App() {
 *   return <DashboardPage userId={123} />;
 * }
 *
 * @example
 * // With custom fallback
 * const HeavyChart = createLazyComponent(
 *   () => import('./HeavyChart'),
 *   <div>Loading chart...</div>
 * );
 */
export function createLazyComponent<C extends ComponentType<any>>(
  loader: () => Promise<{ default: C }>,
  fallback: React.ReactNode = <CenterSpinner />,
) {
  const LazyLoadedComponent = lazy(loader)
  const Wrapped = function LazyWrapper(props: React.ComponentProps<C>) {
    return (
      <Suspense fallback={fallback}>
        <LazyLoadedComponent {...props} />
      </Suspense>
    )
  }

  return Wrapped
}
