describe("Debug App Loading check", () => {
  it("visits /null and waits for appReady directly", () => {
    cy.on("uncaught:exception", (err) => {
      cy.log("UNCAUGHT EXCEPTION: " + err.message.substring(0, 300))
      return false
    })
    
    cy.visit("/null")
    cy.window({ timeout: 35000 }).should("have.property", "appReady", true)
    cy.log("SUCCESS - appReady is true!")
  })
})
