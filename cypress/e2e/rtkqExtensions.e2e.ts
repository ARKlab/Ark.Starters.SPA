describe("RTKQ Extensions", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.navigateViaMenu(/rtkqerrorhandling/i);
  });

  it("Success", () => {
    cy.get("select[name='query']").next().as("select");
    cy.get("@select").invoke("attr", "id").as("id", { type: "static" });
    cy.get("@select").click();

    cy.get("@id").then(x => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const id = String(x).replace(":control", ":content");
      cy.get("*[id='" + id + "']").within(_ => {
        cy.get("*[data-value='200']").click();
      });
    });

    cy.get("[data-test='query-results']").should("contain.text", "200");
  });

  it("Schema Error", () => {
    cy.get("select[name='query']").next().as("select");
    cy.get("@select").invoke("attr", "id").as("id", { type: "static" });
    cy.get("@select").click();

    cy.get("@id").then(x => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const id = String(x).replace(":control", ":content");
      cy.get("*[id='" + id + "']").within(_ => {
        cy.get("*[data-value='200WithWrongSchema']").click();
      });
    });

    cy.get("[data-test='query-results']").should("not.exist");
    cy.get("[data-scope='toast'][data-part='root']").within(_ => {
      cy.get("[data-part='title']").should("contain.text", "Unexpected error");

      cy.get("[data-part='action-trigger']").click();
    });

    cy.get("[data-scope='dialog'][data-state='open'][data-part='content']")
      .should("exist")
      .within(_ => {
        cy.get("h2").should("contain.text", "Unexpected error");
        cy.get("code").should("contain.text", "invalid_type");
      });
  });

  it("Retry 5xx 3 times", () => {
    cy.get("select[name='query']").next().as("select");
    cy.get("@select").invoke("attr", "id").as("id", { type: "static" });
    cy.get("@select").click();

    const spy = cy.spy();

    cy.window()
      .its("msw")
      .then(msw => {
        const { worker, http } = msw;

        worker.use(http.all("https://rtkq.me/500", spy));
      });

    cy.get("@id").then(x => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const id = String(x).replace(":control", ":content");
      cy.get("*[id='" + id + "']").within(_ => {
        cy.get("*[data-value='500']").click();
      });
    });

    cy.get("[data-test='query-results']").should("not.exist");

    cy.get("[data-scope='toast'][data-part='root']").within(_ => {
      cy.get("[data-part='title']")
        .should("contain.text", "You do not have enough credit")
        .and(() => {
          expect(spy).to.be.callCount(3);
        });

      cy.get("[data-part='action-trigger']").click();
    });

    cy.get("[data-scope='dialog'][data-state='open'][data-part='content']")
      .should("exist")
      .within(_ => {
        cy.get("h2").should("contain.text", "You do not have enough credit");
        cy.get("code").should("contain.text", '"type": "https://example.com/probs/out-of-credit"');
      });
  });

  it("Don't retry 4xx", () => {
    cy.get("select[name='query']").next().as("select");
    cy.get("@select").invoke("attr", "id").as("id", { type: "static" });
    cy.get("@select").click();

    const spy = cy.spy();

    cy.window()
      .its("msw")
      .then(msw => {
        const { worker, http } = msw;

        worker.use(http.all("https://rtkq.me/400", spy));
      });

    cy.get("@id").then(x => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const id = String(x).replace(":control", ":content");
      cy.get("*[id='" + id + "']").within(_ => {
        cy.get("*[data-value='400']").click();
      });
    });

    cy.get("[data-test='query-results']").should("not.exist");

    cy.get("[data-scope='toast'][data-part='root']").within(_ => {
      cy.get("[data-part='title']")
        .should("contain.text", "Bad Request")
        .and(() => {
          expect(spy).to.be.callCount(1);
        });

      cy.get("[data-part='action-trigger']").click();
    });

    cy.get("[data-scope='dialog'][data-state='open'][data-part='content']")
      .should("exist")
      .within(_ => {
        cy.get("h2").should("contain.text", "Bad Request");
      });
  });

  it("Download Success", () => {
    cy.get("button[data-test='download-success']").click();

    cy.get("[data-scope='toast'][data-part='root'][data-type='loading']").within(_ => {
      cy.get("[data-part='title']").should("contain.text", "Submitting");
    });

    cy.readFile(`${Cypress.config("downloadsFolder")}/puppa.txt`);
  });

  it("Download Failure", () => {
    cy.get("button[data-test='download-failure']").click();

    cy.get("[data-scope='toast'][data-part='root'][data-type='loading']").within(_ => {
      cy.get("[data-part='title']").should("contain.text", "Submitting");
    });

    cy.get("[data-scope='toast'][data-part='root'][data-type='error']").within(_ => {
      cy.get("[data-part='title']").should("contain.text", "You do not have enough credit");
    });

    cy.get("[data-test='mutation-download-error']").should(
      "contain.text",
      "https://example.com/probs/out-of-credit",
    );
  });
});
