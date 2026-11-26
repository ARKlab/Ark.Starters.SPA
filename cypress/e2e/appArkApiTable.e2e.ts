describe("AppArkApiTable", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/moviesTable")
    cy.get("table tbody tr").should("have.length", 10)
  })

  const firstTitle = () => cy.get("table tbody tr").first().find("td").first().invoke("text")
  const sortTitle = () =>
    cy.get("table thead th").first().findByRole("button", { name: "Sort" }).click()
  const titlesShouldBeSorted = (desc: boolean) =>
    cy.get("table tbody tr").should($rows => {
      const titles = [...$rows].map(r => r.querySelector("td")?.textContent ?? "")
      const sorted = [...titles].sort()
      expect(titles).to.have.length(10)
      expect(titles).to.deep.equal(desc ? sorted.reverse() : sorted)
    })

  it("renders a page of rows", () => {
    cy.get("table thead th").first().should("contain.text", "Title")
  })

  it("sorts by title ascending then descending", () => {
    sortTitle()
    titlesShouldBeSorted(false)
    sortTitle()
    titlesShouldBeSorted(true)
  })

  it("moves to the next page", () => {
    firstTitle().then(title => {
      cy.get("[title='Next']").click()
      // the spinner row also has an empty first cell: require a full page with a new title
      cy.get("table tbody tr").should($rows => {
        expect($rows).to.have.length(10)
        const newTitle = $rows.first().find("td").first().text()
        expect(newTitle).to.not.equal("")
        expect(newTitle).to.not.equal(title)
      })
    })
  })
})
