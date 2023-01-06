class BasePage {

  clickContinue() {
    cy.contains('Continue').should('be.enabled').click({force: true});
  }

  clickSignIn() {
    cy.contains('Sign in').should('have.attribute', 'href').click();
  }

  //Error message validation
  verifyFormErrorMessages(error){
    cy.get('.govuk-error-summary__body').should('have.text', error)
  }

  verifyFieldError(field, error){
    cy.get(`#${field}`).should('have.text', error);
  }
}

export default new BasePage();
