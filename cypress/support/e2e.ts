import "@cypress/code-coverage/support";
import "./commands";

// Ignore AbortController errors from RTK Query resetApiState in RTK 2.10+
// These occur when resetting the cache aborts in-flight requests
Cypress.on('uncaught:exception', (err) => {
  // Check for AbortController "Illegal invocation" errors
  if (err.message.includes('Illegal invocation') || err.message.includes('abort')) {
    return false; // Prevent Cypress from failing the test
  }
  return true; // Let other errors fail the test
});

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
