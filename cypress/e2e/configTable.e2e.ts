import { HttpResponse } from "msw";

import { url } from "../../src/features/configTable/config.mocks";
import type { Employee } from "../../src/features/configTable/configTable";

describe("Config Table", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
  });

  it("has correct labels", () => {
    cy.visit("/configTable");
    cy.title().should("match", /config table/i);
    cy.get("[data-role='spinner']").should("not.exist");

    cy.get("main h2").contains(/employee/i);
  });

  describe("data tests", () => {
    it("has correct rows count", () => {
      cy.visit("/configTable");
      cy.title().should("match", /config table/i);
      cy.get("[data-role='spinner']").should("not.exist");

      cy.get("table tbody tr").should("have.length", 20);
    });

    it("MSW works", () => {
      // the global 'beforeEach' and the local 'actAsAnon' ensure we're on /null start'
      cy.window().then(win => {
        const data = [{ name: "Mario", surName: "Rossi", employed: true }] as Employee[];
        if (win.msw === undefined) throw new Error("wtf?!");
        const { worker, http } = win.msw;

        worker.use(
          http.get(url + "/", () => {
            return HttpResponse.json(data);
          }),
        );
      });

      cy.navigateViaMenu(/config table/i);

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
