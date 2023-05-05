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
  DeclarationPage.bannerSubmitReport();
});

Then('I can see the confirmation banner for cancellation', () => {
  DeclarationPage.bannerCancelReport();
});

Then('I can see the status of reported voyage as SUBMITTED', () => {
  DeclarationPage.checkVoyageDetailsSubmittedStatus();
});

Then('I am taken to review your report with submitted status', () => {
  BasePage.checkH1('Review your report');
  DeclarationPage.checkCyaSubmittedStatus();
  DeclarationPage.verifyChangeLinkNotExist();
  DeclarationPage.verifySaveAndSubmitNotExist();
});

When('I click cancel, to cancel the submitted voyage report', () => {
  DeclarationPage.clickCancelButton();
});

Then('I can see the status of reported voyage as CANCELLED', () => {
  DeclarationPage.checkVoyageDetailsCancelledStatus();
});

Then('I am taken to review your report with Cancelled status', () => {
  DeclarationPage.checkCyaCancelledStatus();
  DeclarationPage.verifyChangeLinkNotExist();
  DeclarationPage.verifySaveAndSubmitNotExist();
  DeclarationPage.verifyCancelButtonNotExist();
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
