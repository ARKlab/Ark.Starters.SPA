describe("Components Test Page - AppPagination", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
    cy.get("[data-test='spinner']").should("not.exist")
  })

  it("Shows navigation when count > pageSize", () => {
    cy.get("[data-test='pagination-large'] [title='Next']").should("exist")
    cy.get("[data-test='pagination-large-current']").should("contain", "1")
  })

  it("Next updates the page (large scenario)", () => {
    cy.get("[data-test='pagination-large'] [title='Next']").click()
    cy.get("[data-test='pagination-large-current']").should("contain", "2")
  })

  it("Hides navigation when count <= pageSize (small scenario)", () => {
    cy.get("[data-test='pagination-small'] [title='Next']").should("not.exist")
    cy.get("[data-test='pagination-small'] [title='Previous']").should("not.exist")
  })

  it("PageSize change (large scenario)", () => {
    cy.get("[data-test='pagination-large'] select").select("20")
    cy.get("[data-test='pagination-large'] [title='Next']").should("exist")
  })
})
