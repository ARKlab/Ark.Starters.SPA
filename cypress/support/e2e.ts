import "@cypress/code-coverage/support";
import "./commands";

// Ignore AbortController errors from RTK Query resetApiState in RTK 2.10+
// These occur when resetting the cache aborts in-flight requests
// See: https://github.com/reduxjs/redux-toolkit/releases/tag/v2.9.2
Cypress.on('uncaught:exception', (err) => {
  // Check for AbortController "Illegal invocation" errors
  // We check for both messages as the error can be worded differently across browsers
  if (err.message.includes('Illegal invocation') || err.message.includes('abort')) {
    // Log for debugging but don't fail the test
    console.warn('Suppressed AbortController error during test cleanup:', err.message);
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
