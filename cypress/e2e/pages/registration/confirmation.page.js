class ConfirmationPage {

  get accountConfirmPanel() {
    return cy.get('.govuk-panel--confirmation');
  }

  verifyAccountTitle() {
    cy.get('.govuk-panel__title').should('have.text', 'Account created');
  }

  verifyCompanyName(fullName, companyName) {
    cy.get('.govuk-panel__body').should('have.text', 'For ' + fullName + 'Now a team member at ' + companyName);
  }

  verifyUserNotRegistered() {
    cy.contains('User is not registered');
  }
}

export default new ConfirmationPage();
