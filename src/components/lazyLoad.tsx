/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, ComponentType, lazy, Suspense, useMemo } from "react";
import CenterSpinner from "./centerSpinner";

type Props<C extends ComponentType<any>> = {
    loader: () => Promise<{
        default: C;
    }>;
} & ComponentProps<C>;

function LazyLoad<C extends ComponentType<any>>({
    loader,
    ...props
}: Props<C>) {
    const LazyComponent = useMemo(() => lazy(loader), [loader]);

    return (
        <Suspense fallback={<CenterSpinner />}>
            <LazyComponent {...props} />
        </Suspense>
    );
}

export default LazyLoad;