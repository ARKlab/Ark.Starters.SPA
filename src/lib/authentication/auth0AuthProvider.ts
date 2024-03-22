import { Auth0Client, RedirectLoginOptions } from "@auth0/auth0-spa-js";
import { AuthProvider } from "./authProviderInterface";
import { LoginStatus, Auth0Config, UserAccountInfo } from "./authTypes";
import { Auth0ClientOptions } from "@auth0/auth0-spa-js";

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

const claimsUrl = "";
export class Auth0AuthProvider implements AuthProvider {
  private loginStatus: LoginStatus = LoginStatus.NotLogged;
  private auth0Client: Auth0Client = {} as any;
  private config: Auth0Config;

  constructor(config: any) {
    this.config = { auth0Config: config };
  }
  async init() {
    // Initialize authentication module
    let auth0Instance: Auth0Client;
    await (auth0Instance = new Auth0Client(this.config.auth0Config));
    this.auth0Client = auth0Instance;
  }

  async login(): Promise<void> {
    await this.auth0Client.loginWithRedirect({
      appState: { targetUrl: window.location.origin },
    });
  }

  logout(): void {
    const options: any = {
      returnTo: window.location.origin, // Redirect to the application's homepage after logout
    };
    this.auth0Client.logout(options);
  }

  async getToken() {
    var token = await this.auth0Client?.getTokenSilently();
    // Retrieves the authentication token information
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
          await this.auth0Client.handleRedirectCallback().then(() => {
            this.setLoginStatus(LoginStatus.Logged);
          });
        } catch (error) {
          console.debug("Error during login redirection:", error);
        }
      } else {
        await this.login();
      }
    }
  }
  public async getUserDetail(): Promise<UserAccountInfo | null> {
    const currentAccounts = await this.auth0Client.getUser();
    const claims = await this.auth0Client.getIdTokenClaims();
    const groups = claims && claims[claimsUrl + "groups"];
    const permissions = claims && claims[claimsUrl + "permissions"];
    console.log("Claims", claims);

    if (currentAccounts === null) {
      return null;
    } else {
      return {
        username: currentAccounts?.name || "",
        permissions: permissions,
        groups: groups,
      } as UserAccountInfo;
    }
  }
  public hasPermission(permission: string, audience?: string): boolean {
    // Checks whether the current user has the specified permission
    this.auth0Client.getIdTokenClaims().then((claims) => {
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
