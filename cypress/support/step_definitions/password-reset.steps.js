import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import PasswordPage from "../../e2e/pages/registration/password.page";
import EmailPage from "../../e2e/pages/registration/email.page";
import BasePage from "../../e2e/pages/base.page";
import SignInPage from "../../e2e/pages/sign-in.page";

When('I click Forgotten your password? link', () => {
    PasswordPage.clickForgotPasswordLink();
});

Then('I am taken to forgotten-password page', () => {
    PasswordPage.checkForgottenPasswordPage();
    cy.injectAxe({timedOut:1000});
});

When('I enter my email to request a forgotten password link', () => {
    cy.deleteAllEmails('7ee68e7d-c48e-438c-8422-c09bfe264e13');
    cy.fixture('registration.json').then((registration) => {
        EmailPage.enterEmailAddress(registration.signInEmail2);
    })
});

Then('I click send the link', () => {
    cy.checkAxe();
    PasswordPage.clickSendLinkBtn();
});

When('I click the password reset link received', () => {
    cy.waitForLatestEmail('7ee68e7d-c48e-438c-8422-c09bfe264e13').then((mail) => {
        assert.isDefined(mail);
        //const token = /token=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/.exec(mail.body)[1];
        let token = mail.body.match(/token=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/g);
        token = token[1].split("=")[1]
        cy.wrap(token).as('token');
        cy.intercept('PATCH', '**/reset-password').as('passwordReset');
        cy.visitUrl(`/new-password?token=${token}`);
    });
});

Then('I am taken to new password page', () => {
    PasswordPage.checkNewPasswordPage();
    cy.injectAxe({timedOut:1000});
});

When('I click Reset password button without providing password details', () => {
    PasswordPage.clickResetPassword();
    cy.checkAxe();
});

When('I enter a new password', () => {
    PasswordPage.typePassword('NewPassword');
});

Then('I enter a confirmation password that is different to the new password', () => {
    PasswordPage.typeRepeatPassword('OddPassword');
    PasswordPage.clickResetPassword();
});

When('I enter a new password and confirmation password that matches the new password', () => {
    cy.injectAxe({timedOut:1000});
    PasswordPage.typePassword('NewPassword');
    PasswordPage.typeRepeatPassword('NewPassword');
    cy.intercept('POST', '/new-password?token=').as('verifyPasswordReset');
    cy.checkAxe();
    PasswordPage.clickResetPassword();
});

Then('I can see the confirmation screen with sign in link', () => {
    BasePage.checkH1('Your password has been reset');
    PasswordPage.clickPwdSignIn();
});

When('I sign-in with old password', () => {
    SignInPage.defaultSignIn();
});

When('I sign-in with new password', () => {
    cy.fixture('registration.json').then((registration) => {
        SignInPage.enterEmailAddress(registration.signInEmail2);
    });
    SignInPage.enterPassword('NewPassword');
    SignInPage.clickSignIn();
});

Then('I am shown the message - Password reset link has expired', () => {
    BasePage.checkH1('Password reset link has expired');
    cy.checkAxe();
});

When('user tries to reset password with missing token', () => {
    cy.visitUrl('/new-password?token=');
});

When('I click the same password reset link again', () => {
    cy.get('@token').then((token) => {
        cy.visitUrl(`/new-password?token=${token}`);
    })
    cy.injectAxe({timedOut:1000});
});

When('user tries to reset password with invalid token', () => {
    cy.visitUrl('/new-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjRmM2E1ZDg1LTk5YmQtNDZkYi1iOGVhLTgwZWE4NzcyYzljNUBtYWlsc2x1cnAuY29tIiwiZXhwIjoxNjgxOTIzNDgwLCJqaXQiOiIyZT');
});

Then('the user is redirected to request-new-password-link', () => {
    cy.url().should('include', 'request-new-link');
});

Then('I click change the email sent link', () => {
    cy.contains('Change where the email was sent').click();
    cy.injectAxe({timedOut:1000});
});

Then('I change to different email previously registered', () => {
    EmailPage.enterEmailAddress('jaybworkemail2@gmail.com')
});

When('I enter the email in invalid format', () => {
    EmailPage.enterEmailAddress('randomemail@mail');
});

When('I enter the email that is registered but not verified', () => {
    EmailPage.enterEmailAddress('49837b1e-f82d-4f1a-a110-382186aba817@mailslurp.com')
});

Then('I am shown email address has not been verified', () => {
    BasePage.checkH1('Email address not verified');
});

When('I click Resend verification email', () =>{
    cy.intercept('POST','**/resend-verification-email').as('verifyEmail');
    cy.contains('Resend verification email').click();
    cy.wait('@verifyEmail').then(({response}) => {
        expect(response.statusCode).to.eq(204);
    });
});

When('I click send verification email', () => {
    cy.checkAxe();
    BasePage.clickSendConfirmationEmail();
});

Then('I am taken to request-new-verification-link page', () => {
    cy.url().should('include', 'request-new-verification-link');
    BasePage.checkH1('Request a new verification link');
})

When('I enter an email address that is not registered', () => {
    EmailPage.enterEmailAddress('test@test.com')
});

Then('I am shown check your email page but email should not be sent', () => {
    cy.intercept('POST', '**/reset-password').as('verifyReg');
    PasswordPage.clickSendLinkBtn();
    cy.wait('@verifyReg').then(({response}) => {
        expect(response.statusCode).to.be.oneOf([401, 400]);
    });
});

Given('a user attempts to sign in with email that requires to reset', () => {
    SignInPage.enterEmailAddress('');
    SignInPage.enterPassword(this.user.password);
    SignInPage.clickSignIn();
});

Then('we redirect the user to a message page for service update', () => {
    cy.injectAxe({timedOut: 1000});
    BasePage.checkH1('Service update')
    cy.get('.govuk-grid-column-two-thirds  p.govuk-body').should('contain.text', `To continue to use the service, please reset your password. Any voyage reports you\'ve saved will not be affected.`);
    cy.contains('Reset password');
    cy.checkAxe();
});
