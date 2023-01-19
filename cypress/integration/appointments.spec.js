const { getByAltText } = require("@testing-library/react");

describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/")
      .contains("Monday");
  });
  
  it("should book an interview", () => {
    cy.get('[alt=Add]')
      .first()
      .click()
      .get('[data-testid="student-name-input"]')
      .type("Their Name")
      .get("[alt='Sylvia Palmer']")
      .click();

    cy.contains('Save')
      .click();
  });

  it("should edit an interview", () => {
    cy.get('[alt=Edit]')
      .first()
      .click({ force: true });

    cy.get('[data-testid="student-name-input"]')
      .clear()
      .type("New Name")
      .get("[alt='Tori Malcolm']")
      .click();

    cy.contains('Save')
      .click();
    cy.contains(".appointment__card--show", "New Name")
      .contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should delete an interview", () => {
    cy.get("[data-testid=delete-button]")
      .click({ force: true });

    cy.contains("Confirm").click();

    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });
});