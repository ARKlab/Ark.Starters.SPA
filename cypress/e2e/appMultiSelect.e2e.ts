//// filepath: c:\Users\jeppy\projects\Ark.Starters.SPA\cypress\e2e\appMultiSelect.e2e.ts
describe("AppMultiSelect", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
  })

  function open(wrapper: string) {
    // Try trigger inside control; fallback to any trigger
    cy.get(wrapper).within(() => {
      cy.get("[data-test='appmultiselect-trigger']").then($t => {
        if (!$t.length) {
          throw new Error(`No trigger found in wrapper: ${wrapper}`)
        }
        // Force click first (avoid hidden clones)
        cy.wrap($t.first()).click({ force: true })
      })
    })
    cy.get("[data-test='appmultiselect-content']").should("exist")
  }

  it("opens and selects multiple options", () => {
    open("[data-test='appmultiselect-basic']")
    cy.get("[data-test='appmultiselect-content'] [data-test='appmultiselect-item-a']").first().click()
    cy.get("[data-test='appmultiselect-content'] [data-test='appmultiselect-item-c']").first().click()
    cy.get("[data-test='appmultiselect-basic'] [data-test='appmultiselect-value']")
      .should("contain.text", "Alpha")
      .and("contain.text", "Charlie")
    cy.get("[data-test='appmultiselect-basic-value']").should("contain.text", "a,c")
  })

  it("deselects an already selected option", () => {
    open("[data-test='appmultiselect-basic']")
    cy.get("[data-test='appmultiselect-content'] [data-test='appmultiselect-item-b']").first().click()
    cy.get("[data-test='appmultiselect-content'] [data-test='appmultiselect-item-d']").first().click()
    cy.get("[data-test='appmultiselect-content'] [data-test='appmultiselect-item-b']").first().click()
    cy.get("[data-test='appmultiselect-basic-value']").should("contain.text", "d").and("not.contain.text", "b")
  })

  it("shows placeholder when nothing selected", () => {
    cy.get("[data-test='appmultiselect-basic'] [data-test='appmultiselect-value']").should("have.text", "Pick many")
  })

  it("loading variant shows spinner", () => {
    cy.get("[data-test='appmultiselect-loading'] [data-test='appmultiselect-trigger']")
      .first()
      .find("[data-test='appmultiselect-loading-indicator']")
      .should("exist")
  })
})
