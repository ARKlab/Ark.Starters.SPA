describe("Debug App Loading /null", () => {
  it("visits /null and checks appReady", () => {
    cy.on("uncaught:exception", (err) => {
      cy.log("UNCAUGHT EXCEPTION: " + err.message.substring(0, 300))
      return false
    })
    
    cy.visit("/null")
    
    cy.wait(10000)
    
    cy.window().then(win => {
      cy.log("appReady on /null: " + win.appReady)
    })
    
    cy.get("body").then(($body) => {
      cy.log("Body HTML snippet: " + $body.html().substring(0, 300))
    })
  })
  
  it("uses cy.session with /null", () => {
    cy.on("uncaught:exception", (err) => {
      cy.log("UNCAUGHT EXCEPTION: " + err.message.substring(0, 300))
      return false
    })
    
    cy.session("test-session", () => {
      cy.visit("/null")
      cy.window({ timeout: 15000 }).should("have.property", "appReady", true)
    })
  })
})
