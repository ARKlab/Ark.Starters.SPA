describe("Application Insights Telemetry", () => {
  let telemetryPayloads: unknown[] = [];

  beforeEach(() => {
    // Reset telemetry collection
    telemetryPayloads = [];

    // Intercept Application Insights telemetry requests and collect payloads
    cy.intercept("POST", "**/v2/track", req => {
      // Store the request body for later inspection
      const body = req.body;
      telemetryPayloads.push(body);
      
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
      // Verify AI is configured
      assert.isDefined(win.appSettings.applicationInsights, "Application Insights should be configured");
      assert.isDefined(win.appSettings.applicationInsights.connectionString, "Connection string should be defined");
      
      // Verify it includes the instrumentation key
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

  it("tracks all route changes and verifies telemetry count", () => {
    // Navigate to multiple routes
    const routes = [
      { menu: /posts/i, expectedInUrl: "jsonplaceholder" },
      { menu: /config table/i, expectedInUrl: "configTable" },
      { menu: /movie paginated/i, expectedInUrl: "moviesTable" },
    ];

    // Perform navigations
    routes.forEach(route => {
      cy.navigateViaMenu(route.menu);
      cy.url().should("contain", route.expectedInUrl);
      cy.get("main").should("exist");
    });
    
    // Flush Application Insights telemetry to ensure all events are sent
    cy.window().then(win => {
      // Verify appInsights exists
      assert.isDefined(win.appInsights, "window.appInsights should be defined in e2e mode");
      
      if (win.appInsights) {
        // Call flush to send all batched telemetry immediately
        // Return promise to ensure flush completes before continuing
        return new Cypress.Promise<void>((resolve) => {
          void win.appInsights.flush(false, () => {
            // Callback when flush completes
            // Wait a bit for network requests to actually be sent
            setTimeout(resolve, 500);
          });
        });
      }
    }).then(() => {
      // Wait a moment to ensure all telemetry has been intercepted
      cy.wait(100);
    }).then(() => {
      // Analyze the telemetry payloads collected in the intercept
      cy.wrap(telemetryPayloads).then(payloads => {
        cy.log(`Total telemetry requests: ${payloads.length}`);
        
        // Count telemetry items by type
        let pageViewCount = 0;
        let otherCount = 0;

        payloads.forEach(payload => {
          // Handle both array and single item payloads
          const items = Array.isArray(payload) ? payload : [payload];
          
          items.forEach((item: { name?: string; baseType?: string }) => {
            if (
              item.name === "Microsoft.ApplicationInsights.PageView" ||
              item.baseType === "PageviewData"
            ) {
              pageViewCount++;
            } else {
              otherCount++;
            }
          });
        });

        cy.log(`Page view telemetries: ${pageViewCount}`);
        cy.log(`Other telemetries: ${otherCount}`);

        // Verify we got telemetry for route changes
        // We navigated to 3 routes, so we should have at least 3 page views
        // (could be more due to initial page load)
        expect(pageViewCount).to.be.at.least(routes.length, 
          `Should have at least ${routes.length} page view telemetries for ${routes.length} route navigations`);
      });
    });
  });
});
