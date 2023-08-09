import {Given, When, Then, Before, After} from '@badeball/cypress-cucumber-preprocessor';
import PasswordPage from '../../e2e/pages/registration/password.page.js';
import LandingPage from '../../e2e/pages/landing.page';
import YourDetailPage from '../../e2e/pages/registration/yourDetails.page.js';
import EmailPage from '../../e2e/pages/registration/email.page.js';
import ConfirmationPage from '../../e2e/pages/registration/confirmation.page';
import BasePage from '../../e2e/pages/base.page';
import {faker} from '@faker-js/faker';
import SignInPage from '../../e2e/pages/sign-in.page.js';
import yourDetailsPage from "../../e2e/pages/registration/yourDetails.page.js";

let password;
let companyName;
let fullName;
const inboxId = Cypress.env('inboxId');

Before(() => {
  password = 'Test-NMSW-Dev';
  companyName = faker.company.name();
  fullName = faker.name.fullName();
});

After({tags: "@registration"}, () => {
  cy.removeTestUser();
});

Given('I am on NMSW landing page', () => {
  cy.visitUrl('/');
  cy.injectAxe();
  LandingPage.checkHeading();
  cy.checkAxe();
});

When('I click create an account on the landing page', () => {
  LandingPage.createAccount();
});

Then('the registration page is displayed', () => {
  EmailPage.verifyEmailPage();
  cy.injectAxe();
});

When('I provide my email address', () => {
  cy.deleteAllEmails(inboxId);
  cy.registerUser();
  cy.wait('@registration').then(({response}) => {
    expect(response.statusCode).to.be.oneOf([200, 409]);
  });
});

When('I verify the email address', () => {
  const text1 = 'You already have an account'
  cy.wait(1000);
  cy.get('.govuk-heading-xl').then(($text) => {
    if ($text.text() === text1) {
      cy.removeTestUser();
    } else {
      EmailPage.verifyCheckYourEmailPage();
    }
    cy.activateAccount();
    cy.wait('@verifyRegistration').then(({response}) => {
      expect(response.statusCode).to.eq(204);
    })
  });
});

Then('the email address verified page is loaded with a continue button', () => {
  cy.injectAxe();
  EmailPage.checkActivateAccountPage();
  cy.checkAxe();
  cy.contains('Continue').click();
});

Then('I am redirected to provide my other details', () => {
  cy.wait(1000);
  cy.url().should('include', '/your-details');
  cy.injectAxe();
});

When('I provide all my details', () => {
  YourDetailPage.typeFullName(fullName);
  YourDetailPage.typeCompanyName(companyName);
  YourDetailPage.typePhoneCode('33', 'diallingCode-input__option--0');
  YourDetailPage.typePhoneCode('+44', 'diallingCode-input__option--5');
  YourDetailPage.typePhoneNumber('+(44 - 9087654321 ).');
  yourDetailsPage.typeCountry('usa', 'country-input__option--0');
  yourDetailsPage.typeCountry('GBR', 'country-input__option--0');
  YourDetailPage.isShippingAgentYes();
  cy.checkAxe();
  BasePage.clickContinue();
});

Then('I am redirected to password page', () => {
  cy.injectAxe();
  cy.url().should('include', 'your-password');
});

When('I provide my password', () => {
  PasswordPage.verifyLink3RandomWords();
  PasswordPage.typePassword(password);
  PasswordPage.typeRepeatPassword(password);
  cy.intercept('PATCH', '*/registration').as('registration');
  BasePage.clickContinue();
  cy.wait('@registration').then(({response}) => {
    expect(response.statusCode).to.be.oneOf([200, 409, 401]);
  });
});

When('I provide my new password', () => {
  PasswordPage.verifyLink3RandomWords();
  PasswordPage.typePassword(password);
  PasswordPage.typeRepeatPassword(password);
  cy.intercept('PATCH', '*/registration').as('registration');
  cy.checkAxe();
  BasePage.clickContinue();
  cy.wait('@registration').then(({response}) => {
    expect(response.statusCode).to.equal(409);
  });
});

Then('my account is created and taken to confirmation page', () => {
  cy.injectAxe();
  cy.url().should('include', '/account-created');
  ConfirmationPage.verifyAccountTitle();
  ConfirmationPage.verifyCompanyName(fullName, companyName);
  cy.contains('Sign in');
  cy.checkAxe();
});

When('I click continue without providing any details', () => {
  BasePage.clickContinue();
});

When('I click send verification email without providing any details', () => {
  cy.checkAxe();
  BasePage.clickSendConfirmationEmail();
  cy.checkAxe();
});

