/// <reference types="cypress" />
/// <reference types="cypress-real-events" />

declare namespace Cypress {
  interface Chainable {
    actAsAnonUser(): void
    navigateViaMenu(title: string | RegExp): void
    navigateViaRoute(route: string): void
  }
}
