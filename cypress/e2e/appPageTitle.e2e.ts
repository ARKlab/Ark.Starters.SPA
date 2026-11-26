describe("AppPageTitle", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
    cy.navigateViaMenu(/page title/i)
  })

  it("renders the title as a level 1 heading", () => {
    cy.findByRole("heading", { level: 1, name: "Page Title Demo" }).should("be.visible")
  })

  it("hides the back button when backBtn is false", () => {
    cy.findByRole("heading", { level: 2, name: "Section title without back button" })
      .parent()
      .find("button")
      .should("not.exist")
  })

  it("back button returns to the previous page", () => {
    cy.findByRole("heading", { level: 1, name: "Page Title Demo" }).parent().find("button").click()
    cy.location("pathname").should("eq", "/componentsTestPage")
  })
})
