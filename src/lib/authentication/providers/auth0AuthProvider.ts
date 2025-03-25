import type { Auth0ClientOptions } from "@auth0/auth0-spa-js";
import { Auth0Client } from "@auth0/auth0-spa-js";

import { router } from "../../router";
import type { UserAccountInfo } from "../authTypes";
import { LoginStatus } from "../authTypes";

// this is kind of violation but we need to use react-router navigation to unsure redirects after MSAL redirect works
import type { AuthProvider } from "./authProviderInterface";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export const hasAuthParams = (): boolean => {
  const searchParams = window.location.search;
  return (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) && STATE_RE.test(searchParams);
};

export type Auth0Config = {
  auth0Config: Auth0ClientOptions;
  permissionsClaims?: string[];
};

type AppState = {
  targetUrl?: string;
};

export type Auth0AuthProviderConfig = {
  domain: string;
  clientID: string;
  redirectUri: string;
  audience: string;
  permissionsClaims?: string[];
};

export class Auth0AuthProvider implements AuthProvider {
  private loginStatus: LoginStatus = LoginStatus.NotLogged;
  private subscribers = new Set<(status: LoginStatus) => void>();

  private auth0Client: Auth0Client;
  private config: Auth0Config;
  private userPermissions: string[] = [];

  constructor(config: Auth0AuthProviderConfig) {
    const auth0config: Auth0ClientOptions = {
      domain: config.domain,
      clientId: config.clientID,
      cacheLocation: "localstorage",
      useCookiesForTransactions: true,
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: config.redirectUri,
        audience: config.audience,
        scope: "openid profile email",
      },
    };
    this.config = {
      auth0Config: auth0config,
      permissionsClaims: config.permissionsClaims,
    };
    this.auth0Client = new Auth0Client(this.config.auth0Config);
  }
  private notifySubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.loginStatus);
    }
  }
  public hasPermission(permission: string): boolean {
    // Checks whether the current user has the specified permission
    const permissions = this.userPermissions;
    return permissions.includes(permission);
  }
  public async init() {
    if (hasAuthParams()) {
      await this.handleLoginRedirect();
    } else {
      await this.auth0Client.checkSession();
    }
    if (await this.auth0Client.isAuthenticated()) {
      await this.getUserDetail();
    }
  }

  public async login() {
    await this.auth0Client.loginWithRedirect<AppState>({
      appState: {
        targetUrl: window.location.href,
      },
    });
  }

  public async logout() {
    await this.auth0Client.logout();
  }

  public async getToken() {
    const token = await this.auth0Client.getTokenSilently();

    return token;
  }
  public getLoginStatus(): LoginStatus {
    return this.loginStatus;
  }
  public onLoginStatus(subscriber: (status: LoginStatus) => void) {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }
  public async handleLoginRedirect(): Promise<void> {
    let target = "/";

    try {
      const result = await this.auth0Client.handleRedirectCallback<AppState>();
      target = result.appState?.targetUrl ?? "/";
      const relativePath = target.replace(window.location.origin, "");
      await router.navigate(relativePath, { replace: true });
    } catch (e) {
      this.setLoginStatus(LoginStatus.Error);
      throw e;
    }
  }

  public async getUserDetail(): Promise<UserAccountInfo | null> {
    const currentAccounts = await this.auth0Client.getUser();
    const claims = await this.auth0Client.getIdTokenClaims();

    const permissions = [] as string[];
    if (this.config.permissionsClaims) {
      for (const claim of this.config.permissionsClaims) {
        const claimValue = claims?.[claim];
        if (claimValue) {
          if (Array.isArray(claimValue)) {
            const p = claimValue.map(p => new String(p).valueOf());
            permissions.push(...p);
          } else if (typeof claimValue === "string") {
            permissions.push(...claimValue.split(" "));
          }
        }
      }
    }

    this.userPermissions = permissions;

    if (!currentAccounts) {
      return null;
    } else {
      this.setLoginStatus(LoginStatus.Logged);
      return {
        username: currentAccounts.name ?? "",
        permissions: permissions,
      } as UserAccountInfo;
    }
  }

  //PRIVATE METHODS
  private setLoginStatus(status: LoginStatus) {
    this.loginStatus = status;
    this.notifySubscribers();
  }
}
