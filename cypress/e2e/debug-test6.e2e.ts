describe("Debug content", () => {
  it("checks page content after visit", () => {
    cy.on("uncaught:exception", () => false)
    cy.visit("/")
    cy.wait(15000)
    
    // Get actual body text
    cy.get("body").invoke("text").then(text => {
      cy.log("BODYTEXT: " + text.substring(0, 300))
    })
    
    // Check if spinner exists
    cy.get("body").then($body => {
      if ($body.find("[data-test='spinner']").length > 0) {
        cy.log("SPINNER IS VISIBLE")
      } else {
        cy.log("NO SPINNER")
      }
      if ($body.find("#root").length > 0) {
        cy.log("ROOT EXISTS: " + $body.find("#root").html().substring(0, 300))
      }
      // Look for any role=alert (error boundary)  
      if ($body.find("[role='alert']").length > 0) {
        cy.log("ALERT: " + $body.find("[role='alert']").text().substring(0, 300))
      }
    })
    
    cy.window().then((win: any) => {
      cy.log("appReady=" + win.appReady + " appSettings=" + JSON.stringify(win.appSettings).substring(0,100))
    })
  })
})
