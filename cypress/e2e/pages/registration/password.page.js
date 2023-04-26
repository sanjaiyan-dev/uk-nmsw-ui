import BasePage from "../base.page";

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
    BasePage.checkH1('Forgot password');
  }

  clickSendLinkBtn() {
    cy.contains('Send the link').click();
  }

  clickPasswordResetLink() {
    cy.waitForLatestEmail('7ee68e7d-c48e-438c-8422-c09bfe264e13').then((mail) => {
      assert.isDefined(mail);
      const token = /token=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/.exec(mail.body)[1];
      cy.wrap(token).as('token');
      cy.visitUrl(`/new-password?token=${token}`);
    });
  }

  passwordResetLinkUrl() {
    cy.get('@token').then((token) => {
      cy.visitUrl(`/new-password?token=${token}`);
    })
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
}

export default new PasswordPage();
