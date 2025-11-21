describe("AppTagInput", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/componentsTestPage");
  });

  function typeAndCommit(wrapper: string, text: string, commitKey = "Enter") {
    cy.get(`${wrapper} [data-test='taginput-input']`).type(text + `{${commitKey}}`);
  }

  it("adds tags via Enter and comma", () => {
    const w = "[data-test='taginput-basic']";
    typeAndCommit(w, "alpha", "enter");
    typeAndCommit(w, "beta,", ""); // include comma triggers keyDown
    cy.get(`${w} [data-test='taginput-tag']`).should("have.length", 2);
    cy.get(`${w} [data-test='taginput-basic-value']`).should("contain.text", "alpha,beta");
  });

  it("adds tag on blur", () => {
    const w = "[data-test='taginput-basic']";
    cy.get(`${w} [data-test='taginput-input']`).type("gamma");
    cy.get("body").click(); // blur
    cy.get(`${w} [data-test='taginput-tag'][data-value='gamma']`).should("exist");
  });

  it("backspace removes last tag when input empty", () => {
    const w = "[data-test='taginput-basic']";
    typeAndCommit(w, "one");
    typeAndCommit(w, "two");
    cy.get(`${w} [data-test='taginput-input']`).type("{backspace}");
    cy.get(`${w} [data-test='taginput-tag']`).should("have.length", 1).and("have.attr", "data-value", "one");
  });

  it("no duplicates when allowDuplicates=false", () => {
    const w = "[data-test='taginput-nodup']";
    typeAndCommit(w, "dup");
    typeAndCommit(w, "dup");
    cy.get(`${w} [data-test='taginput-tag']`).should("have.length", 1);
  });

  it("allows duplicates when allowDuplicates=true", () => {
    const w = "[data-test='taginput-dup']";
    typeAndCommit(w, "x");
    typeAndCommit(w, "x");
    cy.get(`${w} [data-test='taginput-tag']`).should("have.length", 2);
  });

  it("removes tag via click on X", () => {
    const w = "[data-test='taginput-basic']";
    typeAndCommit(w, "removeMe");
    cy.get(`${w} [data-test='taginput-tag'][data-value='removeMe'] [data-test='taginput-remove']`).click();
    cy.get(`${w} [data-test='taginput-tag'][data-value='removeMe']`).should("not.exist");
  });
});
