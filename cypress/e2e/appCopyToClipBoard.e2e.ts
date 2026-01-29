describe("AppCopyToClipBoard", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
    cy.window().then(win => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!win.navigator.clipboard) {
        Object.defineProperty(win.navigator, "clipboard", {
          configurable: true,
          value: { writeText: async () => Promise.resolve() },
        })
      }
      cy.stub(win.navigator.clipboard, "writeText")
        .as("writeText")
        .callsFake(async (t: string) => Promise.resolve(t))
    })
  })

  it("copies value (button variant)", () => {
    cy.get("[data-test='copyclip-button'] [data-test='copyclip-button-trigger']").click()
    cy.get("@writeText").should("have.been.calledOnceWith", "Alpha123")
  })

  it("copies value (icon variant)", () => {
    cy.get("[data-test='copyclip-icon'] [data-test='copyclip-icon-trigger']").click()
    cy.get("@writeText").should("have.been.calledOnceWith", "Beta456")
  })
})
