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
  cy.injectAxe({timedOut:1000});
  DeclarationPage.bannerReportSent();
  cy.checkAxe();
});

Then('I can see the confirmation banner for cancellation', () => {
  cy.injectAxe({timedOut:1000});
  DeclarationPage.bannerCancelReport();
  cy.checkAxe({timedOut:1000});
});

Then('I can see the reported voyage', () => {
 DeclarationPage.checkCurrentDeclaration();
  cy.checkAxe();
});

Then('I can review the report with the pending or submitted status', () => {
  cy.reload();
  cy.get(':nth-child(1) > :nth-child(2) > dd strong').then(($el) => {
    if ($el.text() === 'Failed') {
      DeclarationPage.checkCyaFailedStatus();
    } else {
      BasePage.checkH1('Review your report');
      DeclarationPage.checkCyaSubmittedStatus();
      DeclarationPage.verifyChangeLinkNotExist();
      DeclarationPage.verifySaveAndSubmitNotExist();

    }

  });
});

When('I click cancel, to cancel the submitted voyage report', () => {
  cy.injectAxe({timedOut:1000});
  cy.wait(5000);
  DeclarationPage.clickCancelButton();
  cy.checkAxe();
  cy.wait(2000);
});

Then('I am taken to review the report with Cancelled status', () => {
  cy.injectAxe({timedOut:1000});
  DeclarationPage.checkCyaCancelledStatus();
  DeclarationPage.verifyChangeLinkNotExist();
  DeclarationPage.verifySaveAndSubmitNotExistonCancelledReport();
  DeclarationPage.verifyCancelButtonNotExist();
  cy.checkAxe();
});

When('I click review or cancel action link next to Pending status', () => {
  cy.wait(3000);
  cy.get('@currentDeclaration').should('contain.text', 'Review').click();
});

When('I click review action link next to Failed status', () => {
  cy.get('@currentDeclaration').should('contain.text', 'Review').click();
});

Then('I can see the reported voyage for crown dependency', () => {
  DeclarationPage.verifyCrownDependencyDeclaration();
});

Then('I can see the confirmation banner for cancellation for crown dependency report', () => {
  cy.get('#govuk-notification-banner-title').contains('Success');
  cy.get('h3.govuk-notification-banner__heading').should('contain.text', 'Report for CD NMSW Test Ship cancelled.');
});

When('I click change next to crew details', () => {
  cy.get('#crewDetails').parent().find('a').contains('Change').click();
});

When('I click change next to Passenger details', () => {
  cy.get('#passengerDetails').parent().find('a').contains('Change').click();
});

