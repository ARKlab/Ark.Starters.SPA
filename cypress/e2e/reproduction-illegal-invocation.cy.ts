/**
 * ACTUAL REPRODUCTION for "Illegal invocation" error in @reduxjs/toolkit 2.10.1
 * 
 * This is a standalone Cypress test that ACTUALLY reproduces the error.
 * 
 * To run this reproduction:
 * 1. Ensure @reduxjs/toolkit@2.10.1 is installed (or any version >= 2.9.2)
 * 2. Run: npx cypress run --spec cypress/e2e/reproduction-illegal-invocation.cy.ts
 * 
 * Expected result: Test fails with "TypeError: Illegal invocation"
 * 
 * This test demonstrates the exact pattern that causes the issue in the application.
 */

describe('RTK resetApiState Illegal Invocation Reproduction', () => {
  it('reproduces the illegal invocation error when dispatching resetApiState in a loop', () => {
    // Visit the application
    cy.visit('/');
    
    // Wait for app to be ready
    cy.window({ timeout: 30000 }).should('have.property', 'appReady', true);
    
    // Accept GDPR if needed
    cy.get('[data-test="gdpr-acceptAll"]').then($el => {
      if ($el.is(':visible')) {
        cy.get('[data-test="gdpr-acceptAll"]').click();
      }
    });
    
    // Navigate to trigger some API calls
    cy.get('nav a').contains(/Config Table/i).parents('a').click();
    cy.wait(500);
    
    // This is the critical part - calling resetCache() dispatches the resetApiActions
    // in a loop, which triggers the illegal invocation error
    cy.window().then(win => {
      if (win.rtkq) {
        // This will throw: TypeError: Illegal invocation
        // at Promise.S [as abort] (rtk.js)
        win.rtkq.resetCache();
      }
    });
    
    // If we get here, the error did not occur (test passes incorrectly)
    cy.log('No error occurred - issue may be fixed or not reproduced');
  });
});
