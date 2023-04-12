class YourVoyagePage {

  clickReportVoyage() {
    cy.contains('Report a voyage').click();
  }

  checkVoyageDetails() {
    cy.contains('All report types');
    // cy.get('.govuk-heading-s').should('have.text', '1 reported voyages');
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
      cy.wrap($row).should('have.text', 'NMSW Test ShipVoyage type:Arrival to the UKDate:15 February 2023Status draftActions Continue');
    })
  }
}

export default new YourVoyagePage();
