describe("AppCheckBox", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/componentsTestPage");
  });

  it("shows checkbox elements", () => {
    cy.get("[data-test='checkbox-basic'] [data-test='checkbox-control']").should("exist");
    cy.get("[data-test='checkbox-basic'] [data-test='checkbox-label']").should("contain.text", "Basic Checkbox");
  });

  it("toggles checked state", () => {
    // Initially unchecked
    cy.get("[data-test='checkbox-basic'] [data-test='checkbox-control']").should("not.be.checked");

    // Click to check
    cy.get("[data-test='checkbox-basic'] [data-test='checkbox-control']").click();
    cy.get("[data-test='checkbox-basic'] [data-test='checkbox-control']").should("be.checked");

    // Click to uncheck
    cy.get("[data-test='checkbox-basic'] [data-test='checkbox-control']").click();
    cy.get("[data-test='checkbox-basic'] [data-test='checkbox-control']").should("not.be.checked");
  });

  it("shows title when provided", () => {
    cy.get("[data-test='checkbox-with-title'] [data-test='checkbox-title']")
      .should("exist")
      .and("contain.text", "Checkbox Title");
  });

  it("disabled checkbox cannot be clicked", () => {
    cy.get("[data-test='checkbox-disabled'] [data-test='checkbox-control']").should("be.disabled");
  });

  it("shows error message when invalid", () => {
    cy.get("[data-test='checkbox-invalid'] [data-test='checkbox-error']")
      .should("exist")
      .and("contain.text", "This field is required");
  });

  it("preset checkbox starts checked", () => {
    cy.get("[data-test='checkbox-with-title'] [data-test='checkbox-control']").should("be.checked");
  });
});
