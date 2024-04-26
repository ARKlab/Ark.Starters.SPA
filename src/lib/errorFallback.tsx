import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { ErrorDisplay } from "../components/errorDisplay";

export const ErrorFallback = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <ErrorDisplay name={String(error.status)} message={error.statusText} />
        );
    } else if (error instanceof Error)
        return (
            <ErrorDisplay
                name={error.name}
                message={error.message}
                stack={error.stack} />
        );
    else return <ErrorDisplay />;
};
