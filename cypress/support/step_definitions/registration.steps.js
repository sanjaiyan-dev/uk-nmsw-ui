import {Given, When, Then, Before} from '@badeball/cypress-cucumber-preprocessor';
import PasswordPage from '../../e2e/pages/registration/password.page.js';
import LandingPage from '../../e2e/pages/landing.page';
import YourDetailPage from '../../e2e/pages/registration/yourDetails.page.js';
import EmailPage from '../../e2e/pages/registration/email.page.js';
import ConfirmationPage from '../../e2e/pages/registration/confirmation.page';
import BasePage from '../../e2e/pages/base.page';
import {faker} from '@faker-js/faker';
import SignInPage from '../../e2e/pages/sign-in.page.js';

let email;
let password;
let companyName;
const inboxId = Cypress.env('inboxId');

Before(() => {
  email = faker.internet.email();
  password = faker.internet.password();
  companyName = faker.company.name();
});

Given('I am on NMSW landing page', () => {
  cy.visitUrl('/');
  LandingPage.checkHeading();
});

When('I click create an account on the landing page', () => {
  LandingPage.createAccount();
});

Then('the registration page is displayed', () => {
  EmailPage.verifyEmailPage();
});

When('I provide my email address', () => {
  cy.deleteAllEmails(inboxId);
  cy.registerUser();
  cy.wait('@registration').then(({response}) => {
    expect(response.statusCode).to.equal(200);
  });
});

When('I verify the email address', () => {
  EmailPage.verifyCheckYourEmailPage();
  cy.activateAccount();
  cy.wait('@verifyRegistration').then(({response}) => {
    expect(response.statusCode).to.eq(204);
  });
});

Then('the email address verified page is loaded with a continue button', () => {
  EmailPage.checkActivateAccountPage();
  cy.contains('Continue').click();
});

Then('I am redirected to provide my other details', () => {
  cy.url().should('include', '/your-details');
});

When('I provide all my details', () => {
  YourDetailPage.typeFullName(faker.name.fullName());
  YourDetailPage.typeCompanyName(companyName);
  YourDetailPage.typePhoneCode('44');
  YourDetailPage.typePhoneNumber('9087654321');
  YourDetailPage.typeCountry('GBR');
  YourDetailPage.isShippingAgentYes();
  BasePage.clickContinue();
});

Then('I am redirected to password page', () => {
  cy.url().should('include', 'your-password');
});

When('I provide my password', () => {
  PasswordPage.verifyLink3RandomWords();
  PasswordPage.typePassword(password);
  PasswordPage.typeRepeatPassword(password);
  cy.intercept('PATCH', '*/registration').as('registration');
  BasePage.clickContinue();
  cy.wait('@registration').then(({response}) => {
    expect(response.statusCode).to.equal(200);
  });
});

When('I provide my new password', () => {
  PasswordPage.verifyLink3RandomWords();
  PasswordPage.typePassword(password);
  PasswordPage.typeRepeatPassword(password);
  cy.intercept('PATCH', '*/registration').as('registration');
  BasePage.clickContinue();
  cy.wait('@registration').then(({response}) => {
    expect(response.statusCode).to.equal(409);
  });
});

Then('my account is created and taken to confirmation page', () => {
  cy.url().should('include', '/account-created');
  ConfirmationPage.verifyAccountTitle();
  ConfirmationPage.verifyCompanyName(companyName);
  cy.contains('Sign in');
});

When('I click continue without providing any details', () => {
  BasePage.clickContinue();
});

When('I click send verification email without providing any details', () => {
  BasePage.clickSendConfirmationEmail();
});

Then('I am shown form error message', (table) => {
  const data = table.rowsHash();
  BasePage.verifyFormErrorMessages(data['Error']);
});

Then('I am shown corresponding error message', (table) => {
  const data = table.rowsHash();
  BasePage.verifyFieldError(data['Field'], data['Error']);
});

When('I enter invalid email address and continue without confirm email address', () => {
  EmailPage.enterEmailAddress('randomemail@mail');
  BasePage.clickSendConfirmationEmail();
});

When('I enter confirm email which is not same as email address', () => {
  EmailPage.enterEmailAddress(faker.internet.email());
  EmailPage.enterConfirmEmailAddress(faker.internet.email());
  BasePage.clickSendConfirmationEmail();
});

When('I enter password less than 10 characters', () => {
  PasswordPage.typePassword('Test123');
  PasswordPage.typeRepeatPassword('Test123');
  BasePage.clickContinue();
});

When('I enter password in invalid format', () => {
  PasswordPage.typePassword('Password    ');
  PasswordPage.typePassword(('Password    '));
});

When('I navigate back to landing page', () => {
  cy.visitUrl('/');
});

When('I create an account with same email previously registered', () => {
  LandingPage.createAccount();
  EmailPage.verifyEmailPage();
  cy.registerUser();
  cy.wait('@registration').then(({response}) => {
    expect(response.statusCode).to.equal(409);
  });
});

Then('I am shown the message user already registered', () => {
  EmailPage.emailVerifyMessage();
  cy.get('[data-testid="insetText"]').should('have.text', `Your email address ${email} is already registered with this service.`);
  BasePage.clickSignIn();
});

When('I verify the email address that is not valid', () => {
  cy.url().should('include', 'email-verified');
  EmailPage.enterVerifyEmail(faker.internet.email());
  BasePage.clickContinue();
});

When('I click sign-in', () => {
  BasePage.clickSignIn();
});

Then('I am taken to the sign-in page', () => {
  SignInPage.checkSignInPage();
});

When('I click back navigation button', () => {
  BasePage.clickBackButton();
});

Then('I am taken back to create an account page', () => {
  LandingPage.checkHeading();
});

When('the user has reached your-details page and the application cannot identify user email address', () => {
  cy.visitUrl('/create-account/your-details');
});

Then('the application redirect user to the verification failed page', () => {
  cy.url().should('include', '/verification-failed');
});

When('I click the resend verification email button', () => {
  EmailPage.clickResendConfirmationEmail();
});

Then('the user is redirected to request-new-verification-link', () => {
  cy.url().should('include', 'request-new-verification-link');
});

Then('I am shown - You already have an account', () => {
  cy.url().should('include', 'account-already-exists');
  cy.get('h1').should('have.text', 'You already have an account');
  BasePage.clickSignIn();
  SignInPage.checkSignInPage();
});

When('I verify my email address again', () => {
  cy.activateAccount();
  cy.wait('@verifyRegistration').then(({response}) => {
    expect(response.statusCode).to.eq(401);
  });
});

When('I click the verification link that is expired', () => {
  cy.waitForLatestEmail('fbeda492-3225-4cf2-84a1-846ad1149c10').then((mail) => {
    assert.isDefined(mail);
    const token = /token=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/.exec(mail.body)[1];
    const email = /email=([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i.exec(mail.body)[1];
    const activateUrl = `${Cypress.env('baseUrl')}/activate-account?email=${email}&token=${token}`;
    cy.intercept('POST', '**/v1/check*').as('verifyRegistration');
    cy.visit(activateUrl);
    cy.wait('@verifyRegistration').then(({response}) => {
      expect(response.statusCode).to.eq(401);
    });
  });
});

Then('I am shown \'link expired\' and the link to \'request new link\'', () => {
  cy.get('h1').should('have.text', 'Verification link has expired');
  cy.contains('Request a new link');
});

Then('I am taken to check your email page', () => {
  EmailPage.verifyCheckYourEmailPage();
});
