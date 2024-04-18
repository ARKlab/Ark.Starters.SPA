import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ErrorDisplay } from './errorDisplay';
import { useLocation } from 'react-router-dom';

const FatalError = ({ error }: { error: Error }) =>
    ErrorDisplay({ ...error });

export const ErrorBoundary = ({ children }: { children?: React.ReactNode }) => {

    const { pathname, search } = useLocation();
    return (
        <ReactErrorBoundary
            FallbackComponent={FatalError}
            resetKeys={[pathname, search]} // reset on navigation, ignoring hash
        >
            {children}
        </ReactErrorBoundary>
    );
}