Then('I am shown form error message', (table) => {
  const data = table.rowsHash();
  BasePage.verifyFormErrorMessages(data['Error']);
});

Then('I am shown corresponding error message', (table) => {
  cy.checkAxe();
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
  BasePage.clickContinue();
});

When('I navigate back to landing page', () => {
  cy.visitUrl('/');
});

When('I create an account with same email previously registered', () => {
  LandingPage.createAccount();
  EmailPage.verifyEmailPage();
  cy.registerUser();
  cy.wait('@registration').then(({response}) => {
    expect(response.statusCode).to.be.oneOf([409, 200]);
  });
});

Then('I am shown the message user already registered', () => {
  EmailPage.emailVerifyMessage();
  cy.fixture('registration.json').then((registration) => {
    cy.get('[data-testid="insetText"]').should('have.text', `Your email address ${registration.email} is already registered with this service.`);
  });
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
  cy.injectAxe();
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
  cy.contains('The verification link did not work. Resend the email to try again.')
});

When('I click the resend verification email button', () => {
  EmailPage.clickResendConfirmationEmail();
});

Then('the user is redirected to request-new-verification-link', () => {
  cy.url().should('include', 'request-new-verification-link');
});

Then('I am shown - You already have an account', () => {
  cy.url().should('include', 'account-already-exists');
  EmailPage.emailVerifyMessage();
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
  cy.injectAxe();
  EmailPage.verifyCheckYourEmailPage();
  cy.checkAxe();
});

Then('I can see email received to verify the email', () => {
  cy.waitForLatestEmail('e5fc776c-a811-4cc5-9392-019f3872938b');
  cy.wait(1000);
});

When('I am on request-new-verification-link', () => {
  cy.visitUrl('/create-account/request-new-verification-link');
  cy.injectAxe();
});

Then('I click `Request New Link` button', () => {
  cy.checkAxe();
  BasePage.clickRequestNewLink();
});

When('I enter the email address', () => {
  cy.fixture('registration.json').then((registration) => {
    EmailPage.enterEmailAddress(registration.email);
  });
});

When('I click on \'change email details link\'', () => {
  EmailPage.clickChangeWhereEmailSent();
});

When('I click on request new email', () => {
  cy.contains('Not received an email?').click();
});

When('I click on not received an email', () => {
  EmailPage.linkEmailNotReceived();
});

Then('I provide new email address', () => {
  let email2 = '117461e3-7e0a-45ec-96f1-3fb2701e9801@mailslurp.com';
  EmailPage.enterEmailAddress(email2).enterConfirmEmailAddress(email2);
  BasePage.clickSendConfirmationEmail();
});

Then('I click change the email sent and  change to different email', () => {
  EmailPage.clickChangeWhereEmailSent();
  cy.fixture('registration.json').then((registration) => {
    cy.get('#emailAddress-input').clear();
    EmailPage.enterEmailAddress(registration.email)
  });
});

When('I have typed at least one number in dialling code field', () => {
  cy.get('input#diallingCode-input').clear().type('8');
});

Then('a list of possible matched dialled code is returned', () => {
  cy.get('#diallingCode-input__listbox').find('li').each(($code) => {
    cy.wrap($code).should('contain.text', '8');
  });
});

When('I have typed at least 2 letters in the country field', () => {
  cy.get('#country-input').clear().type('ty');
});

Then('a list of possible matched country name is returned', () => {
  cy.get('#country-input__listbox').find('li').each(($country) => {
    cy.wrap($country).should('contain.text', 'ty');
  });
});

When('there are no dial codes that match the number given', () => {
  cy.get('input#diallingCode-input').clear().type('100');
});

Then('I am shown no results found for dialled code', () => {
  cy.get('#diallingCode-input__listbox').should('have.text', 'No results found')
});

When('there are no country names that contain combination of letters', () => {
  cy.get('#country-input').clear().type('qz');
});

Then('I am shown no results found for country field', () => {
  cy.get('#country-input__listbox').should('have.text', 'No results found')
});

When('I provide any letters in telephone number field', () => {
  YourDetailPage.typePhoneNumber('7867er');
  BasePage.clickContinue();
});

When(/^I enter non allowed symbols like  \/ (.*)$/, function () {
  YourDetailPage.typePhoneNumber('<44 \ 8905678 /');
  BasePage.clickContinue();
});

When('I enter only allowed symbols and NO numbers', () => {
  YourDetailPage.typePhoneNumber('().-+  ');
  BasePage.clickContinue();
});

When('I navigate back', () => {
  cy.go('back');
});
