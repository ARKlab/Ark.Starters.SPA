describe("AppConfirmationDialog", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
  })

  it("opens and shows title/body", () => {
    cy.get('[data-test="open-appconfirmationdialog-btn"]').click()
    cy.get('[data-test="appconfirmationdialog-title"]').should("contain.text", "Delete record?")
    cy.get('[data-test="appconfirmationdialog-body"]').should("contain.text", "Are you sure you want to proceed?")
  })

  it("closes via close button", () => {
    cy.get('[data-test="open-appconfirmationdialog-btn"]').click()
    cy.get('[data-test="appconfirmationdialog-close"]').click()
    cy.get('[data-test="appconfirmationdialog-root"]').should("not.exist")
  })

  it("fires confirm callback", () => {
    cy.get('[data-test="open-appconfirmationdialog-btn"]').click()
    cy.get('[data-test="appconfirmationdialog-confirm"]').click()
    cy.get('[data-test="appconfirmationdialog-confirm-count"]').should("contain.text", "Confirms: 1")
  })
})
