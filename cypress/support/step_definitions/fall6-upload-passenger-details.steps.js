import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import FileUploadPage from "../../e2e/pages/file-upload.page";

When('I click Passenger details link', () => {
  cy.contains('Any passenger details (FAL 6)').click();
});

Then('I am taken to Passenger-details page', () => {
  FileUploadPage.verifyPassengerDetailsPage();
});

Then('I am taken to upload-Passenger-details page', () => {
  FileUploadPage.verifyUploadPassengerDetailsPage()
});

When('I select Yes to uploading passenger details', () => {
  FileUploadPage.selectYesPassenger();
  FileUploadPage.clickSaveAndContinue();
});

When('I select No to uploading passenger details', () => {
  FileUploadPage.selectNoPassenger();
  FileUploadPage.clickSaveAndContinue();
});
