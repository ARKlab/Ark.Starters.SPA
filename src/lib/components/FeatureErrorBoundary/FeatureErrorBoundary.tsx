import { Box, Button, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { SeverityLevel } from "@microsoft/applicationinsights-web";
import type { ErrorInfo, ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { LuTriangleAlert } from "react-icons/lu";

import { errorToErrorObject } from "@/lib/errorHandler/errorToErrorObject";

interface FeatureErrorBoundaryProps {
  /**
   * Custom fallback component to render when an error occurs.
   * If not provided, a default fallback UI will be displayed.
   */
  fallback?: ReactNode;
  /**
   * Optional callback function to handle errors.
   * The error is automatically logged to Application Insights.
   */
  onError?: (error: unknown, errorInfo: ErrorInfo) => void;
  /**
   * The child components to render within the error boundary.
   */
  children: ReactNode;
  /**
   * Optional label to identify this error boundary in logs and UI.
   * Useful for debugging which feature failed.
   */
  featureLabel?: string;
}

interface DefaultFallbackProps extends FallbackProps {
  featureLabel?: string;
}

function DefaultFallback({ error, resetErrorBoundary, featureLabel }: DefaultFallbackProps) {
  const { t } = useTranslation("libComponents");
  const errorObj = errorToErrorObject(error);

  return (
    <Box p={"4"} bg="error.subtle" borderRadius="md" border="xs" borderColor="error.emphasized">
      <VStack align="start" gap={"3"}>
        <HStack gap={"2"}>
          <LuTriangleAlert size={"20"} color="var(--chakra-colors-error-fg)" />
          <Heading as="h3" size="sm" color="error.fg">
            {featureLabel
              ? t("featureErrorBoundary_errorInFeature", { feature: featureLabel })
              : t("featureErrorBoundary_errorOccurred")}
          </Heading>
        </HStack>
        <Text fontSize="sm" color="error.fg">
          {errorObj.message ? errorObj.message : t("featureErrorBoundary_unexpectedError")}
        </Text>
        <Button onClick={resetErrorBoundary} size="sm" colorPalette="error" variant="outline">
          {t("featureErrorBoundary_tryAgain")}
        </Button>
      </VStack>
    </Box>
  );
}

/**
 * FeatureErrorBoundary provides isolated error handling for feature components.
 *
 * This component wraps feature-level UI (tables, forms, widgets) to prevent
 * errors from crashing the entire application. Errors are isolated to the
 * specific feature and logged to Application Insights.
 *
 * @example
 * ```tsx
 * <FeatureErrorBoundary featureLabel="User Table">
 *   <UserTable />
 * </FeatureErrorBoundary>
 * ```
 *
 * @example Custom fallback
 * ```tsx
 * <FeatureErrorBoundary
 *   featureLabel="Dashboard Widget"
 *   fallback={<CustomErrorMessage />}
 * >
 *   <DashboardWidget />
 * </FeatureErrorBoundary>
 * ```
 */
export function FeatureErrorBoundary({
  fallback,
  onError,
  children,
  featureLabel,
}: FeatureErrorBoundaryProps) {
  const appInsights = useAppInsightsContext();

  const handleError = (error: unknown, errorInfo: ErrorInfo) => {
    const errorObj = errorToErrorObject(error);
    // Log to Application Insights
    appInsights.trackException({
      exception: errorObj,
      severityLevel: SeverityLevel.Error,
      properties: {
        componentStack: errorInfo.componentStack,
        featureLabel: featureLabel ?? "Unknown Feature",
        errorBoundaryType: "FeatureErrorBoundary",
      },
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  const renderFallback = ({ error, resetErrorBoundary }: FallbackProps): ReactNode =>
    fallback ?? (
      <DefaultFallback error={error} resetErrorBoundary={resetErrorBoundary} featureLabel={featureLabel} />
    );

  return (
    <ReactErrorBoundary fallbackRender={renderFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
}
