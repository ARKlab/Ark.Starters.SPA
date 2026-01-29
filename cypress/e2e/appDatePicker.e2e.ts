describe("AppDatePicker", () => {
  beforeEach(() => {
    cy.actAsAnonUser()
    cy.visit("/componentsTestPage")
  })

  function open(wrapper: string) {
    cy.get(`${wrapper} [data-test='datepicker-trigger']`).then($t => {
      if ($t.length) {
        cy.wrap($t).click()
      } else {
        cy.get(`${wrapper} [data-test='datepicker-input']`).click({ force: true })
      }
    })
    cy.get("[data-test='datepicker-content']").should("be.visible")
  }

  function pickDay(wrapper: string, day: number) {
    open(wrapper)
    cy.get(`[data-test='datepicker-day-${day}']:not([data-outside-range])`)
      .first()
      .click({ force: true })
  }

  it("selects today (basic)", () => {
    const wrapper = "[data-test='datepicker-basic']"
    const todayDay = new Date().getDate()

    pickDay(wrapper, todayDay)

    cy.get(`${wrapper} [data-test='datepicker-input']`)
      .invoke("val")
      .should(v => expect(v).to.match(/^\d{2}\/\d{2}\/\d{4}$/))
  })

  it("selects tomorrow (basic)", () => {
    const wrapper = "[data-test='datepicker-basic']"
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDay = tomorrow.getDate()

    if (tomorrowDay === 1) {
      open(wrapper)
      cy.get("button")
        .contains(tomorrow.toLocaleString("default", { month: "long" }))
        .should("exist")
    }

    pickDay(wrapper, tomorrowDay)

    cy.get(`${wrapper} [data-test='datepicker-input']`)
      .invoke("val")
      .should(v => expect(v).to.match(/^\d{2}\/\d{2}\/\d{4}$/))
  })

  it("clears (if clear button exists)", () => {
    const wrapper = "[data-test='datepicker-basic']"

    pickDay(wrapper, new Date().getDate())

    cy.get(`${wrapper} [data-test='datepicker-input']`)
      .invoke("val")
      .should(v => expect(v).to.match(/^\d{2}\/\d{2}\/\d{4}$/))

    cy.get(`${wrapper} [data-test='datepicker-clear']`).then($c => {
      if ($c.length) {
        cy.wrap($c).click({ force: true })
        cy.get(`${wrapper} [data-test='datepicker-input']`).should("have.value", "")
      }
    })
  })
})
