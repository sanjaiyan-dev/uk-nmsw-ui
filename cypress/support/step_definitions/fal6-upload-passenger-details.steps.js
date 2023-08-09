import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import FileUploadPage from "../../e2e/pages/file-upload.page";

When('I click Passenger details link', () => {
  cy.contains('Any passenger details (FAL 6)').click();
  cy.wait(1000);
});

Then('I am taken to Passenger-details page', () => {
  cy.injectAxe();
  FileUploadPage.verifyPassengerDetailsPage();
  cy.checkAxe();
  cy.wait(1000);
});

Then('I am taken to upload-Passenger-details page', () => {
  FileUploadPage.verifyUploadPassengerDetailsPage();
  cy.injectAxe();
});

When('I select Yes to uploading passenger details', () => {
  FileUploadPage.selectYesPassenger();
  cy.intercept('PATCH','**/declaration/*').as('patch');
  cy.checkAxe();
  FileUploadPage.clickSaveAndContinue();
  cy.wait('@patch').its('request.body').should('deep.include',{passengers: true});
});

When('I select No to uploading passenger details', () => {
  FileUploadPage.selectNoPassenger();
  cy.intercept('PATCH','**/declaration/*').as('patch');
  FileUploadPage.clickSaveAndContinue();
  cy.wait('@patch').its('request.body').should('deep.include',{passengers: false});
});
