/**
 * E2E tests for GDPR consent functionality
 * Tests the useGDPRConsent hook and cookie management
 */

describe("GDPR Consent", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    // Clear cookies before each test
    cy.clearCookies();
  });

  it("displays GDPR consent dialog on first visit", () => {
    cy.visit("/");
    // Check if consent dialog appears
    cy.get("[data-test='gdpr-consent-dialog']", { timeout: 10000 }).should("be.visible");
  });

  it("allows accepting all cookies", () => {
    cy.visit("/");
    cy.get("[data-test='gdpr-consent-dialog']", { timeout: 10000 }).should("be.visible");
    
    // Click accept all button
    cy.contains("button", /accept.*all/i).click();
    
    // Dialog should close
    cy.get("[data-test='gdpr-consent-dialog']").should("not.exist");
    
    // Check that consent is stored in localStorage
    cy.window().then((win) => {
      const consent = win.localStorage.getItem("GDPR_CONSENT_STATE");
      expect(consent).to.exist;
      const consentState = JSON.parse(consent);
      expect(consentState.necessary).to.be.true;
      expect(consentState.preferences).to.be.true;
      expect(consentState.statistics).to.be.true;
      expect(consentState.marketing).to.be.true;
    });
  });

  it("allows rejecting non-necessary cookies", () => {
    cy.visit("/");
    cy.get("[data-test='gdpr-consent-dialog']", { timeout: 10000 }).should("be.visible");
    
    // Click reject button
    cy.contains("button", /reject/i).click();
    
    // Dialog should close
    cy.get("[data-test='gdpr-consent-dialog']").should("not.exist");
    
    // Check that only necessary cookies are accepted
    cy.window().then((win) => {
      const consent = win.localStorage.getItem("GDPR_CONSENT_STATE");
      expect(consent).to.exist;
      const consentState = JSON.parse(consent);
      expect(consentState.necessary).to.be.true;
      expect(consentState.preferences).to.be.false;
      expect(consentState.statistics).to.be.false;
      expect(consentState.marketing).to.be.false;
    });
  });

  it("allows customizing cookie preferences", () => {
    cy.visit("/");
    cy.get("[data-test='gdpr-consent-dialog']", { timeout: 10000 }).should("be.visible");
    
    // Click customize/settings button if it exists
    cy.contains("button", /customize|settings/i).then(($btn) => {
      if ($btn.length > 0) {
        $btn.click();
        
        // Toggle switches for different cookie types
        cy.get("[data-test='consent-switch-statistics']").click();
        
        // Save preferences
        cy.contains("button", /save|confirm/i).click();
        
        // Check that preferences are saved
        cy.window().then((win) => {
          const consent = win.localStorage.getItem("GDPR_CONSENT_STATE");
          expect(consent).to.exist;
        });
      }
    });
  });

  it("does not show dialog on subsequent visits after consent given", () => {
    // Set consent in localStorage before visit
    cy.window().then((win) => {
      win.localStorage.setItem(
        "GDPR_CONSENT_STATE",
        JSON.stringify({
          necessary: true,
          preferences: true,
          statistics: true,
          marketing: true,
        })
      );
    });
    
    cy.visit("/");
    
    // Dialog should not appear
    cy.get("[data-test='gdpr-consent-dialog']").should("not.exist");
  });
});
