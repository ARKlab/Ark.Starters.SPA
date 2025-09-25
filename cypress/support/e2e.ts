import "@cypress/code-coverage/support";
import "./commands";

beforeEach(() => {
  // debug Cookies
  Cypress.Cookies.debug(true);
});

afterEach(() => {
  cy.window().then(win => {
    if (win.rtkq) win.rtkq.resetCache();
    if (win.msw) win.msw.worker.resetHandlers();
  });
});
