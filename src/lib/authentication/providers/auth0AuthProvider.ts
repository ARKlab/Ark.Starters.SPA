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
  private redirectUri: string;

  constructor(config: Auth0AuthProviderConfig) {
    this.redirectUri = config.redirectUri;
    const auth0config: Auth0ClientOptions = {
      domain: config.domain,
      clientId: config.clientID,
      cacheLocation: "localstorage",
      useCookiesForTransactions: true,
      useRefreshTokens: false,
      authorizationParams: {
        redirect_uri: config.redirectUri,
        // audience: config.audience,
        scope: "openid profile email contactInfo",
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

  public async getToken(audience?: string): Promise<string> {
    const claims = await this.auth0Client.getIdTokenClaims();
    if (claims && "__raw" in claims) {
      return claims.__raw;
    }

    if (audience) {
      return this.auth0Client.getTokenSilently({
        authorizationParams: {
          audience: audience,
          scope: "openid profile email contactInfo",
        },
      });
    }

    return this.auth0Client.getTokenSilently();
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

      // Extract just the pathname from the target URL to avoid nested URLs
      let relativePath = target;
      try {
        const targetUrl = new URL(target);
        relativePath = targetUrl.pathname + targetUrl.search + targetUrl.hash;
      } catch {
        // If target is not a full URL, use it as-is (already relative)
        relativePath = target.startsWith("/") ? target : "/" + target;
      }

      await router.navigate(relativePath, { replace: true });
    } catch (e) {
      if (e instanceof Error && e.message.includes("Invalid state")) {
        console.warn("Invalid state detected, clearing auth params and redirecting to home");
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        url.searchParams.delete("error");
        window.history.replaceState({}, document.title, url.pathname);
        await router.navigate("/", { replace: true });
        return;
      }

      this.setLoginStatus(LoginStatus.Error);
      throw e;
    }
  }

  public async getUserDetail(): Promise<UserAccountInfo | null> {
    const currentAccounts = await this.auth0Client.getUser();

    if (!currentAccounts) {
      this.userPermissions = [];
      return null;
    }

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
    this.setLoginStatus(LoginStatus.Logged);
    return {
      username: currentAccounts.name ?? "",
      permissions: permissions,
    } as UserAccountInfo;
  }

  private setLoginStatus(status: LoginStatus) {
    if (this.loginStatus === status) return;

    this.loginStatus = status;
    this.notifySubscribers();
  }
}
