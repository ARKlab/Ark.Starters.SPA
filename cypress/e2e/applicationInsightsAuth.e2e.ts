describe("Application Insights - Authenticated User Context", () => {
  const testUsername = "test.user@example.com"
  let telemetryPayloads: unknown[] = []

  beforeEach(() => {
    telemetryPayloads = []

    cy.intercept("POST", /\/v2\/track/, req => {
      const body = req.body
      let parsedBody: unknown = body

      if (typeof body === "string") {
        const trimmedBody = body.trim()
        try {
          parsedBody = JSON.parse(trimmedBody) as unknown
        } catch {
          const lines = trimmedBody
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0)
          const parsedLines: unknown[] = []
          for (const line of lines) {
            try {
              parsedLines.push(JSON.parse(line) as unknown)
            } catch {
              parsedLines.push(line)
            }
          }
          parsedBody = parsedLines.length > 0 ? parsedLines : body
        }
      }

      telemetryPayloads.push(parsedBody)
      req.reply({ statusCode: 200, body: { itemsReceived: 1, itemsAccepted: 1, errors: [] } })
    }).as("aiTelemetry")

    cy.actAsLoggedUser(testUsername)

    // AppInsights is loaded asynchronously after cookie consent — wait for it
    cy.window().its("appInsights", { timeout: 10000 }).should("exist")
  })

  it("sets authenticated user context on Application Insights when user is logged in", () => {
    cy.window().then(win => {
      assert.isDefined(win.appInsights, "appInsights should be available on window")
      assert.equal(
        win.appInsights?.context?.user?.authenticatedId,
        testUsername,
        "Application Insights authenticatedId should match the logged-in username",
      )
    })
  })

  it("enriches telemetry with authenticated user ID tag", () => {
    cy.window()
      .its("appInsights")
      .then(appInsights => {
        appInsights.trackEvent({ name: "AuthenticatedUserTelemetryTest" })

        return new Cypress.Promise<void>(resolve => {
          void appInsights.flush(true, () => {
            resolve()
          })
        })
      })

    // Use a retryable assertion instead of a fixed cy.wait(500) so that
    // Cypress keeps checking until the intercepted telemetry payload arrives.
    // This eliminates flakiness caused by timing differences in CI.
    cy.wrap(null, { timeout: 10000 }).should(() => {
      const foundItem = telemetryPayloads.some(payload => {
        const items = Array.isArray(payload) ? payload : [payload]
        return items.some(
          (item: { tags?: Record<string, string> }) =>
            item.tags?.["ai.user.authUserId"] === testUsername,
        )
      })

      expect(
        foundItem,
        `Expected at least one telemetry item with ai.user.authUserId = "${testUsername}". ` +
          "This means setAuthenticatedUserContext is not enriching telemetry correctly.",
      ).to.be.true
    })
  })
})
