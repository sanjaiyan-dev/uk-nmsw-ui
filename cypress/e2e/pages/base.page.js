class BasePage {

  clickContinue() {
    cy.contains('Continue').should('be.enabled').click({force: true});
  }

  clickSendConfirmationEmail() {
    cy.contains('Send confirmation email').should('be.enabled').click({force: true});
  }

// sign-in for other pages
  clickSignIn() {
    cy.contains('Sign in').click();
  }

  clickBackButton() {
    cy.get('.govuk-back-link').should('be.visible').click();
  }

  //Error message validation
  verifyFormErrorMessages(error) {
    cy.get('.govuk-error-summary__body').should('have.text', error);
  }

  verifyFieldError(field, error) {
    cy.get(`#${field}`).should('have.text', error);
  }

  verifyText(message) {
    cy.contains(message);
  }

  checkH1(message) {
    cy.get('h1').should('have.text', message);
  }
}

export default new BasePage();
