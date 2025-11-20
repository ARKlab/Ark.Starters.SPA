/*eslint-disable*/
import type { ComponentType, ComponentProps } from "react";
import { lazy, Suspense, useMemo } from "react";

import CenterSpinner from "./centerSpinner";

type LazyLoadProps<C extends ComponentType<any>> = {
  loader: () => Promise<{ default: C }>;
} & Omit<ComponentProps<C>, "ref">;

export default function LazyLoad<C extends ComponentType<any>>({ loader, ...rest }: LazyLoadProps<C>) {
  const Component = useMemo(() => lazy(loader), [loader]);

  return (
    <Suspense fallback={<CenterSpinner />}>
      <Component {...(rest as ComponentProps<C>)} />
    </Suspense>
  );
}
