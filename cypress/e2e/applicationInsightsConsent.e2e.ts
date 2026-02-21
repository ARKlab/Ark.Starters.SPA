describe("Application Insights GDPR Consent", () => {
  let telemetryPayloads: unknown[] = []

  beforeEach(() => {
    telemetryPayloads = []

    // Intercept Application Insights telemetry requests
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
      req.reply({
        statusCode: 200,
        body: { itemsReceived: 1, itemsAccepted: 1, errors: [] },
      })
    }).as("aiTelemetry")
  })

  it("does not send telemetry before cookie consent is given", () => {
    // Visit without any prior consent
    cy.visit("/null", {
      onBeforeLoad: win => {
        win.localStorage.removeItem("GDPR_CONSENT_STATE")
      },
    })
    cy.window({ timeout: 30000 }).should("have.property", "appReady", true)

    // GDPR dialog should be visible
    cy.get("[data-test='gdpr-acceptAll']").should("be.visible")

    // Try to trigger telemetry manually - should be blocked
    cy.window()
      .its("appInsights")
      .then(appInsights => {
        appInsights.trackEvent({ name: "ShouldBeBlocked" })
        return new Cypress.Promise<void>(resolve => {
          void appInsights.flush(true, () => {
            resolve()
          })
        })
      })

    cy.wait(500)
    cy.then(() => {
      expect(telemetryPayloads).to.have.length(
        0,
        "No telemetry should be sent before cookie consent",
      )
    })
  })

  it("enables telemetry after accepting all cookies", () => {
    // Visit without any prior consent
    cy.visit("/null", {
      onBeforeLoad: win => {
        win.localStorage.removeItem("GDPR_CONSENT_STATE")
      },
    })
    cy.window({ timeout: 30000 }).should("have.property", "appReady", true)

    // Accept all cookies
    cy.get("[data-test='gdpr-acceptAll']").should("be.visible")
    cy.get("[data-test='gdpr-acceptAll']").click()

    // Navigate to generate page view telemetry
    cy.navigateViaMenu(/posts/i)
    cy.wait(500)

    // Send a test event and flush
    cy.window()
      .its("appInsights")
      .then(appInsights => {
        appInsights.trackEvent({ name: "ConsentAcceptedTest" })
        return new Cypress.Promise<void>(resolve => {
          void appInsights.flush(true, () => {
            resolve()
          })
        })
      })

    // Wait for telemetry to be sent and then verify
    cy.wait(500)
    cy.then(() => {
      expect(telemetryPayloads.length).to.be.greaterThan(
        0,
        "Telemetry should be sent after accepting cookies",
      )
    })
  })

  it("does not send telemetry after rejecting cookies", () => {
    // Visit without any prior consent
    cy.visit("/null", {
      onBeforeLoad: win => {
        win.localStorage.removeItem("GDPR_CONSENT_STATE")
      },
    })
    cy.window({ timeout: 30000 }).should("have.property", "appReady", true)

    // Reject cookies (only necessary)
    cy.get("[data-test='gdpr-reject']").should("be.visible")
    cy.get("[data-test='gdpr-reject']").click()

    // Wait for consent hook to process
    cy.wait(500)

    // Try to trigger telemetry - should still be blocked
    cy.window()
      .its("appInsights")
      .then(appInsights => {
        appInsights.trackEvent({ name: "ShouldBeBlockedAfterReject" })
        return new Cypress.Promise<void>(resolve => {
          void appInsights.flush(true, () => {
            resolve()
          })
        })
      })

    cy.wait(500)
    cy.then(() => {
      expect(telemetryPayloads).to.have.length(
        0,
        "No telemetry should be sent after rejecting cookies",
      )
    })
  })
})
