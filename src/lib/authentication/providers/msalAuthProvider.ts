import * as msal from "@azure/msal-browser";
import { AccountInfo } from "@azure/msal-browser";

import * as R from "ramda";
import { AuthProvider } from "./authProviderInterface";
import { LoginStatus, UserAccountInfo } from "../authTypes";
import { CustomSettingsType } from "../../../global";

export type MSALConfig = {
  msalConfig: msal.Configuration;
  scopes: string[];
};

export class MsalAuthProvider implements AuthProvider {
  private config: MSALConfig;
  private account: AccountInfo | null;
  private myMSALObj?: msal.IPublicClientApplication;
  private loginStatus: LoginStatus = LoginStatus.NotLogged;
  private loginRedirectRequest: msal.RedirectRequest;
  private loginRequest: msal.PopupRequest;
  private silentProfileRequest: msal.SilentRequest;
  private profileRequest: msal.PopupRequest;
  private profileRedirectRequest: msal.RedirectRequest;
  private idTokenClaims: msal.IdTokenClaims | null = null;
  private subscribers = new Set<(status: string) => void>();

  constructor(env: CustomSettingsType) {
    const scopes = env.scopes.split(",");
    const config: msal.Configuration = {
      auth: {
        clientId: env.clientID,
        authority: env.authority,
        knownAuthorities: env.knownAuthorities.split(","),
        redirectUri: env.redirectUri,
      },
      cache: {
        cacheLocation: "localStorage",
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
    this.config = { msalConfig: config, scopes: scopes };

    this.loginRequest = {
      scopes: ["openid", "offline_access"],
    };
    this.loginRedirectRequest = {
      ...this.loginRequest,

      redirectStartPage: window.location.href,
    };
    this.account = null;
    this.silentProfileRequest = {
      scopes: scopes,

      forceRefresh: false,
    };
    this.profileRequest = {
      scopes: scopes,
    };
    this.profileRedirectRequest = {
      ...this.profileRequest,
      redirectStartPage: window.location.href,
    };
  }
  private notifySubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.loginStatus);
    }
  }
  private async getTokenRedirect(
    silentRequest: msal.SilentRequest,
    interactiveRequest: msal.RedirectRequest
  ): Promise<string | null> {
    try {
      const response = await this.myMSALObj!.acquireTokenSilent(silentRequest);

      return response.accessToken;
    } catch (e) {
      if (e instanceof msal.InteractionRequiredAuthError) {
        this.myMSALObj!.acquireTokenRedirect(interactiveRequest).catch((e) => {
          throw new Error(e);
        });
      } else {
        throw new Error("Error getting token from redirect");
      }
    }
    return null;
  }

  private handleResponse(response: msal.AuthenticationResult | null) {
    if (response !== null) {
      this.account = response.account;
    } else {
      const accounts = this.getAccounts();

      this.account = accounts ? accounts[0] : null;
    }
  }
  public async getUserDetail(): Promise<UserAccountInfo | null> {
    const currentAccounts = this.myMSALObj!.getAllAccounts();
    if (currentAccounts === null || currentAccounts.length === 0) {
      return null;
    } else {
      this.loginStatus = LoginStatus.Logged;
      this.notifySubscribers();
      this.myMSALObj!.setActiveAccount(currentAccounts[0]);
      const resp = await this.myMSALObj!.acquireTokenSilent(
        this.silentProfileRequest
      );
      this.idTokenClaims = resp.idTokenClaims;
      return { username: currentAccounts[0].username } as UserAccountInfo;
    }
  }

  private getAccounts(): AccountInfo[] | null {
    const currentAccounts = this.myMSALObj!.getAllAccounts();
    if (currentAccounts === null) {
      return null;
    } else {
      return currentAccounts;
    }
  }
  public async handleLoginRedirect(): Promise<void> {
    try {
      const resp: msal.AuthenticationResult | null =
        await this.myMSALObj!.handleRedirectPromise();
      if (resp) {
        const account = this.myMSALObj!.getAllAccounts();
        if (account.length === 0) {
          await this.login();
        } else {
          this.handleResponse(resp);
        }
      }
    } catch (e) {
      throw new Error(String(e));
    }
  }
  async getProfileTokenRedirect(): Promise<string | null> {
    if (this.account) {
      this.silentProfileRequest.account = this.account;
    }
    return this.getTokenRedirect(
      this.silentProfileRequest,
      this.profileRedirectRequest
    );
  }
  public async init(): Promise<void> {
    this.myMSALObj =
      await msal.PublicClientApplication.createPublicClientApplication(
        this.config.msalConfig
      );
  }
  public async login(): Promise<void> {
    try {
      await this.myMSALObj!.loginRedirect(this.loginRedirectRequest);
    } catch (e) {
      throw new Error(e as string);
    }
  }
  logout() {
    return this.myMSALObj!.logoutRedirect();
  }
  async getToken() {
    return await this.getProfileTokenRedirect();
  }
  hasPermission(permission: string) {
    if (this.idTokenClaims) {
      const permissions = R.pathOr(
        "",
        ["extension_Scope"],
        this.idTokenClaims
      ).split(" ");
      return permissions.includes(permission);
    }
    return false;
  }
  getLoginStatus(): LoginStatus {
    if (this.myMSALObj) {
      const isLoggedIn = this.myMSALObj.getAllAccounts().length > 0;
      this.loginStatus = isLoggedIn
        ? LoginStatus.Logged
        : LoginStatus.NotLogged;
      this.notifySubscribers();

      return this.loginStatus;
    }
    return LoginStatus.NotLogged;
  }
  onLoginStatus(subscriber: (status: string) => void) {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }
}
