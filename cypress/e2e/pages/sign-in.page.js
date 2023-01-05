class SignInPage{

  get emailAddress() {
    return cy.get('#email-input');
  }

  get password() {
   return  cy.get('#password-input');
  }

  checkSignInPage() {
    cy.url().should('include','sign-in');
    cy.get('h1').should('have.text','Sign in');
    cy.contains('create one now');
  }

  clickCreateOneLink() {
    cy.contains('create one now').click();
  }

  EnterEmailAddress(email) {
    this.emailAddress.clear().type(email)
  }

  EnterPassword(pwd) {
    this.password.clear().type(pwd)
  }

  clickSignIn() {
    cy.get('[data-testid="submit-button"]').click();
  }
}
export default new SignInPage();
