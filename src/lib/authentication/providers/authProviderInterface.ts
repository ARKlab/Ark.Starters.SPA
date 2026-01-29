/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import type { UserAccountInfo } from "../authTypes"
import { LoginStatus } from "../authTypes"

export interface AuthProvider {
  /**
   * Initializes the authentication module with configuration data,
   * typically fetched from Azure, and stores it in the Redux store.
   */
  init: () => Promise<void>
  /**
   * Initiates the login process.
   */
  login: () => Promise<void>
  /**
   * Initiates the logout process.
   */
  logout: () => Promise<void>
  /**
   * Retrieves the authentication token information
   *  if token is not valid token will be refreshed silently
   * @returns The authentication token information.
   */
  handleLoginRedirect: () => Promise<void>
  getToken: (audience?: string) => Promise<string | null>
  /*
   * Checks whether the current user has the specified permission.
   *
   * @param permission - The permission to check.
   * @returns true if the user has the permission, false otherwise.
   */
  hasPermission: (permission: string, audience?: string) => boolean
  /**
   * Provides information about the current login status,
   * including whether the authentication process is loading, any data retrieved,
   * and any encountered errors.
   */
  getLoginStatus: () => LoginStatus
  /**
   * Provides information about the current token retrieval status,
   * including whether the process is loading, any data retrieved,
   * and any encountered errors.
   */
  getUserDetail: () => Promise<UserAccountInfo | null>
  /*
   * Subscribes to changes in the login status.
   *
   * @param subscriber - The subscriber to notify when the login status changes.
   * @returns A function that unsubscribes the subscriber from further notifications.
   */
  onLoginStatus: (subscriber: (status: LoginStatus) => void) => () => void
}

export class NoopAuthProvider implements AuthProvider {
  async init(): Promise<void> {
    // No initialization needed for a noop provider.
    return
  }

  async login(): Promise<void> {
    // No login process in noop provider.
    console.warn("NoopAuthProvider: login called. No operation performed.")
    return
  }

  async logout(): Promise<void> {
    // No logout process in noop provider.
    console.warn("NoopAuthProvider: logout called. No operation performed.")
    return
  }

  async handleLoginRedirect(): Promise<void> {
    // No login redirect handling in noop provider.
    console.warn("NoopAuthProvider: handleLoginRedirect called. No operation performed.")
    return
  }

  // @ts-expect-error: unused parameter
  async getToken(audience?: string): Promise<string | null> {
    // No token available in noop provider.
    return null
  }

  // @ts-expect-error: unused parameter
  hasPermission(permission: string, audience?: string): boolean {
    // No permissions; always false.
    return false
  }

  getLoginStatus(): LoginStatus {
    // Always not logged in.
    return LoginStatus.NotLogged
  }

  async getUserDetail(): Promise<UserAccountInfo | null> {
    // No user details in noop provider.
    return null
  }

  onLoginStatus(subscriber: (status: LoginStatus) => void): () => void {
    // Immediately notify subscriber with current status.
    subscriber(this.getLoginStatus())
    // Return a no-op unsubscribe function.
    return () => {
      /* */
    }
  }
}
