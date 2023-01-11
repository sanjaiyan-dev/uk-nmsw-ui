import {Given, When, Then, Before} from '@badeball/cypress-cucumber-preprocessor';
import EmailPage from '../../e2e/pages/registration/email.page.js';
import SignInPage from '../../e2e/pages/sign-in.page.js';
import {faker} from '@faker-js/faker';
import LandingPage from '../../e2e/pages/landing.page';

let email;
let password;

Before(() => {
  email = faker.internet.email();
  password = faker.internet.password();
});

Given('I am on the sign-in page', () => {
  cy.visit('/');
  LandingPage.clickStartNow();
  SignInPage.checkSignInPage();
});

When('I click on the create one now link', () => {
  SignInPage.clickCreateOneLink();
});

Then('I am taken to the create-account page', () => {
  EmailPage.checkEmailPage();
});

When('I enter valid credentials and sign-in', () => {
  SignInPage.EnterEmailAddress(email);
  SignInPage.EnterPassword(password);
  SignInPage.clickSignIn();
});

Then('I am taken to your-voyages page', () => {
  cy.get('h1').should('have.text', 'Your voyages');
});
