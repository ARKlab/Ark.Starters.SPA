import "@cypress/code-coverage/support";
import "./commands";

beforeEach(() => {
  // debug Cookies
  Cypress.Cookies.debug(true);
  cy.visit("/null");
  cy.window({ timeout: 20000 }).should("have.property", "appReady", true);
  cy.get("[data-role='spinner']").should("not.exist");
});

afterEach(() => {
  cy.window().then(win => {
    if (win.rtkq) {
      win.rtkq.resetCache();
    }
  });
});
