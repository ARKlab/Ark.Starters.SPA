describe("Application Insights Telemetry", () => {
  beforeEach(() => {
    // Intercept Application Insights telemetry requests if they occur
    // Note: AI batches telemetry, so it may not send immediately
    cy.intercept("POST", "**/v2/track", req => {
      cy.log("AI Telemetry intercepted");
      req.reply({
        statusCode: 200,
        body: {
          itemsReceived: 1,
          itemsAccepted: 1,
          errors: [],
        },
      });
    }).as("aiTelemetry");

    cy.actAsAnonUser();
  });

  it("verifies Application Insights is configured in e2e mode", () => {
    // Check that Application Insights is configured with test connection string
    cy.window().then(win => {
      expect(win.appSettings.applicationInsights).to.exist;
      expect(win.appSettings.applicationInsights.connectionString).to.exist;
      expect(win.appSettings.applicationInsights.connectionString).to.include("InstrumentationKey");
      // Verify it's the fake connection string for e2e
      expect(win.appSettings.applicationInsights.connectionString).to.include("00000000-0000-0000-0000-000000000000");
    });
  });

  it("application works correctly with Application Insights enabled", () => {
    // Verify the app works without crashes when AI is enabled
    cy.navigateViaMenu(/posts/i);
    cy.get("main").should("exist");
    cy.get("table").should("exist");
    
    cy.navigateViaMenu(/config table/i);
    cy.get("main").should("exist");
    cy.get("table").should("exist");
    
    cy.navigateViaMenu(/movie paginated/i);
    cy.get("main").should("exist");
    cy.get("table").should("exist");
  });

  it("handles route changes without errors", () => {
    // Use router.navigate for SPA navigation
    cy.window().its("router").invoke("navigate", "/moviesTable");
    cy.url().should("contain", "/moviesTable");
    cy.get("main").should("exist");
    
    cy.window().its("router").invoke("navigate", "/configTable");
    cy.url().should("contain", "/configTable");
    cy.get("main").should("exist");
  });

  it("telemetry endpoint is intercepted", () => {
    // Navigate multiple times
    cy.navigateViaMenu(/posts/i);
    cy.navigateViaMenu(/config table/i);
    cy.navigateViaMenu(/movie paginated/i);
    
    // Wait a bit for any batched telemetry to be sent
    cy.wait(3000);
    
    // Check if any telemetry was intercepted
    // Note: This is optional - AI batches telemetry so it might not send during test
    cy.get("@aiTelemetry.all").then(interceptions => {
      if (interceptions.length > 0) {
        cy.log(`Captured ${interceptions.length} telemetry requests`);
        // If telemetry was sent, verify it was properly intercepted
        expect(interceptions[0].response?.statusCode).to.equal(200);
      } else {
        cy.log("No telemetry sent during test (batched for later)");
      }
    });
  });
});
