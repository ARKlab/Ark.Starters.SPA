import { Auth0Client, Auth0ClientOptions } from "@auth0/auth0-spa-js";
import { CustomSettingsType } from "../../global";
import { AuthProvider } from "./authProviderInterface";
import { LoginStatus, UserAccountInfo } from "./authTypes";

const claimsUrl = "http://ark-energy.eu/claims/";

export type Auth0Config = {
  auth0Config: Auth0ClientOptions;
};

export class Auth0AuthProvider implements AuthProvider {
  private loginStatus: LoginStatus = LoginStatus.NotLogged;
  private auth0Client: Auth0Client = {} as any;
  private config: Auth0Config;

  constructor(env: CustomSettingsType) {
    const config: Auth0ClientOptions = {
      domain: env.domain,
      clientId: env.clientID,
      cacheLocation: "localstorage",
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: env.audience,
        scope: "openid profile email",
      },
    };
    this.config = { auth0Config: config };
  }
  async init() {
    // Initialize authentication module
    let auth0Instance: Auth0Client;
    await (auth0Instance = new Auth0Client(this.config.auth0Config));
    this.auth0Client = auth0Instance;
  }

  async login(): Promise<void> {
    await this.auth0Client.loginWithRedirect();
  }

  logout(): void {
    const options: any = {
      returnTo: window.location.origin, // Redirect to the application's homepage after logout
    };
    this.auth0Client.logout(options);
  }

  async getToken() {
    var token = await this.auth0Client?.getTokenSilently();

    return token;
  }
  async isAuthenticated(): Promise<boolean> {
    try {
      return await this.auth0Client.isAuthenticated();
    } catch (error) {
      return false;
    }
  }
  async handleLoginRedirect(): Promise<void> {
    if (await this.isAuthenticated()) {
      this.setLoginStatus(LoginStatus.Logged);
    } else {
      const query = window.location.search;

      if (query.includes("code=") && query.includes("state=")) {
        try {
          await this.auth0Client.handleRedirectCallback().then((result) => {
            this.setLoginStatus(LoginStatus.Logged);
            window.location.pathname =
              result.appState && result.appState.targetUrl
                ? result.appState.targetUrl
                : "/";
          });
        } catch (error) {
          throw error;
        }
      }
    }
  }
  public async getUserDetail(): Promise<UserAccountInfo | null> {
    const currentAccounts = await this.auth0Client.getUser();
    const claims = await this.auth0Client.getIdTokenClaims();
    const groups = claims && claims[claimsUrl + "groups"];
    const permissions = claims && claims[claimsUrl + "permissions"];

    if (currentAccounts === null) {
      return null;
    } else {
      this.setLoginStatus(LoginStatus.Logged);
      return {
        username: currentAccounts?.name || "",
        permissions: permissions,
        groups: groups,
      } as UserAccountInfo;
    }
  }
  public hasPermission(permission: string, audience?: string): boolean {
    // Checks whether the current user has the specified permission
    this.auth0Client.getIdTokenClaims().then((claims: any) => {
      const permissions = claims && claims[claimsUrl + "permissions"];
      return permissions.includes(permission);
    });
    return false;
  }

  getLoginStatus(): LoginStatus {
    return this.loginStatus;
  }

  setLoginStatus(status: LoginStatus) {
    return (this.loginStatus = status);
  }
}

export default Auth0AuthProvider;
