describe("AppErrorModal", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.navigateViaMenu(/rtkqerrorhandling/i)

    // trigger a schema error, then open the modal from the toast action
    cy.get("select[name='query']").next().as("select")
    cy.get("@select").invoke("attr", "id").as("id", { type: "static" })
    cy.get("@select").click()
    cy.get("@id").then(x => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const id = String(x).replace(":control", ":content")
      cy.get("*[id='" + id + "']").within(_ => {
        cy.get("*[data-value='200WithWrongSchema']").click()
      })
    })
    cy.get("[data-scope='toast'][data-part='root']").within(_ => {
      cy.get("[data-part='action-trigger']").click()
    })
    cy.get("[data-test='appmodal-content']").as("modal")
  })

  it("shows title, message and reload button", () => {
    cy.get("@modal").within(() => {
      cy.findByRole("heading", { name: "Unexpected error" }).should("exist")
      cy.get("code").should("contain.text", "invalid_type")
      cy.findByRole("button", { name: "Reload the page" }).should("exist")
    })
  })

  it("closes via the close trigger", () => {
    cy.get("[data-test='appmodal-close-trigger']").click()
    cy.get("[data-test='appmodal-content']").should("not.exist")
  })
})
