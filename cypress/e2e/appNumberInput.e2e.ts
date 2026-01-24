describe("AppNumberInput", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/componentsTestPage");
  });

  function aliasFirst() {
    cy.get("[data-test='first-number-input'] [data-test='appnumberinput-input']").should("exist");
    cy.get("[data-test='first-number-input'] [data-test='appnumberinput-input']").as("num");
  }

  it("types a number and updates value", () => {
    aliasFirst();
    cy.get("@num").should("have.value", "");
    cy.get("@num").type("42");
    cy.get("@num").should("have.value", "42");
  });

  it("rejects non-numeric characters", () => {
    aliasFirst();
    cy.get("@num").type("abc");
    cy.get("@num").should("have.value", "");
  });

  it("shows error text when invalid", () => {
    cy.get("[data-test='invalid-number-input'] [data-test='appnumberinput-error']").should(
      "contain.text",
      "Invalid number",
    );
  });

  it("preset value is visible and required", () => {
    cy.get("[data-test='preset-number-input'] [data-test='appnumberinput-input']")
      .should("exist")
      .and("have.value", "10")
      .and("have.attr", "required");
  });
});
