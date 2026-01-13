/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, ComponentProps } from "react";
import { lazy, Suspense, useMemo } from "react";

import CenterSpinner from "../../components/centerSpinner";

/**
 * Props for the LazyComponent
 */
type LazyComponentProps<C extends ComponentType<any>> = {
  /**
   * Function that returns a promise resolving to a module with a default export
   */
  loader: () => Promise<{ default: C }>;
  /**
   * Optional custom fallback to show while loading
   * @default CenterSpinner
   */
  fallback?: React.ReactNode;
} & Omit<ComponentProps<C>, "ref">;

/**
 * LazyComponent - Component-based approach for dynamic lazy loading
 * 
 * Use this when you need to lazy load a component with dynamic props or when
 * the loader function might change over time.
 * 
 * The component is memoized based on the loader function to prevent
 * unnecessary re-creation of the lazy component.
 * 
 * @template C - The component type being lazy loaded
 * @param props - LazyComponentProps including loader and component props
 * @returns A lazy-loaded component wrapped in Suspense
 * 
 * @example
 * // Dynamic lazy loading with props (Component-based)
 * function RouteExample() {
 *   return (
 *     <LazyComponent 
 *       loader={() => import('./DynamicPage')} 
 *       userId={123}
 *       onLoad={handleLoad}
 *     />
 *   );
 * }
 * 
 * @example
 * // With custom fallback
 * <LazyComponent 
 *   loader={() => import('./MyComponent')}
 *   fallback={<div>Loading...</div>}
 * />
 */
export function LazyComponent<C extends ComponentType<any>>({
  loader,
  fallback = <CenterSpinner />,
  ...rest
}: LazyComponentProps<C>) {
  const Component = useMemo(() => lazy(loader), [loader]);

  return (
    <Suspense fallback={fallback}>
      <Component {...(rest as ComponentProps<C>)} />
    </Suspense>
  );
}
