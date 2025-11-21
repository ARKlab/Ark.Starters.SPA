describe("Components Test Page - AppPagination", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/componentsTestPage");
    cy.get("[data-test='spinner']").should("not.exist");
  });

  it("Mostra navigazione quando count > pageSize", () => {
    cy.get("[data-test='pagination-large'] [title='Next']").should("exist");
    cy.get("[data-test='pagination-large-current']").should("contain", "1");
  });

  it("Next aggiorna la pagina (scenario grande)", () => {
    cy.get("[data-test='pagination-large'] [title='Next']").click();
    cy.get("[data-test='pagination-large-current']").should("contain", "2");
  });

  it("Nasconde navigazione quando count <= pageSize (scenario piccolo)", () => {
    cy.get("[data-test='pagination-small'] [title='Next']").should("not.exist");
    cy.get("[data-test='pagination-small'] [title='Previous']").should("not.exist");
  });

  it("Cambio pageSize (scenario grande)", () => {
    cy.get("[data-test='pagination-large'] select").select("20");
    cy.get("[data-test='pagination-large'] [title='Next']").should("exist");
  });
});
