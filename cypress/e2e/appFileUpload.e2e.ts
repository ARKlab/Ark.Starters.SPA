describe("AppFileUpload", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
  })

  it("shows dropzone and file input exists", () => {
    cy.get("[data-test='fileupload-single'] [data-test='fileupload-dropzone']").should("exist")
    cy.get("[data-test='fileupload-single'] [data-test='fileupload-input']").should("exist")
  })

  it("shows accept restrictions", () => {
    cy.get("[data-test='fileupload-single'] [data-test='fileupload-accept']").should("contain.text", ".txt,.pdf,.doc")
  })

  it("multiple variant accepts multiple files", () => {
    cy.get("[data-test='fileupload-multiple'] [data-test='fileupload-input']").should("have.attr", "multiple")
  })

  it("no-accept variant has no restrictions", () => {
    cy.get("[data-test='fileupload-no-accept'] [data-test='fileupload-accept']").should("not.exist")
  })
})
