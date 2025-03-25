import "@cypress/code-coverage/support";
import "./commands";

beforeEach(() => {
  // debug Cookies
  Cypress.Cookies.debug(true);

  // cy.intercept middleware to remove 'if-none-match' headers from all requests
  // to prevent the server from returning cached responses of API requests
  cy.intercept({ url: "*", middleware: true }, req => delete req.headers["if-none-match"]);

  cy.visit("/null");
  cy.window({ timeout: 20000 }).should("have.property", "appReady", true);
  cy.get("[data-test='spinner']").should("not.exist");
});

afterEach(() => {
  cy.window().then(win => {
    if (win.rtkq) win.rtkq.resetCache();
    if (win.msw) win.msw.worker.resetHandlers();
  });
});
