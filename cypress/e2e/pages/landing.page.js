class LandingPage{

  checkHeading() {
    cy.get('h1').should('have.text', 'National Maritime Single Window');
  }

  createAccount() {
    cy.contains('create an account').should('be.visible').click();
  }

  clickStartNow() {
    cy.get('.govuk-button--start').should('have.text', 'Start now').click();
  }
}

export default new LandingPage();

