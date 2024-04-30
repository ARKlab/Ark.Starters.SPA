import type { Auth0ClientOptions } from "@auth0/auth0-spa-js";
import { Auth0Client } from "@auth0/auth0-spa-js";

import type { CustomSettingsType } from "../../../global";
import { router } from "../../router";
import type { UserAccountInfo } from "../authTypes";
import { LoginStatus } from "../authTypes";


// this is kind of violation but we need to use react-router-dom navigation to unsure redirects after MSAL redirect works
import type { AuthProvider } from "./authProviderInterface";

const claimsUrl = "http://ark-energy.eu/claims/";


export type Auth0Config = {
  auth0Config: Auth0ClientOptions
}

export class Auth0AuthProvider implements AuthProvider {
  private loginStatus: LoginStatus = LoginStatus.NotLogged
  private subscribers = new Set<(status: LoginStatus) => void>()

  private auth0Client: Auth0Client
  private config: Auth0Config

  constructor(env: CustomSettingsType) {
    const config: Auth0ClientOptions = {
      domain: env.domain,
      clientId: env.clientID,
      cacheLocation: 'localstorage',
      authorizationParams: {
        redirect_uri: env.redirectUri,
        audience: env.audience,
        scope: 'openid profile email',
      },
    };
    this.config = { auth0Config: config };
    this.auth0Client = new Auth0Client(this.config.auth0Config);
  }
  private notifySubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.loginStatus)
    }
  }
  public async init() {}

  public async login() {
    await this.auth0Client?.loginWithRedirect();
  }

  public logout(): void {
    this.auth0Client?.logout();
  }

  public async getToken() {
    const token = await this.auth0Client?.getTokenSilently();

    return token
  }
  public getLoginStatus(): LoginStatus {
    return this.loginStatus;
  }
  public onLoginStatus(subscriber: (status: LoginStatus) => void) {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber)
    }
  }
  public async handleLoginRedirect(): Promise<void> {
    let target = "/";

    if (await this.isAuthenticated()) {
      this.setLoginStatus(LoginStatus.Logged)
    } else {
      const query = window.location.search

      if (query.includes("code=") && query.includes("state=")) {
        // TODO: and if the handleRedirect fails?
        await this.auth0Client.handleRedirectCallback().then((result) => {
          this.setLoginStatus(LoginStatus.Logged);
          target = result.appState?.targetUrl ?? "/";
        });
      }
    }
    
    const relativePath = target.replace(window.location.origin, '');
    router.navigate(relativePath, { replace: true });
  }
  
  public async getUserDetail(): Promise<UserAccountInfo | null> {
    const currentAccounts = await this.auth0Client.getUser()
    const claims = await this.auth0Client.getIdTokenClaims()
    const groups = claims && claims[claimsUrl + 'groups']
    const permissions = claims && claims[claimsUrl + 'permissions']

    if (!currentAccounts) {
      return null
    } else {
      this.setLoginStatus(LoginStatus.Logged)
      return {
        username: currentAccounts?.name || '',
        permissions: permissions,
        groups: groups,
      } as UserAccountInfo
    }
  }
  public hasPermission(permission: string): boolean {
     
    // Checks whether the current user has the specified permission
    this.auth0Client.getIdTokenClaims().then((claims) => {
      const permissions = claims && claims[claimsUrl + 'permissions']
      return permissions.includes(permission)
    })
    return false
  }
  //PRIVATE METHODS
  private setLoginStatus(status: LoginStatus) {
    this.loginStatus = status;
    this.notifySubscribers();
  }
  private async isAuthenticated(): Promise<boolean> {
    try {
      return await this.auth0Client?.isAuthenticated();
    } catch (error) {
      return false;
    }
  }
}

export default Auth0AuthProvider
