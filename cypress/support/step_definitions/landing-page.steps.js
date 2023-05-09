import {When, Then} from '@badeball/cypress-cucumber-preprocessor';
import LandingPage from "../../e2e/pages/landing.page";
import YourDetailsInfoPage from "../../e2e/pages/your-details-info.page";
import BasePage from "../../e2e/pages/base.page";

When('I click start now', () => {
  LandingPage.clickStartNow();
  cy.injectAxe();
});

When('I click service name header', () => {
  cy.get('.govuk-header__service-name').should('have.text', 'National Maritime Single Window').click();
  cy.wait(1000);
});

When('I click File templates, I can able to download to use', () => {
  cy.contains('(FAL 1)').click();
  cy.contains('(FAL 5)').click();
  cy.contains('(FAL 6)').click();
});

When('I click Your voyage tab', () => {
  cy.get('[data-testid="listitem-YourVoyages"] > .govuk-header__link').click();
});

When('I click your details tab', () => {
  cy.get('[data-testid="listitem-YourDetails"] > .govuk-header__link').click();
  cy.injectAxe();
});

When('I click help tab', () => {
  cy.get('[data-testid="listitem-Help"] > .govuk-header__link').click();
  cy.injectAxe();
});

Then('I am taken to your details page', () => {
  YourDetailsInfoPage.checkHeading();
  cy.checkAxe();
});

Then('I am taken to help and support page', () => {
  BasePage.checkH1('Help and support for the National Maritime Single Window');
  cy.checkAxe();
});

When('I click GOV UK logo', () => {
  cy.get('.govuk-header__logotype-text').click();
});

Then('I am taken to GOV UK page', () => {
  cy.origin('https://www.gov.uk/', () => {
    cy.get('.homepage-inverse-header__title').contains('Welcome to GOV.UK')
  })
  cy.visitUrl('/');
});

Then('I can click short survey link for feedback', () => {
  cy.scrollTo('bottom');
  cy.get('.feedback-banner-text--container').contains('We welcome your feedback');
  cy.get('[data-testid="feedbackText"] > .govuk-link').invoke('removeAttr', 'target').click();
  cy.visitUrl('/');
});

When('I click submit required forms using email', () => {
  cy.contains('submit the required forms using email').click();
});

When('I click footer Contact us Link', () => {
  cy.get('li:nth-of-type(4) > .govuk-footer__link').should('have.text', 'Contact us').click();
  cy.injectAxe();
});

Then('I am taken to contact us page', () => {
  BasePage.checkH1('Contact us');
  cy.checkAxe();
});

When('I click footer Accessibility link', () => {
  cy.get('li:nth-of-type(3) > .govuk-footer__link').should('have.text', 'Accessibility').click();
  cy.injectAxe();
});

When('I click footer Cookies link', () => {
  cy.get('li:nth-of-type(2) > .govuk-footer__link').should('have.text', 'Cookies').click();
  cy.injectAxe();
});

Then('I am taken to cookie page', () => {
  BasePage.checkH1('Cookies');
  cy.checkAxe();
});

Then('I am taken to accessibility page', () => {
  BasePage.checkH1('Accessibility statement for National Maritime Single Window');
  cy.checkAxe();
});

When('I click Privacy link', () => {
  cy.get('li:nth-of-type(1) > .govuk-footer__link').should('have.text', 'Privacy').click();
  cy.injectAxe();
});

Then('I am taken to Privacy notice page', () => {
  BasePage.checkH1('Privacy notice for National Maritime Single Window');
  cy.checkAxe();
});

When('I click help section in contact us page', () => {
  cy.get('.govuk-body > .govuk-link').should('have.text', 'help section').click();
  cy.injectAxe();
});

Then('I am taken to help and support page with help menu highlighted', () => {
  BasePage.checkH1('Help and support for the National Maritime Single Window');
  cy.get('li.govuk-header__navigation-item.govuk-header__navigation-item--active').should('have.text', 'Help');
  cy.checkAxe();
});
