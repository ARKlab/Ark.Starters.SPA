describe("AppModal", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
  })

  it("opens and closes via close trigger (X)", () => {
    cy.get("[data-test='open-appmodal-btn']").click()
    cy.get("[data-test='appmodal-content']").should("exist")
    cy.get("[data-test='appmodal-close-trigger']").click()
    cy.get("[data-test='appmodal-content']").should("not.exist")
  })

  it("opens and closes via footer Close button", () => {
    cy.get("[data-test='open-appmodal-btn']").click()
    cy.get("[data-test='appmodal-footer-close']").click()
    cy.get("[data-test='appmodal-root']").should("not.exist")
  })

  it("submit button triggers submit & close", () => {
    cy.get("[data-test='appmodal-submit-count']").should("contain", "Submits: 0")
    cy.get("[data-test='open-appmodal-btn']").click()
    cy.get("[data-test='appmodal-submit']").click()
    cy.get("[data-test='appmodal-root']").should("not.exist")
    cy.get("[data-test='appmodal-submit-count']").should("contain", "Submits: 1")
  })
})
