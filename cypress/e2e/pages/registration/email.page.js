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

  get heading() {
    return cy.get('h1');
  }

  //reusable methods
  verifyEmailPage() {
    cy.url().should('include', 'create-account/email-address');
    this.heading.should('have.text', 'What is your email address');
  }

  enterEmailAddress(email) {
    this.emailAddress.clear().type(email);
    return this;
  }

  enterConfirmEmailAddress(confirmEmail) {
    this.confirmEmailAddress.clear().type(confirmEmail);
    return this;
  }

  clickResendConfirmationEmail() {
    cy.contains('Resend confirmation email').click();
  }

//check your email page
  verifyCheckYourEmailPage() {
    cy.url().should('include', 'check-your-email');
    this.heading.should('have.text', 'Check your email');
  }

  linkEmailNotReceived() {
    cy.contains('Not received an email?').click();
  }

  //verify email page
  enterVerifyEmail(email) {
    this.heading.should('have.text', 'Your email address has been verified');
    this.verifyEmail.clear().type(email);
  }

  emailVerifyMessage() {
    cy.contains('You already have an account');
  }

//activate-account page
  checkActivateAccountPage() {
    this.heading.should('have.text', 'Your email address has been verified');
  }

  //link expired page
  linkExpired() {
    this.heading.should('have.text', 'Verification link has expired');
  }

  clickRequestButton() {
    cy.contains('Request a new link').click();
  }

  clickChangeWhereEmailSent() {
    cy.contains('Change the contact email address you want to use').click();
  }

}

export default new EmailPage();
