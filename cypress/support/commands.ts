import "@testing-library/cypress/add-commands";
import "cypress-localstorage-commands";
import "cypress-wait-until";

Cypress.Commands.add("actAsAnonUser", () => {
  cy.session(
    "acceptedCookies",
    () => {
      cy.visit("/null");
      cy.window({ timeout: 30000 }).should("have.property", "appReady", true);
      cy.get("[data-test='spinner']").should("not.exist");

      cy.get("[data-test='gdpr-acceptAll']").should("be.visible");
      cy.get("[data-test='gdpr-acceptAll']").click();
    },
    {
      validate: () => {
        cy.getLocalStorage("GDPR_CONSENT_STATE").then(x => expect(x).not.be.null);
      },
      cacheAcrossSpecs: true,
    },
  );

  cy.visit("/null");
  cy.window({ timeout: 30000 }).should("have.property", "appReady", true);
  cy.get("[data-test='spinner']").should("not.exist");
});

Cypress.Commands.add("navigateViaMenu", (title: string | RegExp) => {
  // CANNOT use cy.visit() as that cause a full reload, not a SPA Navigation ...
  // - full page reload, resets the MSW mocks
  // - Solution: use the menu system
  // - Alternative: find a way to hook into the inner 'history'
  // see: https://github.com/cypress-io/cypress/issues/128
  cy.get("nav a").contains(title).parents("a").click();
  cy.title().should("match", title);
  cy.get("[data-test='spinner']").should("not.exist");
});

Cypress.Commands.add("navigateViaRoute", (route: string) => {
  // CANNOT use cy.visit() as that cause a full reload, not a SPA Navigation ...
  // - full page reload, resets the MSW mocks
  // - Solution: use the menu system
  // - Alternative: find a way to hook into the inner 'history'
  // see: https://github.com/cypress-io/cypress/issues/128
  cy.window().its("router").invoke("navigate", route);
  cy.url().should("contain", route);
  cy.get("[data-test='spinner']").should("not.exist");
});

// Custom command for dragging elements with @dnd-kit using PointerSensor
// Based on: https://github.com/clauderic/dnd-kit/issues/208#issuecomment-1881057616
Cypress.Commands.add(
  "dragTo",
  {
    prevSubject: "element",
  },
  (subject, targetSelector: string, options?: { delay?: number }) => {
    cy.wrap(subject, { log: false })
      .then(source => {
        const sourceRect = source.get(0).getBoundingClientRect();
        
        return cy.get(targetSelector).then(target => {
          const targetRect = target.get(0).getBoundingClientRect();
          
          // Calculate center positions
          const sourceCenterX = sourceRect.left + sourceRect.width / 2;
          const sourceCenterY = sourceRect.top + sourceRect.height / 2;
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;
          
          // Perform drag operation using pointer events
          cy.wrap(source)
            .trigger("pointerdown", {
              force: true,
              isPrimary: true,
              button: 0,
              clientX: sourceCenterX,
              clientY: sourceCenterY,
            })
            .wait(options?.delay || 100)
            .trigger("pointermove", {
              force: true,
              isPrimary: true,
              button: 0,
              clientX: targetCenterX,
              clientY: targetCenterY,
            })
            .wait(100)
            .trigger("pointerup", {
              force: true,
              isPrimary: true,
              button: 0,
              clientX: targetCenterX,
              clientY: targetCenterY,
            })
            .wait(250);
        });
      });
  },
);


