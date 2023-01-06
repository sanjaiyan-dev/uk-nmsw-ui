class PasswordPage {

  verifyLink3RandomWords() {
    cy.get('.govuk-inset-text > :nth-child(2) > a').should('be.visible');
  }

  typePassword(pwd) {
    cy.get('#requirePassword-input').clear().type(pwd);
  }

  typeRepeatPassword(repeatpwd) {
    cy.get('#repeatPassword-input').clear().type(repeatpwd);
  }
}

export default new PasswordPage();
