import * as msal from "@azure/msal-browser";
import { NavigationClient } from "@azure/msal-browser";
import { AuthenticationResult, EventMessage, EventType } from "@azure/msal-browser";
import { AuthProvider } from "./authProviderInterface";

import * as R from "ramda";
import { LoginStatus, UserAccountInfo } from "../authTypes";
import { CustomSettingsType } from "../../../global";

export type MSALConfig = {
  msalConfig: msal.Configuration;
  scopes: string[];
};

// this is kind of violation but we need to use react-router-dom navigation to unsure redirects after MSAL redirect works
import { router } from "../../router";

// see https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/performance.md
// see https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/navigation.md
class CustomNavigationClient extends NavigationClient {
    constructor() {
        super();
    }
    
    // This function will be called anytime msal needs to navigate from one page in your application to another
    async navigateInternal(url:string, options: msal.NavigationOptions) {
        // url will be absolute, you will need to parse out the relative path to provide to the history API
      const relativePath = url.replace(window.location.origin, '');
      router.navigate(relativePath, { replace: options.noHistory });

      return false; // this is MANDATORY to ensure that async handling post-login is handled before navigation
    }
}

export class MsalAuthProvider implements AuthProvider {
  private config: MSALConfig;
  private myMSALObj: msal.IPublicClientApplication;
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
        postLogoutRedirectUri: window.origin,
        navigateToLoginRequestUrl: true
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
    };
    this.silentProfileRequest = {
      scopes: scopes,

      forceRefresh: false,
    };
    this.profileRequest = {
      scopes: scopes,
    };
    this.profileRedirectRequest = {
      ...this.profileRequest,
    };

    this.myMSALObj = new msal.PublicClientApplication(this.config.msalConfig);
    this.myMSALObj.addEventCallback((event: EventMessage) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const payload = event.payload as AuthenticationResult;
          const account = payload.account;
          this.myMSALObj.setActiveAccount(account);
          this.idTokenClaims = payload.idTokenClaims;
          this.loginStatus = LoginStatus.Logged;
          this.notifySubscribers();
      }
      
      if (event.eventType === EventType.LOGIN_FAILURE && event.payload) {
          this.idTokenClaims = null;
          this.loginStatus = LoginStatus.Error;
          this.notifySubscribers();
        }
    });
    this.myMSALObj.setNavigationClient(new CustomNavigationClient());
  }
  private notifySubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.loginStatus);
    }
  }
  public async init(): Promise<void> {
    await this.myMSALObj.initialize();
    const accounts = this.myMSALObj.getAllAccounts();
    if (accounts.length > 0) {
        this.myMSALObj.setActiveAccount(accounts[0]);
    }


    await this.getUserDetail();
  }

  public async login(): Promise<void> {
    const itemKey = "msal.interaction.status";
    if (sessionStorage.getItem(itemKey))
    {
        sessionStorage.removeItem(itemKey);
    }
    await this.myMSALObj!.loginRedirect(this.loginRedirectRequest);
  }

  public async logout() {
    return this.myMSALObj!.logoutRedirect();
  }
  public async getToken() {
    return await this.getProfileTokenRedirect();
  }

  public getLoginStatus(): LoginStatus {
    if (this.myMSALObj) {
      return this.loginStatus;
    }
    return LoginStatus.NotLogged;
  }
  public onLoginStatus(subscriber: (status: string) => void) {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }
  public async handleLoginRedirect(): Promise<void> {
    await this.myMSALObj!.handleRedirectPromise();    
  }

  public async getUserDetail(): Promise<UserAccountInfo | null> {
    const account = this.myMSALObj.getActiveAccount();
    if (account)
    {
      const resp = await this.myMSALObj!.acquireTokenSilent(
        this.silentProfileRequest
      );
      if (resp)
      {
        this.idTokenClaims = resp.idTokenClaims;
        this.loginStatus = LoginStatus.Logged;
        this.notifySubscribers();
        
        return { username: account.username } as UserAccountInfo;
      }
    }
    return null;
  }

  public hasPermission(permission: string) {
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

  private async getProfileTokenRedirect(): Promise<string | null> {
    const account = this.myMSALObj.getActiveAccount();

    if (account) {
      this.silentProfileRequest.account = account;
    }
    return this.getTokenRedirect(
      this.silentProfileRequest,
      this.profileRedirectRequest
    );
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
}
