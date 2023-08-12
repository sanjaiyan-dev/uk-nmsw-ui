import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import FileUploadPage from "../../e2e/pages/file-upload.page";

When('I click crew details link', () => {
  cy.contains('Crew details').click();
});

Then('I am taken to upload-crew-details page', () => {
  FileUploadPage.verifyUploadCrewDetailsPage();
  cy.injectAxe({timedOut:1000});
});
