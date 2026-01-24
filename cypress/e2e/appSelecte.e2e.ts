describe("AppSelect", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/componentsTestPage");
  });

  function openBasic() {
    cy.get("[data-test='appselect-basic'] [data-test='appselect-trigger']").click();
    cy.get("[data-test='appselect-content'][data-state='open']").as("openContent");
  }

  it("opens and selects option Bravo", () => {
    openBasic();
    cy.get("@openContent").find("[data-test='appselect-item-b']").first().click();
    cy.get("[data-test='appselect-basic'] [data-test='appselect-value']").should(
      "contain.text",
      "Bravo",
    );
    cy.get("[data-test='appselect-basic-value']").should("contain.text", "b");
  });

  it("does not select disabled option Charlie", () => {
    openBasic();
    cy.get("@openContent")
      .find("[data-test='appselect-item-c']")
      .should("have.attr", "aria-disabled", "true")
      .click({ force: true });
    cy.get("[data-test='appselect-basic'] [data-test='appselect-value']").should(
      "not.contain.text",
      "Charlie",
    );
  });

  it("disabled select does not open", () => {
    cy.get("[data-test='appselect-disabled'] [data-test='appselect-trigger']").click();
    cy.get("[data-test='appselect-content'][data-state='open']").should("not.exist");
  });

  it("shows loading spinner", () => {
    cy.get("[data-test='appselect-loading'] [data-test='appselect-loading']").should("exist");
  });

  it("shows error text when invalid", () => {
    cy.get("[data-test='appselect-invalid'] [data-test='appselect-error']").should(
      "contain.text",
      "Selection required",
    );
  });
});
