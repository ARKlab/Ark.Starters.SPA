describe("AppTagInput", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
  })

  it("adds tags with Enter", () => {
    cy.get("[data-test='taginput-basic']").within(() => {
      cy.findByPlaceholderText("Add tag...").type("alpha{enter}beta{enter}")
    })
    cy.get("[data-test='taginput-basic-value']").should("contain.text", "alpha,beta")
  })

  it("removes the last tag with Backspace", () => {
    cy.get("[data-test='taginput-basic']").within(() => {
      // first Backspace highlights the last tag, the second deletes it
      cy.findByPlaceholderText("Add tag...").type("alpha{enter}beta{enter}{backspace}{backspace}")
    })
    cy.get("[data-test='taginput-basic-value']")
      .should("contain.text", "Values: alpha")
      .and("not.contain.text", "beta")
  })

  it("shows preset tags in the disabled variant", () => {
    cy.get("[data-test='taginput-disabled']").within(() => {
      cy.findByText("fixed").should("exist")
      cy.findByText("Tag Input Disabled").should("exist")
    })
  })
})
