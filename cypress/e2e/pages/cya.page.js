class CyaPage {

  verifyCYAPage() {
    cy.url().should('include', 'check-your-answers');
    cy.get('h1').should('have.text', 'Check your answers');
  }

  clickCheckAnswersAndSubmit() {
    cy.contains('Check answers and submit').click();
    cy.wait(3000);
  }

  verifyConfirmAndSendButton() {
    cy.contains('Confirm and send');
  }

  clickConfirmAndSendButton() {
    cy.contains('Confirm and send').click();
  }

  verifyH2Headings() {
    cy.contains('Voyage details');
    cy.contains('Uploaded documents');
  }

  clickChangeVoyageDetailLink() {
    cy.get('dl:nth-of-type(1) > div:nth-of-type(1) > .govuk-summary-list__actions > a').should('have.text', 'Change change voyage details').click();
    cy.wait(1000);
  }

  verifyChangeLink() {
    const changeText = [
      ' change voyage details',
      ' change Crew details',
      ' change Passenger details',
      ' change Supporting documents',
    ];
    cy.get('.govuk-summary-list__actions :nth-child(1)  >span').each((text, index) => {
      cy.wrap(text).should('contain.text', changeText[index]);
    });
  }

  verifyFileUploaded(folderName, fileName) {
    switch (folderName) {
      case 'Fal5-Files':
        cy.get(':nth-child(1) > .govuk-summary-list__value > .govuk-link').should('include', fileName);
        break;
      case 'Fal6-Files':
        cy.get(':nth-child(2) > .govuk-summary-list__value > .govuk-link').should('include', fileName);
        break;
      case 'Supporting-Docs':
        cy.get('#supportingDocuments').parent.find('govuk-summary-list__value').should('include', fileName);
        break;
    }
  }

  clickFalUploadedFile(folderName) {
    switch (folderName) {
      case 'Fal5-Files':
        cy.get(':nth-child(1) > .govuk-summary-list__value > .govuk-link').invoke('attr', 'href').then((href) => {
          cy.downloadFile(href, 'downloads', 'fal5.xlsx');
        })
        break;
      case 'Fal6-Files':
        cy.get(':nth-child(2) > .govuk-summary-list__value > .govuk-link').invoke('attr', 'href').then((href) => {
          cy.downloadFile(href, 'downloads', 'fal6.xlsx');
        })
        break;
      case 'supportingDocs':
        cy.get('#supportingDocuments').parent().find('a').invoke('attr', 'href').then((href) => {
          cy.downloadFile(href, 'downloads', 'supportingDocs.xlsx');
        })
        break;
    }
  }
}

export default new CyaPage();
