describe("Debug content", () => {
  it("writes page content to file", () => {
    cy.on("uncaught:exception", () => false)
    cy.visit("/")
    cy.wait(15000)
    
    cy.get("body").invoke("html").then(html => {
      cy.writeFile("/tmp/app-html-output.txt", html)
    })
    
    cy.window().then((win: any) => {
      cy.writeFile("/tmp/app-window-state.txt", 
        "appReady=" + win.appReady + "\n" +
        "appSettings=" + JSON.stringify(win.appSettings) + "\n"
      )
    })
  })
})
