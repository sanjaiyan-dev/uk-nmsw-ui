import {When, Then} from '@badeball/cypress-cucumber-preprocessor';
import LandingPage from "../../e2e/pages/landing.page";
import YourDetailsInfoPage from "../../e2e/pages/your-details-info.page";

When('I click start now', () => {
  LandingPage.clickStartNow();
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
});

Then('I am taken to your details page', () => {
  YourDetailsInfoPage.checkHeading();
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
