/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    actAsAnonUser(): void;
    navigateViaMenu(title: string | RegExp): void;
    navigateViaRoute(route: string): void;
  }
}
