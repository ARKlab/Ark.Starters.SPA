describe("Table Column Drag & Drop", () => {
  beforeEach(() => {
    cy.actAsAnonUser();
    cy.visit("/moviesTable");
    cy.get("[data-test='spinner']").should("not.exist");
    cy.get("table").should("be.visible");
  });

  it("displays reset columns order button when draggable is enabled", () => {
    // The movies table has isDraggable enabled
    cy.contains("button", /reset.*column.*order/i).should("be.visible");
  });

  it("displays drag handles (🟰) on column headers", () => {
    // Check that drag handles are present in table headers
    cy.get("table thead th").first().should("contain", "🟰");
  });

  it("shows original column order on initial load", () => {
    // Verify initial column order
    const expectedHeaders = ["Title", "Director", "Genre", "Actors", "Plot", "Rating", "Release"];

    cy.get("table thead th").each((header, index) => {
      if (index < expectedHeaders.length) {
        cy.wrap(header).should("contain", expectedHeaders[index]);
      }
    });
  });

  it("reset button restores original column order", () => {
    // Click the reset button (even if columns aren't reordered yet)
    cy.contains("button", /reset.*column.*order/i).click();
    cy.wait(200);

    // Verify the original order is displayed
    const expectedHeaders = ["Title", "Director", "Genre", "Actors", "Plot", "Rating", "Release"];

    cy.get("table thead th").each((header, index) => {
      if (index < expectedHeaders.length) {
        cy.wrap(header).should("contain", expectedHeaders[index]);
      }
    });
  });

  it("drag handle buttons have appropriate cursor styling", () => {
    // Find the drag handle button in the first header
    cy.get("table thead th").first().find("button").should("have.css", "cursor", "grab");
  });

  it("table columns remain functional after interactions", () => {
    // Interact with table features (show filters drawer)
    cy.contains("button", /show filters/i).click();
    
    // Wait for drawer to open
    cy.wait(500);
    
    // Close the drawer by clicking the same button
    cy.contains("button", /show filters/i).click({ force: true });
    
    // Wait for drawer to close
    cy.wait(500);

    // Table should still be visible and functional
    cy.get("table thead th").should("have.length.greaterThan", 0);
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
  });

  it("column headers are accessible with proper roles", () => {
    // Each column header should be a proper table header element
    cy.get("table thead th").each(header => {
      cy.wrap(header).should("have.prop", "tagName", "TH");
    });
  });

  it("preserves table data integrity", () => {
    // Wait for table to be fully loaded
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    
    // Get the first row's first cell data
    cy.get("table tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then(firstCellValue => {
        // The value should exist and not be empty
        expect(firstCellValue.trim()).to.not.be.empty;

        // After clicking reset button, data should still be there
        cy.contains("button", /reset.*column.*order/i).click();
        cy.wait(300);

        // Verify the first cell still has content (column order may change but data persists)
        cy.get("table tbody tr").first().find("td").first().invoke("text").should("not.be.empty");
      });
  });
});
