/* eslint-disable */
import type { IClickAnalyticsConfiguration } from "@microsoft/applicationinsights-clickanalytics-js";
import { ClickAnalyticsPlugin } from "@microsoft/applicationinsights-clickanalytics-js";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import type { ITelemetryPlugin } from "@microsoft/applicationinsights-web";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

// eslint-disable-next-line import/no-unresolved
import { sha, abbreviatedSha, tag, lastTag } from "~build/git";
// eslint-disable-next-line import/no-unresolved
import { version, name } from "~build/package";

import type { ApplicationInsightsConfig } from "./types";

const versionString = "v" + (version === "0.0.0" ? (tag ?? lastTag ?? version) : version) + "@" + abbreviatedSha;

export const reactPlugin = new ReactPlugin();

export const setupAppInsights = ({ connectionString, enableClickAnalytics }: ApplicationInsightsConfig) => {
  const clickAnalyticsPlugin = new ClickAnalyticsPlugin();
  const appInsights = new ApplicationInsights({
    config: {
      connectionString: connectionString,
      enableAutoRouteTracking: true,
      autoTrackPageVisitTime: true,
      enableCorsCorrelation: true,

      // long-running pages with polling are considered "common" in SPA, thus don't limit the number of ajax calls
      maxAjaxCallsPerView: -1,
      enableAjaxPerfTracking: true,
      enableUnhandledPromiseRejectionTracking: true,

      // this is required to ensure by-default GDPR compliance is satisfied
      // TODO: enable this when the GDPR consent is accepted using appInsights.getCookieMgr().enable()
      disableCookiesUsage: true,

      extensions: ([reactPlugin] as ITelemetryPlugin[]).concat(...(enableClickAnalytics ? [clickAnalyticsPlugin] : [])),
      extensionConfig: {
        [clickAnalyticsPlugin.identifier]: {
          autoCapture: true,
          urlCollectQuery: true,
          urlCollectHash: true,
          dataTags: { useDefaultContentNameOrId: true },
        } as IClickAnalyticsConfiguration,
      },
    },
  });

  appInsights.addTelemetryInitializer(envelope => {
    envelope.data ??= {};
    envelope.data["app.name"] = name;
    envelope.data["app.version"] = versionString;
    envelope.data["app.sha"] = sha;
  });

  appInsights.loadAppInsights();
  return { appInsights, reactPlugin, clickAnalyticsPlugin };
};
