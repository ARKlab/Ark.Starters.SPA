import { Progress } from '@chakra-ui/react';
import { QueryStatus } from '@reduxjs/toolkit/query';

import { useAppSelector } from '../../../app/hooks';
import useDebounce from '../../../lib/useDebounce';

type X = {
    queries?: Record<string, { status: QueryStatus } | undefined>;
    mutations?: Record<string, { status: QueryStatus } | undefined>;
}
type S = Record<string, X>

export const GlobalLoadingBar = () => {
    const loading = useAppSelector(s => {
        return Object.values(s as unknown as S)
            .flatMap(x => {
                let r: ({ status: QueryStatus; } | undefined)[] = [];
                if (x.queries) { r = [...r, ...Object.values(x.queries)]; }
                if (x.mutations) { r = [...r, ...Object.values(x.mutations)]; }
                return r;
            })
            .some(q => q?.status === QueryStatus.pending);
    });

    // avoid starting the progress bar if requests take less than 500
    const debounced = useDebounce(loading, 500);

    return (
        <Progress size={'xs'} isIndeterminate={debounced} />
    );
};
