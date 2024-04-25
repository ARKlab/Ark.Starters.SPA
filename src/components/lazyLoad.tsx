/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Spinner } from "@chakra-ui/react";
import { ComponentProps, ComponentType, lazy, Suspense, useMemo } from "react";

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
        <Suspense fallback={<Flex direction={'column'} align={'center'} justifyContent={'center'} gap={'1ch'} ><Spinner /></Flex>}>
            <LazyComponent {...props} />
        </Suspense>
    );
}

export default LazyLoad;