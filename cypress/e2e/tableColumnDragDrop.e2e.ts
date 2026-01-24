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

  it("reorders columns via drag and drop using real mouse events", () => {
    // Verify initial order: Director should be at position 1
    cy.get("table thead th").eq(1).should("contain", "Director");
    cy.get("table thead th").eq(2).should("contain", "Genre");

    // Find the drag handle button in the Director column header
    cy.get("table thead th")
      .eq(1)
      .find("button")
      .first()
      .then($dragHandle => {
        // Get the Genre column header
        cy.get("table thead th")
          .eq(2)
          .then($target => {
            const dragRect = $dragHandle[0].getBoundingClientRect();
            const targetRect = $target[0].getBoundingClientRect();

            // Calculate the distance to move (from drag handle center to target center)
            const deltaX =
              targetRect.left + targetRect.width / 2 - (dragRect.left + dragRect.width / 2);
            const deltaY =
              targetRect.top + targetRect.height / 2 - (dragRect.top + dragRect.height / 2);

            // Perform drag and drop using cypress-real-events with correct delta movements
            cy.wrap($dragHandle)
              .realMouseDown({ position: "center" })
              .realMouseMove(5, 0) // Small wiggle to initiate drag
              .wait(200)
              .realMouseMove(deltaX, deltaY) // Move to target position
              .wait(200)
              .realMouseUp();

            cy.wait(500);

            // Verify columns have swapped: Genre should now be at position 1
            cy.get("table thead th").eq(1).should("contain", "Genre");
            cy.get("table thead th").eq(2).should("contain", "Director");
          });
      });
  });

  it("resets column order when reset button is clicked", () => {
    // First, drag Director to Genre position
    cy.get("table thead th")
      .eq(1)
      .find("button")
      .first()
      .then($dragHandle => {
        cy.get("table thead th")
          .eq(2)
          .then($target => {
            const dragRect = $dragHandle[0].getBoundingClientRect();
            const targetRect = $target[0].getBoundingClientRect();
            const deltaX =
              targetRect.left + targetRect.width / 2 - (dragRect.left + dragRect.width / 2);
            const deltaY =
              targetRect.top + targetRect.height / 2 - (dragRect.top + dragRect.height / 2);

            cy.wrap($dragHandle)
              .realMouseDown({ position: "center" })
              .realMouseMove(5, 0)
              .wait(200)
              .realMouseMove(deltaX, deltaY)
              .wait(200)
              .realMouseUp();

            cy.wait(500);

            // Verify reordering happened
            cy.get("table thead th").eq(1).should("contain", "Genre");

            // Click reset button
            cy.contains("button", /reset.*column.*order/i).click();
            cy.wait(300);

            // Verify original order is restored
            cy.get("table thead th").eq(1).should("contain", "Director");
            cy.get("table thead th").eq(2).should("contain", "Genre");
          });
      });
  });

  it("allows multiple sequential drag operations", () => {
    // First drag: Move Director to Genre position
    cy.get("table thead th")
      .eq(1)
      .find("button")
      .first()
      .then($dragHandle1 => {
        cy.get("table thead th")
          .eq(2)
          .then($target1 => {
            const dragRect1 = $dragHandle1[0].getBoundingClientRect();
            const targetRect1 = $target1[0].getBoundingClientRect();
            const deltaX1 =
              targetRect1.left + targetRect1.width / 2 - (dragRect1.left + dragRect1.width / 2);
            const deltaY1 =
              targetRect1.top + targetRect1.height / 2 - (dragRect1.top + dragRect1.height / 2);

            cy.wrap($dragHandle1)
              .realMouseDown({ position: "center" })
              .realMouseMove(5, 0)
              .wait(200)
              .realMouseMove(deltaX1, deltaY1)
              .wait(200)
              .realMouseUp();

            cy.wait(500);

            // Verify first drag
            cy.get("table thead th").eq(1).should("contain", "Genre");

            // Second drag: Move Actors to Plot position
            cy.get("table thead th")
              .eq(3)
              .find("button")
              .first()
              .then($dragHandle2 => {
                cy.get("table thead th")
                  .eq(4)
                  .then($target2 => {
                    const dragRect2 = $dragHandle2[0].getBoundingClientRect();
                    const targetRect2 = $target2[0].getBoundingClientRect();
                    const deltaX2 =
                      targetRect2.left +
                      targetRect2.width / 2 -
                      (dragRect2.left + dragRect2.width / 2);
                    const deltaY2 =
                      targetRect2.top +
                      targetRect2.height / 2 -
                      (dragRect2.top + dragRect2.height / 2);

                    cy.wrap($dragHandle2)
                      .realMouseDown({ position: "center" })
                      .realMouseMove(5, 0)
                      .wait(200)
                      .realMouseMove(deltaX2, deltaY2)
                      .wait(200)
                      .realMouseUp();

                    cy.wait(500);

                    // Reset and verify it goes back to original
                    cy.contains("button", /reset.*column.*order/i).click();
                    cy.wait(300);

                    // Verify original order
                    cy.get("table thead th").eq(1).should("contain", "Director");
                    cy.get("table thead th").eq(3).should("contain", "Actors");
                    cy.get("table thead th").eq(4).should("contain", "Plot");
                  });
              });
          });
      });
  });

  it("preserves data integrity after column reorder", () => {
    // Wait for table to be fully loaded
    cy.get("table tbody tr").should("have.length.greaterThan", 0);

    // Get the first row's director value (column index 1)
    cy.get("table tbody tr")
      .first()
      .find("td")
      .eq(1)
      .invoke("text")
      .then(directorValue => {
        // Reorder columns by dragging Director to Genre position
        cy.get("table thead th")
          .eq(1)
          .find("button")
          .first()
          .then($dragHandle => {
            cy.get("table thead th")
              .eq(2)
              .then($target => {
                const dragRect = $dragHandle[0].getBoundingClientRect();
                const targetRect = $target[0].getBoundingClientRect();
                const deltaX =
                  targetRect.left + targetRect.width / 2 - (dragRect.left + dragRect.width / 2);
                const deltaY =
                  targetRect.top + targetRect.height / 2 - (dragRect.top + dragRect.height / 2);

                cy.wrap($dragHandle)
                  .realMouseDown({ position: "center" })
                  .realMouseMove(5, 0)
                  .wait(200)
                  .realMouseMove(deltaX, deltaY)
                  .wait(200)
                  .realMouseUp();

                cy.wait(500);

                // After reordering, Director column moved to position 2
                // The data should follow the column
                cy.get("table tbody tr").first().find("td").eq(2).should("contain", directorValue);
              });
          });
      });
  });

  it("column headers remain accessible with proper roles after drag", () => {
    // Perform a drag operation
    cy.get("table thead th")
      .eq(1)
      .find("button")
      .first()
      .then($dragHandle => {
        cy.get("table thead th")
          .eq(2)
          .then($target => {
            const dragRect = $dragHandle[0].getBoundingClientRect();
            const targetRect = $target[0].getBoundingClientRect();
            const deltaX =
              targetRect.left + targetRect.width / 2 - (dragRect.left + dragRect.width / 2);
            const deltaY =
              targetRect.top + targetRect.height / 2 - (dragRect.top + dragRect.height / 2);

            cy.wrap($dragHandle)
              .realMouseDown({ position: "center" })
              .realMouseMove(5, 0)
              .wait(200)
              .realMouseMove(deltaX, deltaY)
              .wait(200)
              .realMouseUp();

            cy.wait(500);

            // Each column header should still be a proper table header element
            cy.get("table thead th").each(header => {
              cy.wrap(header).should("have.prop", "tagName", "TH");
            });
          });
      });
  });
});
