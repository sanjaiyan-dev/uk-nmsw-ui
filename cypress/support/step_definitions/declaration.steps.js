import {After, Then, When} from "@badeball/cypress-cucumber-preprocessor";
import DeclarationPage from "../../e2e/pages/declaration.page";
import BasePage from "../../e2e/pages/base.page";

After({tags: "@deleteDeclaration"}, () => {
  cy.deleteDeclaration();
});

Then('I can see the confirmation banner -Voyage details deleted', () => {
  DeclarationPage.bannerDeleteDraft();
});

Then('I can see the confirmation banner -Voyage details submitted', () => {
  cy.injectAxe();
  DeclarationPage.bannerSubmitReport();
  cy.checkAxe();
});

Then('I can see the confirmation banner for cancellation', () => {
  cy.injectAxe();
  DeclarationPage.bannerCancelReport();
  cy.checkAxe();
});

Then('I can see the status of reported voyage as SUBMITTED', () => {
  cy.injectAxe();
  DeclarationPage.checkVoyageDetailsStatus('submitted');
  cy.checkAxe();
});

Then('I am taken to review your report with submitted status', () => {
  cy.injectAxe();
  BasePage.checkH1('Review your report');
  DeclarationPage.checkCyaSubmittedStatus();
  DeclarationPage.verifyChangeLinkNotExist();
  DeclarationPage.verifySaveAndSubmitNotExist();
  cy.checkAxe();
});

When('I click cancel, to cancel the submitted voyage report', () => {
  cy.injectAxe();
  DeclarationPage.clickCancelButton();
  cy.checkAxe();
});

Then('I can see the status of reported voyage as CANCELLED', () => {
  cy.injectAxe();
  cy.wait(10000);
  DeclarationPage.checkVoyageDetailsStatus('cancelled');
  cy.checkAxe();
});

Then('I am taken to review your report with Cancelled status', () => {
  cy.injectAxe();
  DeclarationPage.checkCyaCancelledStatus();
  DeclarationPage.verifyChangeLinkNotExist();
  DeclarationPage.verifySaveAndSubmitNotExist();
  DeclarationPage.verifyCancelButtonNotExist();
  cy.checkAxe();
});

When('I click review or cancel action link next to Submitted status', () => {
  cy.get('@currentDeclaration').should('have.text','Review or cancel').click();
});

When('I click review action link next to Cancelled status', () => {
  cy.get('@currentDeclaration').should('have.text','Review').click();
});

When('I click review action link next to Failed status', () => {
  cy.get('@currentDeclaration').should('have.text','Review and re-submit').click();
});