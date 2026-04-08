describe("Debug App Loading", () => {
  it("visits app and checks console", () => {
    cy.on("uncaught:exception", (err) => {
      cy.log("UNCAUGHT EXCEPTION: " + err.message)
      return false  // don't fail test
    })
    
    cy.on("window:before:load", (win) => {
      cy.stub(win.console, "error").as("consoleError")
      cy.stub(win.console, "warn").as("consoleWarn")  
    })
    
    cy.visit("/")
    
    cy.wait(5000)
    
    cy.window().then(win => {
      cy.log("appReady: " + win.appReady)
    })
    
    cy.get("@consoleError").then((stub: any) => {
      const calls = stub.args || []
      calls.forEach((args: any[]) => {
        cy.log("CONSOLE.ERROR: " + JSON.stringify(args).substring(0, 200))
      })
    })
    
    cy.get("body").then(($body) => {
      cy.log("Body HTML: " + $body.html().substring(0, 500))
    })
  })
})
