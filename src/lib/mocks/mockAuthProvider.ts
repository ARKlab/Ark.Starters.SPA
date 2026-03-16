import type { UserAccountInfo } from "../authentication/authTypes"
import { LoginStatus } from "../authentication/authTypes"
import type { AuthProvider } from "../authentication/providers/authProviderInterface"

/**
 * Mock auth provider for e2e tests.
 * Returns the user from `window.e2eUser` when set, otherwise behaves like NoopAuthProvider.
 * Set `window.e2eUser` via `cy.visit` `onBeforeLoad` to simulate a logged-in user.
 */
export class MockAuthProvider implements AuthProvider {
  init(): Promise<void> {
    return Promise.resolve()
  }

  login(): Promise<void> {
    return Promise.resolve()
  }

  logout(): Promise<void> {
    return Promise.resolve()
  }

  handleLoginRedirect(): Promise<void> {
    return Promise.resolve()
  }

  getToken(_audience?: string): Promise<string | null> {
    return Promise.resolve(null)
  }

  hasPermission(_permission: string, _audience?: string): boolean {
    return false
  }

  getLoginStatus(): LoginStatus {
    return window.e2eUser ? LoginStatus.Logged : LoginStatus.NotLogged
  }

  getUserDetail(): Promise<UserAccountInfo | null> {
    return Promise.resolve(window.e2eUser ?? null)
  }

  onLoginStatus(subscriber: (status: LoginStatus) => void): () => void {
    subscriber(this.getLoginStatus())
    return () => {
      /* */
    }
  }
}
