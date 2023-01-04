class EmailPage {

  get verifyEmail() {
    return cy.get('#emailAddress-input');
  }

  get emailAddress() {
    return cy.get('input[name="emailAddress"]');
  }

  get confirmEmailAddress() {
    return cy.get('input[name="repeatEmailAddress"]');
  }

  get emailErrorMsg() {
    return cy.get('#emailAddress-error');
  }

  get emailHeading() {
    return cy.get('h1');
  }

  //reusable methods
  checkEmailPage() {
    cy.url().should('include','create-account/email-address');
    this.emailHeading.should('have.text', 'What is your email address');
  }

  enterEmailAddress(email) {
    this.emailAddress.clear().type(email);
    return this;
  }

  enterConfirmEmailAddress(confirmEmail) {
    this.confirmEmailAddress.clear().type(confirmEmail);
    return this;
  }

  //verify email page
  enterVerifyEmail(email) {
    this.emailHeading.should('have.text', 'Your email address has been verified');
    this.verifyEmail.clear().type(email);
  }
  emailVerifyMessage() {
    cy.contains('You already have an account');
  }

}

export default new EmailPage();
