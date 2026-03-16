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

    cy.wait(500)

    cy.then(() => {
      cy.wrap(telemetryPayloads).then(payloads => {
        cy.log(`Total telemetry payloads: ${payloads.length}`)

        let foundAuthUserId = false

        payloads.forEach(payload => {
          const items = Array.isArray(payload) ? payload : [payload]
          items.forEach((item: { tags?: Record<string, string> }) => {
            const tags = item.tags
            if (tags && tags["ai.user.authUserId"] === testUsername) {
              foundAuthUserId = true
              cy.log(`✅ Found ai.user.authUserId = ${tags["ai.user.authUserId"]}`)
            }
          })
        })

        assert.isTrue(
          foundAuthUserId,
          `❌ FAILED: Expected at least one telemetry item with ai.user.authUserId = "${testUsername}". ` +
            "This means setAuthenticatedUserContext is not enriching telemetry correctly.",
        )
      })
    })
  })
})
