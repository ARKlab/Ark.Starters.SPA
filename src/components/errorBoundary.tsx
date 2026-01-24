import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { SeverityLevel } from "@microsoft/applicationinsights-web";
import React from "react";
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useLocation } from "react-router";

import { ErrorDisplay } from "./errorDisplay";

const FatalError = ({ error }: FallbackProps) => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  return ErrorDisplay({ message: errorObj.message, name: errorObj.name, stack: errorObj.stack });
};

export const ErrorBoundary = ({ children }: { children?: React.ReactNode }) => {
  const { pathname, search } = useLocation();
  const plugin = useAppInsightsContext();
  return (
    <ReactErrorBoundary
      FallbackComponent={FatalError}
      resetKeys={[pathname, search]} // reset on navigation, ignoring hash
      onError={(error, info) => {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        plugin.trackException({
          exception: errorObj,
          severityLevel: SeverityLevel.Error,
          properties: info,
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
