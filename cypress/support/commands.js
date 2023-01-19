const {terminalLog} = require('../utils/axeTableLog.js');
import EmailPage from '../e2e/pages/registration/email.page.js';
import BasePage from '../e2e/pages/base.page';

const {MailSlurp} = require('mailslurp-client');
const apiKey = Cypress.env('MAIL_API_KEY');
const mailslurp = new MailSlurp({apiKey});
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
  const inboxId = Cypress.env('inboxId');
  cy.deleteAllEmails(inboxId);
  cy.fixture('registration.json').then((registration) => {
    EmailPage.enterEmailAddress(registration.email).enterConfirmEmailAddress(registration.email);
    cy.intercept('POST', '*/registration').as('registration');
    BasePage.clickSendConfirmationEmail();
    cy.wait('@registration').then(({response}) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});

Cypress.Commands.add('activateAccount', () => {
  const inboxId = Cypress.env('inboxId');

  cy.waitForLatestEmail(inboxId).then((mail) => {
    assert.isDefined(mail);
    const token = /token=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)/.exec(mail.body)[1];
    const email = /email=([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i.exec(mail.body)[1];
    const activateUrl = `${Cypress.env('baseUrl')}/activate-account?email=${email}&token=${token}`
    cy.intercept('POST', '**/v1/check*').as('verifyRegistration');
    cy.visit(activateUrl);
    cy.wait('@verifyRegistration').then(({response}) => {
      expect(response.statusCode).to.eq(204);
    });
  });
});

Cypress.Commands.add('waitForLatestEmail', (inboxId) => {
  return mailslurp.waitForLatestEmail(inboxId, 30000);
});

Cypress.Commands.add('deleteAllEmails', (inboxId) => {
  mailslurp.emptyInbox(inboxId);
});
