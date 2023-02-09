import {When, Then, After} from '@badeball/cypress-cucumber-preprocessor';
import LandingPage from '../../e2e/pages/landing.page';
import BasePage from '../../e2e/pages/base.page';
import SignInPage from "../../e2e/pages/sign-in.page";

After({tags: "@signOut"},() => {
  SignInPage.clickSignOut();
});

When('I click template tab on the navigation bar', () => {
  LandingPage.clickTemplateTab();
  cy.injectAxe();
});

Then('I am taken to templates page, listing templates', () => {
  BasePage.checkH1('Templates');
  cy.injectAxe();
});

When('I click File templates, I can able to download', () => {
  cy.contains('(FAL 1)').click();
  cy.contains('(FAL 5)').click();
  cy.contains('(FAL 6)').click();
  cy.wait(2000);
  const file1Path = "cypress/downloads/General declaration FAL 1.xlsx";
  const file2Path = "cypress/downloads/Crew details including supernumeraries FAL 5.xlsx";
  const file3Path = "cypress/downloads/Passenger details FAL 6.xlsx";
  cy.task('filePresent', file1Path).should('be.true')
  cy.task('filePresent', file2Path).should('be.true')
  cy.task('filePresent', file3Path).should('be.true')
});
