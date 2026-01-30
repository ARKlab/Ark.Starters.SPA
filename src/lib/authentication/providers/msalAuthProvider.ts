import type { AuthenticationResult, EventMessage } from "@azure/msal-browser"
import * as msal from "@azure/msal-browser"
import { EventType, NavigationClient } from "@azure/msal-browser"

import { router } from "../../router"
import type { UserAccountInfo } from "../authTypes"
import { LoginStatus } from "../authTypes"

import type { AuthProvider } from "./authProviderInterface"

// this is kind of violation but we need to use react-router navigation to unsure redirects after MSAL redirect works

export type MSALConfig = {
  msalConfig: msal.Configuration
  scopes: string[]
  permissionsClaims: string[]
}

// see https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/performance.md
// see https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/navigation.md
class CustomNavigationClient extends NavigationClient {
  // This function will be called anytime msal needs to navigate from one page in your application to another
  async navigateInternal(url: string, options: msal.NavigationOptions) {
    // url will be absolute, you will need to parse out the relative path to provide to the history API
    const relativePath = url.replace(window.location.origin, "")
    await router.navigate(relativePath, { replace: options.noHistory })

    return false // this is MANDATORY to ensure that async handling post-login is handled before navigation
  }
}

export type MsalAuthProviderConfig = {
  scopes: string
  clientID: string
  authority: string
  knownAuthorities: string
  redirectUri: string
  permissionsClaims: string[]
}

export class MsalAuthProvider implements AuthProvider {
  private config: MSALConfig
  private myMSALObj: msal.IPublicClientApplication
  private loginStatus: LoginStatus = LoginStatus.NotLogged
  private loginRedirectRequest: msal.RedirectRequest
  private loginRequest: msal.PopupRequest
  private silentProfileRequest: msal.SilentRequest
  private profileRequest: msal.PopupRequest
  private profileRedirectRequest: msal.RedirectRequest
  private idTokenClaims: msal.IdTokenClaims | null = null
  private subscribers = new Set<(status: LoginStatus) => void>()

  constructor(config: MsalAuthProviderConfig) {
    const scopes = config.scopes.split(",")
    const msalConfig: msal.Configuration = {
      auth: {
        clientId: config.clientID,
        authority: config.authority,

        knownAuthorities: config.knownAuthorities.split(","),
        redirectUri: config.redirectUri,
        postLogoutRedirectUri: window.origin,
      },
      cache: {
        cacheLocation: "localStorage",
      },
      system: {
        loggerOptions: {
          loggerCallback: (level: msal.LogLevel, message: string, containsPii: boolean): void => {
            if (containsPii) {
              return
            }
            switch (level) {
              case msal.LogLevel.Error:
                console.error(message)
                return
              case msal.LogLevel.Info:
                console.info(message)
                return
              case msal.LogLevel.Verbose:
                console.debug(message)
                return
              case msal.LogLevel.Warning:
                console.warn(message)
                return
            }
          },
          piiLoggingEnabled: false,
        },
      },
    }
    this.config = {
      msalConfig: msalConfig,
      scopes: scopes,
      permissionsClaims: config.permissionsClaims,
    }

    this.loginRequest = {
      scopes: ["openid", "offline_access"],
    }
    this.loginRedirectRequest = {
      ...this.loginRequest,
    }
    this.silentProfileRequest = {
      scopes: scopes,

      forceRefresh: false,
    }
    this.profileRequest = {
      scopes: scopes,
    }
    this.profileRedirectRequest = {
      ...this.profileRequest,
    }

    this.myMSALObj = new msal.PublicClientApplication(this.config.msalConfig)
    this.myMSALObj.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult
        const account = payload.account
        this.myMSALObj.setActiveAccount(account)
        this.idTokenClaims = payload.idTokenClaims
        this.setLoginStatus(LoginStatus.Logged)
      }

      if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE && event.payload) {
        this.idTokenClaims = null
        this.setLoginStatus(LoginStatus.Error)
      }
    })
    this.myMSALObj.setNavigationClient(new CustomNavigationClient())
  }

  private notifySubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.loginStatus)
    }
  }

  private getUserPermissions(): string[] {
    const permissions = [] as string[]
    if (this.idTokenClaims) {
      const claims = this.idTokenClaims as unknown as Record<string, unknown>
      for (const claim of this.config.permissionsClaims) {
        const val = claims[claim]
        const valStr = typeof val === "string" ? val : ""
        const p = valStr.split(" ")
        permissions.push(...p)
      }
    }
    return permissions
  }
  public async init(): Promise<void> {
    await this.myMSALObj.initialize()

    if (!this.myMSALObj.getActiveAccount()) {
      const accounts = this.myMSALObj.getAllAccounts()
      if (accounts.length > 0) {
        this.myMSALObj.setActiveAccount(accounts[0])
      }
    }
  }

  public async login(): Promise<void> {
    // see https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/5807
    const itemKey = "msal.interaction.status"
    if (sessionStorage.getItem(itemKey)) {
      sessionStorage.removeItem(itemKey)
    }
    await this.myMSALObj.loginRedirect(this.loginRedirectRequest)
  }

  public async logout() {
    // see https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/5807
    const itemKey = "msal.interaction.status"

    if (sessionStorage.getItem(itemKey)) {
      sessionStorage.removeItem(itemKey)
    }
    return this.myMSALObj.logoutRedirect()
  }

  public async getToken() {
    return this.getProfileTokenRedirect()
  }

  public getLoginStatus(): LoginStatus {
    return this.loginStatus
  }
  public onLoginStatus(subscriber: (status: LoginStatus) => void) {
    this.subscribers.add(subscriber)
    return () => {
      this.subscribers.delete(subscriber)
    }
  }

  public async handleLoginRedirect(): Promise<void> {
    await this.myMSALObj.handleRedirectPromise()
  }

  public async getUserDetail(): Promise<UserAccountInfo | null> {
    const account = this.myMSALObj.getActiveAccount()
    if (account) {
      try {
        const resp = await this.myMSALObj.acquireTokenSilent(this.silentProfileRequest)

        this.idTokenClaims = resp.idTokenClaims
        this.setLoginStatus(LoginStatus.Logged)
        return {
          username: account.username,
          permissions: this.getUserPermissions(),
        } as UserAccountInfo
      } catch (e) {
        if (e instanceof msal.InteractionRequiredAuthError) return null

        throw e
      }
    }
    return null
  }

  public hasPermission(permission: string) {
    const permissions = this.getUserPermissions()
    return permissions.includes(permission)
  }

  private async getProfileTokenRedirect(): Promise<string | null> {
    const account = this.myMSALObj.getActiveAccount()

    if (account) {
      this.silentProfileRequest.account = account
    }
    return this.getTokenRedirect(this.silentProfileRequest, this.profileRedirectRequest)
  }

  private async getTokenRedirect(
    silentRequest: msal.SilentRequest,
    interactiveRequest: msal.RedirectRequest,
  ): Promise<string | null> {
    try {
      const response = await this.myMSALObj.acquireTokenSilent(silentRequest)

      return response.accessToken
    } catch (e) {
      if (e instanceof msal.InteractionRequiredAuthError) {
        await this.myMSALObj.acquireTokenRedirect(interactiveRequest)
      } else {
        throw new Error("Error getting token from redirect")
      }
    }
    return null
  }

  private setLoginStatus(status: LoginStatus) {
    if (this.loginStatus === status) return

    this.loginStatus = status
    this.notifySubscribers()
  }
}
