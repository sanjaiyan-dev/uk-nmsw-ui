import {After, Then, When} from "@badeball/cypress-cucumber-preprocessor";
import DeclarationPage from "../../e2e/pages/declaration.page";
import BasePage from "../../e2e/pages/base.page";

After({tags: "@deleteDeclaration"}, () => {
  cy.deleteDeclaration();
});

Then('I can see the confirmation banner -Voyage details deleted', () => {
  DeclarationPage.bannerDeleteDraft();
});

Then('I can see the confirmation banner -Voyage details sent', () => {
  cy.injectAxe();
  DeclarationPage.bannerReportSent();
  cy.checkAxe();
});

Then('I can see the confirmation banner for cancellation', () => {
  cy.injectAxe();
  DeclarationPage.bannerCancelReport();
  cy.checkAxe();
});

Then('I can see the status of reported voyage as {string}', (status) => {
 DeclarationPage.checkCurrentDeclaration();
  DeclarationPage.checkVoyageDetailsStatus(status.toLowerCase());
  cy.checkAxe();
});

Then('I can review the report with submitted status', () => {
  cy.injectAxe();
  cy.get(':nth-child(1) > :nth-child(2) > dd strong').then(($el) => {
    if ($el.text() === 'Failed') {
      DeclarationPage.checkCyaFailedStatus();
    } else {
      BasePage.checkH1('Review your report');
      DeclarationPage.checkCyaSubmittedStatus();
      DeclarationPage.verifyChangeLinkNotExist();
      DeclarationPage.verifySaveAndSubmitNotExist();
    }
    cy.checkAxe();
  });
});

When('I click cancel, to cancel the submitted voyage report', () => {
  cy.injectAxe();
  cy.wait(5000);
  DeclarationPage.clickCancelButton();
  cy.checkAxe();
  cy.wait(2000);
});

Then('I am taken to review your report with Cancelled status', () => {
  cy.injectAxe();
  DeclarationPage.checkCyaCancelledStatus();
  DeclarationPage.verifyChangeLinkNotExist();
  DeclarationPage.verifySaveAndSubmitNotExist();
  DeclarationPage.verifyCancelButtonNotExist();
  cy.checkAxe();
});

When('I click review or cancel action link next to Pending status', () => {
  cy.wait(3000);
  cy.get('@currentDeclaration').should('contain.text', 'Review').click();
});

When('I click review action link next to Cancelled status', () => {
  cy.wait(5000);
  cy.get('@currentDeclaration').should('contain.text', 'Review').click();
  cy.wait(1000);
});

When('I click review action link next to Failed status', () => {
  cy.get('@currentDeclaration').should('contain.text', 'Review').click();
});

Then('I can see the status of crown dependency voyage reported as {string}', (status) => {
  DeclarationPage.verifyCrownDependencyVoyage(status.toLowerCase());
});

Then('I can see the confirmation banner for cancellation for crown dependency report', () => {
  cy.get('#govuk-notification-banner-title').contains('Success');
  cy.get('h3.govuk-notification-banner__heading').should('contain.text', 'Report for CD NMSW Test Ship cancelled.');
});

Then('I can see the report status changes to Submitted', () => {
  cy.waitForStatusChange();
  cy.contains('Status').next().then((statusDetail) => {
    const statusAndDate = statusDetail.text()
    cy.wrap(statusAndDate).as('externalStatus');
  })
  cy.wait(3000);
});
