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
    cy.get('main#content div:nth-child(2) > div > p').should('have.text','You have completed 0 of 2 sections.')
    cy.get(':nth-child(2) > .app-task-list__items > .app-task-list__item').contains('Check answers and submitCannot start yet');
  }

  checkVoyageType(voyageType) {
    cy.get('.govuk-inset-text').contains(voyageType);
  }

  clickDeleteDraftButton() {
    cy.contains('Delete draft').click();
  }

  clickSupportingDocsLink() {
    cy.contains('Supporting documents').click();
    cy.wait(1000);
  }

  clickYesDeleteDraft() {
    cy.get('input[value=deleteDraftYes]').click();
    cy.contains('Confirm').click();
  }

  clickNoDeleteDraft() {
    cy.get('input[value=deleteDraftNo]').click();
    cy.contains('Confirm').click();
  }

  checkFal5Status() {
    cy.get('main#content li:nth-child(2) > a > strong').should('have.text','Completed');
  }

  checkFal6Status() {
    cy.get('main#content li:nth-child(3) > a > strong').should('have.text','Completed');
    cy.get('main#content div:nth-child(2) > div > p').should('have.text','You have completed 1 of 2 sections.');
  }

  checkFal6StatusBeforeFal5Upload() {
    cy.get('main#content li:nth-child(3) > a > strong').should('have.text','Completed');
    cy.get('main#content div:nth-child(2) > div > p').should('have.text','You have completed 0 of 2 sections.');
  }

  checkFal6StatusBeforeFal6Upload() {
    cy.get('main#content li:nth-child(3) > a > strong').should('have.text','Required');
  }

}

export default new TaskPage();
