import SignInPage from "../e2e/pages/sign-in.page";
const {terminalLog} = require('../utils/axeTableLog.js');
import EmailPage from '../e2e/pages/registration/email.page.js';
import BasePage from '../e2e/pages/base.page';

const {MailSlurp} = require('mailslurp-client');
const apiKey = Cypress.env('MAIL_API_KEY');
const mailslurp = new MailSlurp({apiKey});
const inboxId = Cypress.env('inboxId');
const apiServer = Cypress.env('api_server');
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('checkAxe', () => {
  cy.checkA11y(null, null, terminalLog, true);
});

Cypress.Commands.add('visitUrl', (path) => {
  cy.visit(Cypress.env('baseUrl') + path);
});

//mailslurp
Cypress.Commands.add('registerUser', () => {
  cy.fixture('registration.json').then((registration) => {
    EmailPage.enterEmailAddress(registration.email).enterConfirmEmailAddress(registration.email);
    cy.intercept('POST', '*/registration').as('registration');
    BasePage.clickSendConfirmationEmail();
  });
});

Cypress.Commands.add('activateAccount', () => {
  cy.waitForLatestEmail(inboxId).then((mail) => {
    assert.isDefined(mail);
    const token = /token=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/.exec(mail.body)[1];
    const email = /email=([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i.exec(mail.body)[1];
    const activateUrl = `${Cypress.env('baseUrl')}/activate-account?email=${email}&token=${token}`
    cy.intercept('POST', '**/v1/check*').as('verifyRegistration');
    cy.visit(activateUrl);
  });
});

Cypress.Commands.add('waitForLatestEmail', (inboxId) => {
  return mailslurp.waitForLatestEmail(inboxId, 10000);
});

Cypress.Commands.add('deleteAllEmails', (inboxId) => {
  mailslurp.emptyInbox(inboxId);
});

Cypress.Commands.add('removeTestUser', () => {
  cy.fixture('registration.json').then((registration) => {
    let regEmail = registration.email;
    let pwd = registration.password;
    let token = cy.request({
      method: 'POST',
      url: `${apiServer}/sign-in`,
      body:
          {
            email: regEmail,
            password: pwd
          }
    }).then((response) => {
      // response.body is automatically serialized into JSON
      token = response.body.token;
      cy.request({
            method: 'DELETE',
            url: `${apiServer}/user`,
            auth: {
              'bearer': token
            }
          }
      )
    })
  })
});

Cypress.Commands.add('signIn', () => {
  cy.fixture('registration.json').then((registration) => {
    let signInEmail = registration.signInEmail;
    let password = registration.password;
    SignInPage.enterEmailAddress(signInEmail);
    SignInPage.enterPassword(password);
    cy.intercept('POST', '**/sign-in*').as('signIn');
    BasePage.clickSignIn();
    cy.wait('@signIn').then(({response}) => {
      expect(response.statusCode).to.equal(200);
    });
  })
});
