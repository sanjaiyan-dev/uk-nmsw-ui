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

  selectMultipleFalFiles(table) {
    const files = table.hashes();
    const folder = 'cypress/fixtures/Supporting-Documents/';
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

  deleteMoreFiles() {
    cy.get('.nmsw-grid-column-two-twelfths button').then($ele => {
      let count = $ele.length
      for (let i = 0; i < count; i++) {
        cy.get('.nmsw-grid-column-two-twelfths button').first().click().should('not.exist')
      }
      cy.get('.multi-file-upload--filelist').should('have.length', 0);
    })
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

  clickUpload() {
    cy.contains('Upload files').click();
  }

  checkIncorrectFileMsg(table) {
    const files = table.hashes();
    const fileNames = files.map(item => item.fileName);
    cy.get('.multi-file-upload--filelist-filename').each(($ele, index) => {
      cy.contains(`${fileNames[index]} The file must be a csv, doc, docm, docx, rtf, txt, xls, xlsm, xlsx, xltm, xltx, xlw or xml`)
    })
  }

  getDeclarationId() {
    cy.wait('@declaration').then((result) => {
      let url = result.request.url;
      let declarationId = url.split("/")[5];
      cy.wrap(declarationId).as('declarationId');
    });
  }

  checkErrorForFileMaxSize(table) {
    const files = table.hashes();
    const fileNames = files.map(item => item.fileName);
    cy.get('.multi-file-upload--filelist-filename').each(($ele, index) => {
      cy.contains(`${fileNames[index]} The file must be smaller than 1MB`)
    })
  }

  getTotalReportsBefore() {
    try {
      cy.get('#content .govuk-grid-row.your-voyages__flex').then(() => {
        cy.get('h2[class="govuk-heading-s govuk-!-margin-bottom-1 reported-voyages-margin--top"]').then($el => {
          cy.wrap($el).invoke('text').as('totalReportsBefore');
        })
      })
    } catch (e) {
      cy.wrap(0).as('totalReportsBefore');
    }
  }

  getTotalReportsAfter() {
    try {
      cy.get('#content .govuk-grid-row.your-voyages__flex').then(() => {
        cy.get('h2[class="govuk-heading-s govuk-!-margin-bottom-1 reported-voyages-margin--top"]').then($el => {
          cy.wrap($el).invoke('text').as('totalReportsAfter');
        })
      })
    } catch (e) {
      cy.wrap(0).as('totalReportsAfter');
    }
  }

}

export default new FileUploadPage();
