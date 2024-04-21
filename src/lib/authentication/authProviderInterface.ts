import type { LoginStatus, UserAccountInfo } from "./authTypes";

type TokenResponse = string | null;
export interface AuthProvider {
  /**
   * Initializes the authentication module with configuration data,
   * typically fetched from Azure, and stores it in the Redux store.
   */
  init: () => Promise<void>;
  /**
   * Initiates the login process.
   */
  login: () => void;
  /**
   * Initiates the logout process.
   */
  logout: () => void;
  /**
   * Retrieves the authentication token information
   *  if token is not valid token will be refreshed silently
   * @returns The authentication token information.
   */
  handleLoginRedirect: () => Promise<void>;
  getToken: (audience?: string) => Promise<TokenResponse>;
  /*
   * Checks whether the current user has the specified permission.
   *
   * @param permission - The permission to check.
   * @returns true if the user has the permission, false otherwise.
   */
  hasPermission: (permission: string, audience?: string) => boolean;
  /**
   * Provides information about the current login status,
   * including whether the authentication process is loading, any data retrieved,
   * and any encountered errors.
   */
  getLoginStatus: () => LoginStatus;
  /**
   * Provides information about the current token retrieval status,
   * including whether the process is loading, any data retrieved,
   * and any encountered errors.
   */
  getUserDetail: () => Promise<UserAccountInfo | null>;
  /*
   * Subscribes to changes in the login status.
   *
   * @param subscriber - The subscriber to notify when the login status changes.
   * @returns A function that unsubscribes the subscriber from further notifications.
   */
  onLoginStatus: (subscriber: (status: LoginStatus) => void) => () => void;
}
