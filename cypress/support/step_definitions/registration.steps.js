import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PasswordPage from '../../e2e/pages/registration/password.page.js';
import LandingPage from '../../e2e/pages/landing.page';
import YourDetailPage from '../../e2e/pages/registration/yourDetails.page.js';
import EmailPage from '../../e2e/pages/registration/email.page.js';
import ConfirmationPage from '../../e2e/pages/registration/confirmation.page';
import BasePage from '../../e2e/pages/base.page';
import { faker } from '@faker-js/faker';

const email = faker.internet.email();
const password = faker.internet.password();
const companyName = faker.company.name();

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

When('I click continue without providing the email address', () => {
  BasePage.clickContinue();
});
