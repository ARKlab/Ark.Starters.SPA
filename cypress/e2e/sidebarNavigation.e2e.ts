/**
 * E2E tests for sidebar navigation and drawer functionality
 * Tests the sideBar component, drawer open/close, and navigation
 */

describe("Sidebar Navigation", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/");
  });

  it("displays sidebar on desktop", () => {
    // Set viewport to desktop size
    cy.viewport(1280, 1000);
    
    // Sidebar should be visible
    cy.get("[data-test='sidebar']").should("be.visible");
  });

  it("displays menu items in sidebar", () => {
    cy.viewport(1280, 1000);
    
    // Check for common menu items
    cy.get("[data-test='sidebar']").within(() => {
      cy.contains(/components/i).should("exist");
      cy.contains(/config table/i).should("exist");
    });
  });

  it("opens drawer on mobile when menu button clicked", () => {
    // Set viewport to mobile size
    cy.viewport(375, 667);
    
    // Sidebar should not be visible initially
    cy.get("[data-test='sidebar']").should("not.be.visible");
    
    // Click hamburger menu button
    cy.get("[data-test='menu-button']").click();
    
    // Drawer should open
    cy.get("[data-test='sidebar-drawer']").should("be.visible");
  });

  it("closes drawer when close button is clicked", () => {
    cy.viewport(375, 667);
    
    // Open drawer
    cy.get("[data-test='menu-button']").click();
    cy.get("[data-test='sidebar-drawer']").should("be.visible");
    
    // Click close button
    cy.get("[data-test='drawer-close-button']").click();
    
    // Drawer should close
    cy.get("[data-test='sidebar-drawer']").should("not.be.visible");
  });

  it("closes drawer after clicking a menu item on mobile", () => {
    cy.viewport(375, 667);
    
    // Open drawer
    cy.get("[data-test='menu-button']").click();
    cy.get("[data-test='sidebar-drawer']").should("be.visible");
    
    // Click a menu item
    cy.get("[data-test='sidebar-drawer']").within(() => {
      cy.contains(/components/i).click();
    });
    
    // Wait for navigation
    cy.wait(500);
    
    // Drawer should close after navigation
    cy.get("[data-test='sidebar-drawer']").should("not.be.visible");
  });

  it("highlights active menu item", () => {
    cy.viewport(1280, 1000);
    
    // Navigate to a specific page
    cy.visit("/configTable");
    
    // The corresponding menu item should be highlighted/active
    cy.get("[data-test='sidebar']").within(() => {
      cy.contains(/config table/i).parents("[data-test='menu-item']").should("have.attr", "data-active", "true");
    });
  });

  it("expands accordion for nested menu items", () => {
    cy.viewport(1280, 1000);
    
    // Look for expandable menu sections
    cy.get("[data-test='sidebar']").within(() => {
      cy.get("[data-test='accordion-trigger']").first().then(($trigger) => {
        if ($trigger.length > 0) {
          // Click to expand
          $trigger.click();
          
          // Check that content is visible
          cy.get("[data-test='accordion-content']").should("be.visible");
        }
      });
    });
  });

  it("maintains drawer closed state when viewport size changes from mobile to desktop", () => {
    // Start mobile with closed drawer
    cy.viewport(375, 667);
    cy.get("[data-test='sidebar']").should("not.be.visible");
    
    // Resize to desktop
    cy.viewport(1280, 1000);
    
    // Desktop sidebar should be visible
    cy.get("[data-test='sidebar']").should("be.visible");
  });
});
