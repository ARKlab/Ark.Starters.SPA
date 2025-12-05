describe("AppCheckBox", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/componentsTestPage");
  });

  it("shows checkbox elements", () => {
    cy.get("[data-test='checkbox-basic']").within(() => {
      cy.get("[data-test='checkbox-control']").should("exist");
      cy.get("[data-test='checkbox-hidden-input']").should("exist");
      cy.get("[data-test='checkbox-label']").should("contain.text", "Basic Checkbox");
    });
  });

  it("toggles checked state", () => {
    cy.get("[data-test='checkbox-basic']").within(() => {
      cy.get("[data-test='checkbox-control']").as("control");

      cy.get("@control").should("have.attr", "data-state", "unchecked");
      cy.get("@control").click();
      cy.get("@control").should("have.attr", "data-state", "checked");
      cy.get("@control").click();
      cy.get("@control").should("have.attr", "data-state", "unchecked");
    });
  });

  it("shows title when provided", () => {
    cy.get("[data-test='checkbox-with-title']").within(() => {
      cy.get("[data-test='checkbox-title']").should("contain.text", "Checkbox Title");
    });
  });

  it("disabled checkbox cannot be clicked", () => {
    cy.get("[data-test='checkbox-disabled']").within(() => {
      cy.get("[data-test='checkbox-control']").as("control");

      cy.get("@control").should("have.attr", "data-disabled");
      cy.get("@control").click({ force: true });
      cy.get("@control").should("have.attr", "data-state", "unchecked");
    });
  });

  it("shows error message when invalid", () => {
    cy.get("[data-test='checkbox-invalid']").within(() => {
      cy.get("[data-test='checkbox-error']").should("contain.text", "This field is required");
    });
  });

  it("preset checkbox starts checked", () => {
    cy.get("[data-test='checkbox-with-title']").within(() => {
      cy.get("[data-test='checkbox-control']").should("have.attr", "data-state", "checked");
    });
  });
});
