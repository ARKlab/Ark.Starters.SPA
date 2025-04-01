import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { SeverityLevel } from "@microsoft/applicationinsights-web";
import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";

import { ErrorDisplay } from "../components/errorDisplay";

export const ErrorFallback = () => {
  const error = useRouteError();
  const plugin = useAppInsightsContext();

  useEffect(() => {
    if (error instanceof Error) {
      plugin.trackException({ exception: error, severityLevel: SeverityLevel.Error });
    }
  }
    , [error, plugin]);

  if (isRouteErrorResponse(error)) {
    return <ErrorDisplay name={String(error.status)} message={error.statusText} />;
  } else if (error instanceof Error)
    return <ErrorDisplay name={error.name} message={error.message} stack={error.stack} />;
  else
    return <ErrorDisplay />;
};
