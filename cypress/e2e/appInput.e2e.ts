describe("AppInput", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
  })

  it("types and shows clear icon only when value present", () => {
    cy.get("[data-test='appinput-section'] [data-test='first-input']").as("first")
    cy.get("@first").find("[data-test='appinput-input']").as("inp")
    cy.get("@inp").should("have.value", "")
    cy.get("@first").find("[data-test='appinput-clear']").should("not.exist")
    cy.get("@inp").type("hello")
    cy.get("@first").find("[data-test='appinput-clear']").should("exist").click()
    cy.get("@inp").should("have.value", "")
    cy.get("@first").find("[data-test='appinput-clear']").should("not.exist")
  })

  it("disabled input does not change on type", () => {
    cy.get("[data-test='disabled-input'] [data-test='appinput-input']")
      .as("disabled")
      .should("be.disabled")
      .and("have.value", "cannot edit")
  })

  it("shows error text when invalid", () => {
    cy.get("[data-test='invalid-input'] [data-test='appinput-root']").within(() => {
      cy.get("[data-test='appinput-error']").should("contain.text", "Error message")
    })
  })
})
