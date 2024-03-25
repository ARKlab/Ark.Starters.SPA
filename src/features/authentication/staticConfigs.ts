import * as msal from "@azure/msal-browser";
import { Auth0ClientOptions } from "@auth0/auth0-spa-js";

//MSAL
export const scopes = [""];
export const staticMsalConfig: msal.Configuration = {
  auth: {
    clientId: "",
    authority: "",

    knownAuthorities: [""],
    redirectUri: "http://localhost:3000/",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: msal.LogLevel,
        message: string,
        containsPii: boolean
      ): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case msal.LogLevel.Error:
            console.error(message);
            return;
          case msal.LogLevel.Info:
            console.info(message);
            return;
          case msal.LogLevel.Verbose:
            console.debug(message);
            return;
          case msal.LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    asyncPopups: false,
  },
};

//AUT0

export const audience = "";
export const authConfig: Auth0ClientOptions = {
  domain: "",
  clientId: "",
  cacheLocation: "localstorage",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: audience,
    scope: "openid profile email",
  },
};
export const baseurl = "";
