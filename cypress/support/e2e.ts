import "@cypress/code-coverage/support";
import "./commands";

beforeEach(() => {
  // debug Cookies
  Cypress.Cookies.debug(true);
  
  // Ignore AbortController errors from RTK Query resetApiState in RTK 2.10+
  // These occur when resetting the cache aborts in-flight requests
  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('abort') && err.message.includes('AbortController')) {
      return false; // Prevent Cypress from failing the test
    }
    return true; // Let other errors fail the test
  });
});

afterEach(() => {
  cy.window().then(win => {
    if (win.rtkq) win.rtkq.resetCache();
    if (win.msw) win.msw.worker.resetHandlers();
  });
});
