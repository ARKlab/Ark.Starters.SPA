describe("AppFileUpload", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
  })

  it("shows dropzone and file input exists", () => {
    cy.get("[data-test='fileupload-single'] [data-test='fileupload-dropzone']").should("exist")
    cy.get("[data-test='fileupload-single'] [data-test='fileupload-input']").should("exist")
  })

  it("keeps the dropzone text inside the dropzone", () => {
    cy.get("[data-test='fileupload-single'] [data-test='fileupload-dropzone']").then($zone => {
      const zone = $zone[0].getBoundingClientRect()
      const text = $zone.find("[data-test='fileupload-center']")[0].getBoundingClientRect()
      expect(text.left).to.be.gte(zone.left)
      expect(text.right).to.be.lte(zone.right)
      expect(text.top).to.be.gte(zone.top)
      expect(text.bottom).to.be.lte(zone.bottom)
    })
  })

  it("shows accept restrictions", () => {
    cy.get("[data-test='fileupload-single'] [data-test='fileupload-accept']").should(
      "contain.text",
      ".txt,.pdf,.doc",
    )
  })

  it("multiple variant accepts multiple files", () => {
    cy.get("[data-test='fileupload-multiple'] [data-test='fileupload-input']").should(
      "have.attr",
      "multiple",
    )
  })

  it("no-accept variant has no restrictions", () => {
    cy.get("[data-test='fileupload-no-accept'] [data-test='fileupload-accept']").should("not.exist")
  })
})
