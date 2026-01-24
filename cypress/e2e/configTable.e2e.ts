import { HttpResponse } from "msw";

import { url } from "../../src/features/configTable/config.mocks";
import type { Employee } from "../../src/features/configTable/employee";
import type { PostDataType } from "../../src/features/fetchApiExample/jsonPlaceholderTypes";

describe("Config Table", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
  });

  it("has correct labels", () => {
    cy.visit("/configTable");
    cy.title().should("match", /config table/i);
    cy.get("[data-test='spinner']").should("not.exist");

    cy.get("main h2").contains(/employee/i);
  });

  describe("data tests", () => {
    it("has correct rows count", () => {
      cy.visit("/configTable");
      cy.title().should("match", /config table/i);
      cy.get("[data-test='spinner']").should("not.exist");

      cy.get("table tbody tr").should("have.length", 20);
    });

    it("API mocks via MSW", () => {
      cy.window()
        .its("msw")
        .then(msw => {
          const data = [{ name: "Mario", surName: "Rossi", employed: true }] as Employee[];
          const { worker, http } = msw;

          worker.use(
            http.get(url + "/", () => {
              return HttpResponse.json(data);
            }),
          );
        });
      cy.navigateViaMenu(/config table/i);

      cy.get("table tbody tr").should("have.length", 1);
    });

    it("API mocks via Cypress", () => {
      // the global 'beforeEach' and the local 'actAsAnon' ensure we're on /null start'
      const data = [
        { id: 42, userId: 100, title: "Cypress Mock", body: "lorem ipsum ..." },
      ] as PostDataType[];
      cy.intercept("GET", "https://jsonplaceholder.typicode.com/posts", {
        statusCode: 200,
        body: data,
      }).as("data");

      cy.navigateViaMenu(/posts/i);

      cy.wait("@data");

      cy.get("table tbody tr").should("have.length", 1);
    });

    it("Navigate via Menu", () => {
      cy.navigateViaMenu(/config table/i);
      cy.url().should("contain", "/configTable");
    });

    it("Navigate via Path", () => {
      cy.navigateViaRoute("/configTable");
      cy.title().should("match", /config table/i);
    });
  });
});
