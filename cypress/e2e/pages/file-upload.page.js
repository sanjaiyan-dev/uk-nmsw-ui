const folderPath = 'cypress/fixtures/Supporting-Documents/';

class FileUploadPage {

  verifyUploadGeneralDecPage() {
    cy.get('h1').should('have.text', 'Upload the General Declaration (FAL 1)');
  }

  clickCheckForErrors() {
    cy.contains('Check for errors').click();
  }

  chooseFile(folderName, fileName) {
    let folder;
    switch (folderName) {
      case 'Fal1-Files':
        folder = 'Fal1-Files/'
        break;
      case 'Fal5-Files':
        folder = 'Fal5-Files/'
        break;
      case 'Fal6-Files':
        folder = 'Fal6-Files/'
        break;
      case 'supporting-Files':
        folder = 'supporting-File/'
        break;
    }
    cy.get('#fileUploadInput').click().selectFile('cypress/fixtures/' + folder + fileName);
  }

  chooseInvalidFile(fileName) {
    cy.get('#fileUploadInput').click().selectFile('cypress/fixtures/' + fileName);
  }

  checkNoErrors() {
    cy.contains('No errors found');
    cy.get('.govuk-notification-banner--success').contains('Success');
  }

  checkFileName(fileName) {
    cy.get('.govuk-notification-banner__heading').contains(fileName);
  }

  clickSaveAndContinue() {
    cy.contains('Save and continue').click();
  }

  clickReUploadFile() {
    cy.contains('Re-upload file').click();
  }

  verifyUploadCrewDetailsPage() {
    cy.url().should('include', 'upload-crew-details');
    cy.get('h1').contains('Upload the Crew details including supernumeraries (FAL 5)');
  }

  verifySupportingDocumentsPage() {
    cy.url().should('include', 'upload-supporting-documents');
    cy.get('h1').contains('Upload supporting documents');
  }

  clickChooseFiles() {
    cy.get('.govuk-button--text').contains('Choose files').click();
  }

  selectMultipleFiles(table) {
    const files = table.hashes();
    const fileNames = files.map(item => `${folderPath}${item.fileName}`);
    cy.contains('Choose files').parent().parent().click().selectFile(fileNames);
  }

  selectMultipleFalFiles(table) {
    const files = table.hashes();
    const folder = 'cypress/fixtures/Fal1-Files/';
    const fileNames = files.map(item => `${folder}${item.fileName}`);
    cy.contains('Choose files').parent().parent().click().selectFile(fileNames);
  }

  checkPendingStatus() {
    cy.get('.govuk-tag--grey').each(($el) => {
      cy.wrap($el).should('have.text', 'Pending');
    })
  }

  clickDelete() {
    cy.get(':nth-child(2) > .nmsw-grid-column-two-twelfths').contains('Delete').click();
  }

  verifyPassengerDetailsPage() {
    cy.url().should('include', 'passenger-details');
  }

  verifyUploadPassengerDetailsPage() {
    cy.url().should('include', 'upload-passenger-details');
  }

  selectYesPassenger() {
    cy.get('input[id="passengers-input[0]"]').click();
  }

  selectNoPassenger() {
    cy.get('input[id="passengers-input[1]"]').click();
  }
}

export default new FileUploadPage();
