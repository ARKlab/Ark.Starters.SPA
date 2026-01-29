import "@cypress/code-coverage/support"
import "./commands"

afterEach(() => {
  cy.window().then(win => {
    win.rtkq?.resetCache()
    win.msw?.worker.resetHandlers()
  })
})
