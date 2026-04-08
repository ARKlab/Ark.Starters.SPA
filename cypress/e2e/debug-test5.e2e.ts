describe("Debug App Loading errors", () => {
  it("visits and checks what renders", () => {
    cy.on("uncaught:exception", () => false)
    
    cy.visit("/")
    cy.wait(15000)
    
    cy.window().should((win: any) => {
      const ready = win.appReady
      const hasRoot = !!document.getElementById('root')?.innerHTML
      expect(win).to.have.property('appReady').or.not.exist
    })
    
    cy.document().then(doc => {
      const root = doc.getElementById('root')
      if (root) {
        cy.log("ROOT innerHTML: " + root.innerHTML.substring(0, 500))
      } else {
        cy.log("NO #root ELEMENT!")
      }
    })
    
    cy.title().then(title => cy.log("Title: " + title))
  })
})
