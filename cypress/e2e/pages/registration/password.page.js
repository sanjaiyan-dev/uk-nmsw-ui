import BasePage from '../base.page';

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

  clickForgotPasswordLink() {
    cy.get('a[href=\'/forgotten-password\']').should('have.text', 'Forgotten your password?').click();
  }

  checkForgottenPasswordPage() {
    cy.url().should('include', '/forgotten-password');
  }

  clickSendLinkBtn() {
    cy.contains('Send the link').click();
  }

  checkNewPasswordPage() {
    cy.url().should('include', 'new-password?token=');
    BasePage.checkH1('Change your password');
  }

  clickResetPassword() {
    cy.contains('Reset password').click();
  }

  clickPwdSignIn() {
    cy.contains('Sign in to start using the service').click();
  }

  checkYourDetails() {
    cy.get('dl:nth-child(2) > div:nth-child(1) > dt').should('have.text', 'Email address').next().should('have.text', 'abf4b167-04bc-4ff1-b4b0-7f9ceb0b6ffd@mailslurp.com');
    cy.get('dl:nth-child(2) > div:nth-child(2) > dt').should('have.text', 'Full name').next().should('have.text', 'Auto-test-report-Voyage');
    cy.get('dl:nth-child(2) > div:nth-child(3) > dt').should('have.text', 'Your company name').next().should('have.text', 'Test NMSW');
    cy.get('dl:nth-child(2) > div:nth-child(4) > dt').should('have.text', 'Phone number').next().should('have.text', '(44)0699999999');
    cy.get('dl:nth-child(2) > div:nth-child(5) > dt').should('have.text', 'Country').next().should('have.text', 'GBR');
    cy.get('dl:nth-of-type(2) div:nth-child(1) dt').should('have.text', 'Type of account').next().should('have.text', 'Admin');
  }
}

export default new PasswordPage();
