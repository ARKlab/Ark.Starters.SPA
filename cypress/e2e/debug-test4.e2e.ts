describe("Debug App Loading errors", () => {
  it("visits and captures all console output", () => {
    const errors: string[] = []
    const warns: string[] = []
    
    cy.on("uncaught:exception", (err) => {
      errors.push("UNCAUGHT: " + err.message)
      return false
    })

    cy.on("window:console", (msg) => {
      if (msg.type === "error") errors.push("CONSOLE.ERROR: " + msg.message)
    })
    
    cy.on("window:before:load", (win) => {
      const origError = win.console.error.bind(win.console)
      win.console.error = (...args: any[]) => {
        errors.push("E: " + args.map(String).join(" "))
        origError(...args)
      }
      const origWarn = win.console.warn.bind(win.console)
      win.console.warn = (...args: any[]) => {
        warns.push("W: " + args.map(String).join(" "))
        origWarn(...args)
      }
    })
    
    cy.visit("/")
    cy.wait(20000)
    
    cy.window().then(win => {
      cy.log("appReady: " + win.appReady)
    })
    
    cy.then(() => {
      errors.forEach(e => cy.log(e.substring(0, 200)))
      warns.slice(0,10).forEach(w => cy.log(w.substring(0, 200)))
    })
    
    cy.get("body").invoke("html").then(html => {
      cy.log("Body HTML: " + html.substring(0, 500))
    })
  })
})
