import "@cypress/code-coverage/support";
import "./commands";

afterEach(() => {
  cy.window().then(win => {
    if (win.rtkq) win.rtkq.resetCache();
    if (win.msw) win.msw.worker.resetHandlers();
  });
});
