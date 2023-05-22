class YourVoyagePage {

  clickReportVoyage() {
    cy.contains('Report a voyage').click();
  }
}

export default new YourVoyagePage();
