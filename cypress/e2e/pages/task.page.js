class TaskPage {

  checkTaskPage() {
    cy.url().should('include', 'report-voyage');
    cy.get('.govuk-heading-xl').contains('Report a voyage');
  }

  checkShipName(shipName) {
    cy.get('.govuk-inset-text').contains(shipName);
  }

  checkFal1UploadDocStatus() {
    cy.get(':nth-child(1) > .app-task-list__items > :nth-child(1)').contains('General Declaration (FAL 1)Completed');
    cy.get(':nth-child(2) > .app-task-list__items > .app-task-list__item').contains('Check answers and submitCannot start yet');
  }

  checkVoyageType(voyageType) {
    cy.get('.govuk-inset-text').contains(voyageType);
  }

  checkDeleteDraftButton() {
    cy.contains('Delete draft');
  }

  clickSupportingDocsLink() {
    cy.contains('Supporting documents').click();
  }

}

export default new TaskPage();
