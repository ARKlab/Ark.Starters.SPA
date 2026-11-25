describe("AppInputFilter", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/controlComponents")
    cy.findByText("Chakra Input Filter With Clear").parent().find("input").as("filterInput")
  })

  it("reports typed value with its prop name", () => {
    cy.get("@filterInput").type("abc")
    cy.get("@filterInput").should("have.value", "abc")
    cy.findByText('textFilter: "abc"').should("exist")
  })

  it("clear icon empties the value", () => {
    cy.get("@filterInput").type("abc")
    cy.findByText("Chakra Input Filter With Clear").parent().find("svg").click()
    cy.get("@filterInput").should("have.value", "")
    cy.findByText('textFilter: ""').should("exist")
  })

  it("hides the clear icon when empty", () => {
    cy.findByText("Chakra Input Filter With Clear").parent().find("svg").should("not.exist")
  })
})
