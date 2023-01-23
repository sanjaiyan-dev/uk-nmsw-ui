class SignInPage {

  get password() {
    return cy.get('#password-input');
  }

  checkSignInLink() {
    cy.contains('Sign in');
  }

  checkSignInPage() {
    cy.url().should('include', 'sign-in');
    cy.get('h1').should('have.text', 'Sign in');
    cy.contains('create one now');
  }

  clickCreateOneLink() {
    cy.contains('create one now').click();
  }

  enterPassword(pwd) {
    this.password.clear().type(pwd)
  }

}

export default new SignInPage();
