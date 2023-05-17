import {Given, When, Then, Before, After} from '@badeball/cypress-cucumber-preprocessor';
import EmailPage from '../../e2e/pages/registration/email.page.js';
import SignInPage from '../../e2e/pages/sign-in.page.js';
import LandingPage from '../../e2e/pages/landing.page';
import BasePage from "../../e2e/pages/base.page";

Before(() => {
  cy.fixture('registration.json').then((user) => {
    this.user = user;
  });
});

After(() => {
  cy.clearAllSessionStorage()
});

Given('I am on the sign-in page', () => {
  cy.visitUrl("/");
  LandingPage.clickStartNow();
  SignInPage.checkSignInPage();
  cy.injectAxe();
});

When('I click on the create one now link', () => {
  SignInPage.clickCreateOneLink();
});

Then('I am taken to the create-account page', () => {
  EmailPage.verifyEmailPage();
});

When('I have entered a correct email address and password and sign in', () => {
  cy.signIn();
});

Then('I am taken to your-voyages page', () => {
  cy.injectAxe();
  cy.get('h1').should('have.text', 'Your voyages');
  cy.checkAxe();
});

When('I have entered an email address for an unverified email address', () => {
  SignInPage.enterEmailAddress('e5fc776c-a811-4cc5-9392-019f3872938b@mailslurp.com');
  SignInPage.enterPassword(this.user.password);
  SignInPage.clickSignIn();
});

Then('I am shown - Request a new verification link', () => {
  BasePage.verifyText('Request a new verification link');
});

When('I click sign-in without providing email and password', () => {
  SignInPage.clickSignIn();
});

When('the user enters invalid email address and sign-in', () => {
  SignInPage.enterEmailAddress('Test@com');
  SignInPage.enterPassword(this.user.password);
  SignInPage.clickSignIn();
});

When('I provide incorrect {string} and {string} and sign-in', (email, password) => {
  SignInPage.enterEmailAddress(email);
  SignInPage.enterPassword(password);
  cy.checkAxe();
  SignInPage.clickSignIn();
});

Then('I can able to sign-out', () => {
  SignInPage.clickSignOut();
});

When('I try to access a protected page', () => {
  cy.visitUrl('/your-voyages');
});
