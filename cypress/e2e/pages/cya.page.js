class CyaPage {

  verifyCYAPage() {
    cy.url().should('include', 'check-your-answers');
    cy.get('h1').should('have.text', 'Check your answers');
  }

  verifyCheckAnswersAndSubmitLink() {
    cy.contains('Check answers and submit');
  }

  clickCheckAnswersAndSubmit() {
    cy.contains('Check answers and submit').click();
  }

  verifySaveAndSubmitButton() {
    cy.contains('Save and submit');
  }

  verifyH2Headings() {
    cy.contains('Voyage details');
    cy.contains('Uploaded documents');
  }
 clickChangeVoyageDetailLink() {
   cy.get('dl:nth-of-type(1) > div:nth-of-type(1) > .govuk-summary-list__actions > a').should('have.text','Change change voyage details').click();
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
}

export default new CyaPage();
