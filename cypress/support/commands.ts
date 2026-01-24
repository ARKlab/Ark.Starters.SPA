import "@testing-library/cypress/add-commands";
import "cypress-localstorage-commands";
import "cypress-wait-until";
import "cypress-real-events";

Cypress.Commands.add("actAsAnonUser", () => {
  cy.session(
    "acceptedCookies",
    () => {
      cy.visit("/null");
      cy.window({ timeout: 30000 }).should("have.property", "appReady", true);
      cy.get("[data-test='spinner']").should("not.exist");

      cy.get("[data-test='gdpr-acceptAll']").should("be.visible");
      cy.get("[data-test='gdpr-acceptAll']").click();
    },
    {
      validate: () => {
        cy.getLocalStorage("GDPR_CONSENT_STATE").then(x => expect(x).not.to.be.null);
      },
      cacheAcrossSpecs: true,
    },
  );

  cy.visit("/null");
  cy.window({ timeout: 30000 }).should("have.property", "appReady", true);
  cy.get("[data-test='spinner']").should("not.exist");
});

Cypress.Commands.add("navigateViaMenu", (title: string | RegExp) => {
  // CANNOT use cy.visit() as that cause a full reload, not a SPA Navigation ...
  // - full page reload, resets the MSW mocks
  // - Solution: use the menu system
  // - Alternative: find a way to hook into the inner 'history'
  // see: https://github.com/cypress-io/cypress/issues/128
  cy.get("nav a").contains(title).parents("a").click();
  cy.title().should("match", title);
  cy.get("[data-test='spinner']").should("not.exist");
});

Cypress.Commands.add("navigateViaRoute", (route: string) => {
  // CANNOT use cy.visit() as that cause a full reload, not a SPA Navigation ...
  // - full page reload, resets the MSW mocks
  // - Solution: use the menu system
  // - Alternative: find a way to hook into the inner 'history'
  // see: https://github.com/cypress-io/cypress/issues/128
  cy.window().its("router").invoke("navigate", route);
  cy.url().should("contain", route);
  cy.get("[data-test='spinner']").should("not.exist");
});
