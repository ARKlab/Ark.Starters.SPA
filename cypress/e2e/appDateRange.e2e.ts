describe("AppDateRange", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/controlComponents")
  })

  function pickDay(part: "from" | "to", day: number) {
    cy.get(`[data-test='daterange-${part}'] [data-test='datepicker-input']`).click({ force: true })
    cy.get("[data-test='datepicker-content']:visible")
      .find(`[data-test='datepicker-day-${day}']:not([data-outside-range])`)
      .first()
      .click({ force: true })
  }

  it("selects a range and reports start and end", () => {
    pickDay("from", 10)
    pickDay("to", 12)

    cy.get("[data-test='daterange-display']")
      .invoke("text")
      .should(text => {
        // the component pins dates to CET, so on other time zones both days shift: check the span only
        const [from, to] = text.split(" - ").map(d => {
          const [day, month, year] = d.split("/").map(Number)
          return Date.UTC(year, month - 1, day)
        })
        expect(to - from).to.equal(2 * 24 * 60 * 60 * 1000)
      })
    // only the format: the logged ISO day can shift by one (isoDate formats in UTC)
    cy.findAllByText(/^dateRange start: "\d{4}-\d{2}-\d{2}"$/).should("exist")
    cy.findAllByText(/^dateRange end: "\d{4}-\d{2}-\d{2}"$/).should("exist")
  })

  it("clear button empties the range", () => {
    cy.findByRole("button", { name: "Clear date range" }).should("not.exist")
    pickDay("from", 10)

    cy.findByRole("button", { name: "Clear date range" }).click()

    cy.get("[data-test='daterange-display']").should("have.text", "")
    cy.findByRole("button", { name: "Clear date range" }).should("not.exist")
  })
})
