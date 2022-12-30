class ConfirmationPage {

  get accountConfirmPanel() {
    return cy.get('.govuk-panel--confirmation');
  }

  verifyAccountTitle() {
    cy.get('.govuk-panel__title').should('have.text', 'Account created');
  }

  verifyCompanyName(companyName) {
    cy.get('.govuk-panel__body').should('have.text', companyName + ' has been setup.');
  }

  verifyUserNotRegistered() {
    cy.contains('User is not registered');
  }
}

export default new ConfirmationPage();
