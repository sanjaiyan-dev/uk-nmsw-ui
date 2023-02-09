class SignInPage {

  get password() {
    return cy.get('#password-input');
  }

  get emailAddress() {
    return cy.get('#email-input');
  }

  checkSignInLink() {
    cy.contains('Sign in');
  }

//sign-in for sign-in page
  clickSignIn() {
    cy.get('[data-testid="submit-button"]').click();
  }

  checkSignInPage() {
    cy.url().should('include', 'sign-in');
    cy.get('h1').should('have.text', 'Sign in');
    cy.contains('create one now');
  }

  clickCreateOneLink() {
    cy.contains('create one now').click();
  }

  enterEmailAddress(email) {
    this.emailAddress.clear().type(email);
    return this;
  }

  enterPassword(pwd) {
    this.password.clear().type(pwd)
  }

  checkSignOut() {
    cy.contains('Sign out');
  }

  clickSignOut() {
    cy.intercept('POST', '*/sign-out').as('sign-out');
    cy.contains('Sign out').click();
    cy.wait('@sign-out').then(({response}) => {
      expect(response.statusCode).to.equal(200);
    })
  }
}

export default new SignInPage();
