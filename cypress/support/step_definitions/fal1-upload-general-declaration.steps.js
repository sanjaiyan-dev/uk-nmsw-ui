import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import YourVoyagePage from "../../e2e/pages/your-voyage.page";
import FileUploadPage from "../../e2e/pages/file-upload.page";
import LandingPage from "../../e2e/pages/landing.page";
import TaskPage from "../../e2e/pages/task.page";

let fileName;

When('I click report a voyage', () => {
  YourVoyagePage.clickReportVoyage();
});

Then('I am taken to upload-general-declaration page', () => {
  FileUploadPage.verifyUploadGeneralDecPage();
});

When('auth token is no longer available', () => {
  cy.clearAllSessionStorage()
});

Then('user is redirected to NMSW landing page', () => {
  LandingPage.checkHeading();
  LandingPage.checkStartNowButton();
});

When('I click check for errors without uploading any file', () => {
  FileUploadPage.clickCheckForErrors();
});

When('I have uploaded {string}{string}', (folderName, fileName) => {
  FileUploadPage.chooseFile(folderName, fileName);
  cy.wait(1000);
});

When('I upload the file larger than 4MB', () => {
  fileName = '10MbFile.pdf';
  FileUploadPage.chooseInvalidFile(fileName);
});

When('I upload the file is not of type .csv or .xlsx', () => {
  fileName = 'NonCsvXlsxFile.docx';
  FileUploadPage.chooseInvalidFile(fileName);
});

When('I upload a template file with null values', () => {
  fileName = 'Crew details including supernumeraries FAL 5.xlsx';
  FileUploadPage.chooseInvalidFile(fileName);
});

Then('previous the error message should clear', () => {
  cy.get('#fileUploadInput-error').should('not.be.visible');
});

When('I click check for errors', () => {
  cy.intercept('POST', '**/declaration/**').as('declaration');
  FileUploadPage.clickCheckForErrors();
});

Then('the FE sends a POST to the declaration-declarationId-upload-fal1 endpoint', () => {
  cy.wait('@declaration').then((result) => {
    let url = result.request.url;
    let declarationId = url.split("/")[5];
  });
});

When('there are no errors, I am shown the no errors found page', () => {
  FileUploadPage.checkNoErrors();
});

When('I click save and continue', () => {
  FileUploadPage.clickSaveAndContinue();
});

Then('I am taken to task details page', () => {
  TaskPage.checkTaskPage();
});

Then('I am directed back to the Upload general declaration FAL 1 page', () => {
  FileUploadPage.verifyUploadGeneralDecPage();
});
