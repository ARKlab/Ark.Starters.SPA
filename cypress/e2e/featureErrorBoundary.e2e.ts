describe("FeatureErrorBoundary", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/featureErrorBoundaryDemo")
  })

  it("shows the fallback for the failing widget and keeps the page alive", () => {
    cy.findByRole("button", { name: "Throw error" }).click()

    cy.findByRole("heading", { name: "Error in Demo widget" }).should("be.visible")
    cy.findByText("Demo widget failure").should("be.visible")
    cy.findByRole("heading", { name: "Feature Error Boundary Demo" }).should("be.visible")
  })

  it("try again remounts the widget", () => {
    cy.findByRole("button", { name: "Throw error" }).click()
    cy.findByRole("button", { name: "Try again" }).click()

    cy.findByText("The widget is working.").should("be.visible")
    cy.findByRole("heading", { name: "Error in Demo widget" }).should("not.exist")
  })
})
