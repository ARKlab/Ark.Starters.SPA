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
    // Navigate to multiple routes to test auto route tracking
    const routes = [
      { menu: /posts/i, expectedInUrl: "jsonplaceholder", testName: "Posts" },
      { menu: /config table/i, expectedInUrl: "configTable", testName: "Config Table" },
      { menu: /movie paginated/i, expectedInUrl: "moviesTable", testName: "Movies Table" },
    ];

    // Perform navigations - each should trigger a page view event
    routes.forEach((route, index) => {
      cy.log(`Navigating to route ${index + 1}/${routes.length}: ${route.testName}`);
      cy.navigateViaMenu(route.menu);
      cy.url().should("contain", route.expectedInUrl);
      cy.get("main").should("exist");
      // Small delay between navigations to ensure each triggers its own page view
      cy.wait(200);
    });
    
    // Give Application Insights time to process route changes
    cy.wait(500);
    
    // Now manually track a test event and flush to verify the SDK can send telemetry
    cy.window().then(win => {
      assert.isDefined(win.appInsights, "window.appInsights should be defined in e2e mode");
      
      if (win.appInsights) {
        // Manually track a custom event to verify SDK is functional
        win.appInsights.trackEvent({ name: "CypressTestMarker" });
        
        // Flush Application Insights with increased timeout
        // Use async flush (false) which is more reliable for batch sending
        return new Cypress.Promise<void>((resolve) => {
          void win.appInsights.flush(false, () => {
            // Extended callback wait to ensure all telemetry is sent
            setTimeout(resolve, 2000);
          });
        });
      }
    }).then(() => {
      // Additional wait for network requests to complete
      cy.wait(1000);
    }).then(() => {
      // Now analyze the intercepted telemetry
      cy.wrap(telemetryPayloads).then(payloads => {
        cy.log(`=== Application Insights Telemetry Analysis ===`);
        cy.log(`Total HTTP requests intercepted: ${payloads.length}`);
        
        // Parse and categorize all telemetry items
        let pageViewCount = 0;
        let eventCount = 0;
        let otherCount = 0;
        const pageViewUrls: string[] = [];

        payloads.forEach(payload => {
          // Handle both array and single item payloads
          const items = Array.isArray(payload) ? payload : [payload];
          
          items.forEach((item: { 
            name?: string; 
            baseType?: string;
            data?: {
              baseData?: {
                uri?: string;
                name?: string;
              };
            };
          }) => {
            if (
              item.name === "Microsoft.ApplicationInsights.PageView" ||
              item.baseType === "PageviewData"
            ) {
              pageViewCount++;
              const url = item.data?.baseData?.uri || item.data?.baseData?.name || "unknown";
              pageViewUrls.push(url);
              cy.log(`  Page View ${pageViewCount}: ${url}`);
            } else if (
              item.name === "Microsoft.ApplicationInsights.Event" ||
              item.baseType === "EventData"
            ) {
              eventCount++;
              const eventName = item.data?.baseData?.name || "unknown";
              cy.log(`  Event: ${eventName}`);
            } else {
              otherCount++;
            }
          });
        });

        cy.log(`Page Views: ${pageViewCount}`);
        cy.log(`Events: ${eventCount}`);
        cy.log(`Other telemetry: ${otherCount}`);

        // CRITICAL ASSERTIONS - These validate that auto route tracking works
        assert.isAtLeast(
          payloads.length, 
          1,
          "❌ FAILED: No telemetry requests were intercepted. " +
          "Application Insights is not sending any data. Check SDK configuration and network settings."
        );
        
        assert.isAtLeast(
          pageViewCount,
          routes.length,
          `❌ FAILED: Expected at least ${routes.length} page views (one per navigation), but got ${pageViewCount}. ` +
          "This means Application Insights auto route tracking is NOT working correctly with React Router. " +
          "Check that enableAutoRouteTracking is true and ReactPlugin is properly integrated."
        );
        
        cy.log(`✅ SUCCESS: Application Insights auto route tracking is working!`);
        cy.log(`✅ Tracked ${pageViewCount} page views for ${routes.length} route navigations`);
      });
    });
  });
});
