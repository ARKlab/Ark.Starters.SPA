import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { SeverityLevel } from "@microsoft/applicationinsights-web";
import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router";

import { ErrorDisplay } from "./errorDisplay";

const FatalError = ({ error }: { error: Error }) =>
  ErrorDisplay({ message: error.message, name: error.name, stack: error.stack });

export const ErrorBoundary = ({ children }: { children?: React.ReactNode }) => {
  const { pathname, search } = useLocation();
  const plugin = useAppInsightsContext();
  return (
    <ReactErrorBoundary
      FallbackComponent={FatalError}
      resetKeys={[pathname, search]} // reset on navigation, ignoring hash
      onError={(error, info) => {
        plugin.trackException({
          exception: error,
          severityLevel: SeverityLevel.Error,
          properties: info,
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
