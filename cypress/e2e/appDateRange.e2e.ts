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
      .should("match", /^10\/\d{2}\/\d{4} - 12\/\d{2}\/\d{4}$/)
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
