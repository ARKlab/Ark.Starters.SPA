import type { Auth0ClientOptions } from "@auth0/auth0-spa-js";
import { Auth0Client } from "@auth0/auth0-spa-js";
import { z } from "zod";

import type { CustomSettingsType } from "../../../config/global";
import { router } from "../../router";
import type { UserAccountInfo } from "../authTypes";
import { LoginStatus } from "../authTypes";

// this is kind of violation but we need to use react-router-dom navigation to unsure redirects after MSAL redirect works
import type { AuthProvider } from "./authProviderInterface";

const claimsUrl = "http://ark-energy.eu/claims/";
const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) && STATE_RE.test(searchParams);

export type Auth0Config = {
  auth0Config: Auth0ClientOptions;
};

type AppState = {
  targetUrl?: string;
};

export class Auth0AuthProvider implements AuthProvider {
  private loginStatus: LoginStatus = LoginStatus.NotLogged;
  private subscribers = new Set<(status: LoginStatus) => void>();

  private auth0Client: Auth0Client;
  private config: Auth0Config;
  private userPermissions: string[] = [];

  constructor(env: CustomSettingsType) {
    const config: Auth0ClientOptions = {
      domain: env.domain,
      clientId: env.clientID,
      cacheLocation: "localstorage",
      useCookiesForTransactions: true,
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: env.redirectUri,
        audience: env.audience,
        scope: "openid profile email",
      },
    };
    this.config = { auth0Config: config };
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
    await this.isAuthenticated();
    if (hasAuthParams()) {
      await this.handleLoginRedirect();
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
      this.setLoginStatus(LoginStatus.Logged);
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
    const groups = claims && claims[claimsUrl + "groups"];
    const permissions = claims && claims[claimsUrl + "permissions"];
    this.userPermissions = permissions || [];

    if (!currentAccounts) {
      return null;
    } else {
      this.setLoginStatus(LoginStatus.Logged);
      return {
        username: currentAccounts.name || "",
        permissions: permissions,
        groups: groups,
      } as UserAccountInfo;
    }
  }

  private async getUserPermissions(): Promise<string[]> {
    const claims = await this.auth0Client.getIdTokenClaims();
    const k = claimsUrl + "permissions";
    const mappedClaims = z.record(z.enum([k]), z.array(z.string()).optional()).parse(claims);

    return mappedClaims[k] || [];
  }

  //PRIVATE METHODS
  private setLoginStatus(status: LoginStatus) {
    this.loginStatus = status;
    this.notifySubscribers();
  }
  private async isAuthenticated(): Promise<boolean> {
    try {
      return await this.auth0Client.isAuthenticated();
    } catch (error) {
      return false;
    }
  }
}
