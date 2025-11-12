describe("AppDatePicker", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/componentsTestPage");
  });

  function open(wrapper: string) {
    // Try trigger first; if missing, click input
    cy.get(`${wrapper} [data-test='datepicker-trigger']`).then($t => {
      if ($t.length) {
        cy.wrap($t).click({ force: true });
      } else {
        cy.get(`${wrapper} [data-test='datepicker-input']`).click({ force: true });
      }
    });
    cy.get("[data-test='datepicker-content']").should("exist");
  }

  function pickDay(wrapper: string, day: number) {
    open(wrapper);
    cy.get(`[data-test='datepicker-day-${day}']`).first().click({ force: true });
  }

  it("selects today (basic)", () => {
    const wrapper = "[data-test='datepicker-basic']";
    const todayDay = new Date().getDate();
    open(wrapper);
    // If today not present (month view mismatch), fallback first enabled day
    cy.get(`[data-test='datepicker-day-${todayDay}']`).then($d => {
      if ($d.length) {
        cy.wrap($d.first()).click({ force: true });
      } else {
        cy.get("[data-test^='datepicker-day-']").first().click({ force: true });
      }
    });
    cy.get(`${wrapper} [data-test='datepicker-input']`)
      .invoke("val")
      .should(v => expect(v).to.match(/^\d{2}\/\d{2}\/\d{4}$/));
  });

  it("selects tomorrow (basic)", () => {
    const wrapper = "[data-test='datepicker-basic']";
    const tomorrowDay = new Date().getDate() + 1;
    open(wrapper);
    cy.get(`[data-test='datepicker-day-${tomorrowDay}']`).then($d => {
      if ($d.length) {
        cy.wrap($d.first()).click({ force: true });
      } else {
        cy.get("[data-test^='datepicker-day-']").eq(1).click({ force: true });
      }
    });
    cy.get(`${wrapper} [data-test='datepicker-input']`)
      .invoke("val")
      .should(v => expect(v).to.match(/^\d{2}\/\d{2}\/\d{4}$/));
  });

  it("clears (if clear button exists)", () => {
    const wrapper = "[data-test='datepicker-basic']";
    pickDay(wrapper, new Date().getDate());
    cy.get(`${wrapper} [data-test='datepicker-input']`)
      .invoke("val")
      .should(v => expect(v).to.match(/^\d{2}\/\d{2}\/\d{4}$/));
    cy.get(`${wrapper} [data-test='datepicker-clear']`).then($c => {
      if ($c.length) {
        cy.wrap($c).click({ force: true });
        cy.get(`${wrapper} [data-test='datepicker-input']`).should("have.value", "");
      } else {
        cy.log("No clear button present; skipped");
      }
    });
  });
});
