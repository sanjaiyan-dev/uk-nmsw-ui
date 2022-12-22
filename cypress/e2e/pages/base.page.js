class BasePage {

  clickContinue() {
    cy.contains('Continue').should('be.enabled').click({force: true});
  }

  clickSignIn() {
    cy.contains('Sign in').should('have.attribute', 'href').click();
  }

  //Error message validation
  verifyFieldError(field, error) {
    cy.get(`#${field}`).should('have.text', error);
  }

  validateFieldErrorMessage(error) {
    cy.get('.govuk-error-message').should('contain.text', error);
  }
}

export default new BasePage();
