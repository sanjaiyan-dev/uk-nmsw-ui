import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';
import PasswordPage from '../../e2e/pages/registration/password.page.js';
import LandingPage from '../../e2e/pages/landing.page';
import YourDetailPage from '../../e2e/pages/registration/yourDetails.page.js';
import EmailPage from '../../e2e/pages/registration/email.page.js';
import ConfirmationPage from '../../e2e/pages/registration/confirmation.page';
import BasePage from '../../e2e/pages/base.page';
import { faker } from '@faker-js/faker';

let email;
let password;
let companyName;

Before(()=> {
  email = faker.internet.email();
  password = faker.internet.password();
  companyName = faker.company.name();
});

Given('I am on NMSW landing page', () => {
  cy.visit('/');
  LandingPage.checkHeading();
});

When('I click create an account on the landing page', () => {
  LandingPage.createAccount();
});

Then('the registration page is displayed', () => {
  cy.url().should('include','create-account/email-address');
});

When('I can provide my email address', () => {
  EmailPage.checkEmailHeading();
  EmailPage.enterEmailAddress(email).enterConfirmEmailAddress(email);
  BasePage.clickContinue();
});

When('I verify the email address', () => {
  cy.url().should('include','email-verified');
  EmailPage.enterVerifyEmail(email);
  BasePage.clickContinue();
});

Then('I am redirected to provide my other details', () => {
  cy.url().should('include','/your-details');
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
  cy.url().should('include','your-password');
});

When('I provide my password', () => {
  PasswordPage.verifyLink3RandomWords();
  PasswordPage.typePassword(password);
  PasswordPage.typeRepeatPassword(password);
  BasePage.clickContinue();
});

Then('my account is created and taken to confirmation page', () => {
  cy.url().should('include','/account-created');
  ConfirmationPage.verifyAccountTitle();
  ConfirmationPage.verifyCompanyName(companyName);
  cy.contains('Sign in');
});

When('I click continue without providing any details', () => {
  BasePage.clickContinue();
});

Then('I am shown form error message', (table) => {
  const data = table.rowsHash();
  BasePage.verifyFormErrorMessages(data['Error']);
});

Then('I am shown corresponding error message', (table) => {
  const data = table.rowsHash();
  BasePage.verifyFieldError(data['Field'], data['Error'])
});

When('I enter invalid email address and continue without confirm email address', () => {
  EmailPage.enterEmailAddress('randomemail@mail');
  BasePage.clickContinue();
});

When('I enter confirm email which is not same as email address', () => {
  EmailPage.enterEmailAddress(faker.internet.email());
  EmailPage.enterConfirmEmailAddress(faker.internet.email());
  BasePage.clickContinue();
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
  cy.visit('/');
});

When('I create an account with same email previously registered', () => {
  LandingPage.createAccount();
  EmailPage.checkEmailHeading();
  EmailPage.enterEmailAddress(email).enterConfirmEmailAddress(email);
  BasePage.clickContinue();
});

Then('I am shown the error', () => {
  EmailPage.EmailVerifyErrorMessage();
});
