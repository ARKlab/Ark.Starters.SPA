/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentProps, ComponentType } from "react";
import { lazy, Suspense, useMemo } from "react";

import CenterSpinner from "./centerSpinner";

type Props<C extends ComponentType<any>> = ComponentProps<C> & {
  loader: () => Promise<{
    default: C
  }>
}

function LazyLoad<C extends ComponentType<any>>(props: Props<C>) {
  const { loader, ...p } = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const LazyComponent = useMemo(() => lazy(loader), [loader])

  return (
    <Suspense fallback={<CenterSpinner />}>
      <LazyComponent {...p} />
    </Suspense>
  );
}

export default LazyLoad
