import type { UserAccountInfo } from "../authentication/authTypes"
import { LoginStatus } from "../authentication/authTypes"
import type { AuthProvider } from "../authentication/providers/authProviderInterface"

/**
 * Mock auth provider for e2e tests.
 * Returns the user from `window.e2eUser` when set, otherwise behaves like NoopAuthProvider.
 * Set `window.e2eUser` via `cy.visit` `onBeforeLoad` to simulate a logged-in user.
 */
export class MockAuthProvider implements AuthProvider {
  async init(): Promise<void> {
    return
  }

  async login(): Promise<void> {
    return
  }

  async logout(): Promise<void> {
    return
  }

  async handleLoginRedirect(): Promise<void> {
    return
  }

  async getToken(_audience?: string): Promise<string | null> {
    return null
  }

  hasPermission(_permission: string, _audience?: string): boolean {
    return false
  }

  getLoginStatus(): LoginStatus {
    return window.e2eUser ? LoginStatus.Logged : LoginStatus.NotLogged
  }

  async getUserDetail(): Promise<UserAccountInfo | null> {
    return window.e2eUser ?? null
  }

  onLoginStatus(subscriber: (status: LoginStatus) => void): () => void {
    subscriber(this.getLoginStatus())
    return () => {
      /* */
    }
  }
}
