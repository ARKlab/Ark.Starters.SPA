/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from "react";
import { lazy, Suspense } from "react";

import CenterSpinner from "./centerSpinner";

export function createLazyComponent<C extends ComponentType<any>>(loader: () => Promise<{ default: C }>) {
  const LazyComponent = lazy(loader);
  const Wrapped = function LazyWrapper(props: React.ComponentProps<C>) {
    return (
      <Suspense fallback={<CenterSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  return Wrapped;
}
