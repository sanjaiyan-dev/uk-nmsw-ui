import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import taskPage from "../../e2e/pages/task.page";
import fileUploadPage from "../../e2e/pages/file-upload.page";

When('I click supporting documents link', () => {
  taskPage.clickSupportingDocsLink();
});

Then('I am taken to upload supporting documents page', () => {
  fileUploadPage.verifySupportingDocumentsPage();
});

When('I am able to choose valid number of documents and upload in Files added section', (table) => {
  const files = table.hashes();
  const folderPath = 'cypress/fixtures/Supporting-Documents/';
  const fileNames = files.map(item => `${folderPath}${item.fileName}`);
  cy.contains('Choose files').parent().parent().click().selectFile(fileNames);
  files.forEach(item => {
    cy.contains(item.fileName);
  });
  fileUploadPage.checkPendingStatus();
  cy.contains('Upload files').click();
  cy.wait(2000);
});

When('I am able to add more limited number files to already added supporting files', (table) => {
  fileUploadPage.selectMultipleFalFiles(table);
  fileUploadPage.checkPendingStatus();
});

Then('I add more files than limited number of supporting documents', (table) => {
  fileUploadPage.selectMultipleFalFiles(table);
});

When('I add some more files than limited number of supporting documents', (table) => {
  fileUploadPage.selectMultipleFalFiles(table);
});

When('I attempt to add a file with the same name that is already added', (table) => {
  fileUploadPage.selectMultipleFalFiles(table);
});

Then('I am shown an error message for {string}', (file) => {
  cy.get('.multi-file-upload--error-summary').should('have.text', `Error: A file called ${file} already exists in your list`);
});

Then('I am able to delete the file', () => {
  cy.get('.multi-file-upload--filelist').should('have.length', 7);
  fileUploadPage.clickDelete();
  cy.get('.multi-file-upload--filelist').should('have.length', 6);
});

When('I upload a valid files, it gets uploaded', (table) => {
  fileUploadPage.selectMultipleFalFiles(table);
  const files = table.hashes();
  const fileNames = files.map(item => item.fileName);
  cy.intercept('POST', '**/supporting').as('uploadFile');
  cy.contains('Upload files').click();
  cy.get('.nmsw-grid-column-ten-twelfths').each(($el, index) => {
    cy.contains(`${fileNames[index]} has been uploaded`).should('have.css', 'color', 'rgb(0, 112, 60)');
  });
  cy.wait('@uploadFile');
});

When('I upload a file type that is not valid', (table) => {
  fileUploadPage.selectMultipleFalFiles(table);
  cy.contains('Upload files').click();
});

Then('I am shown error message to upload correct file type for the files uploaded', (table) => {
  fileUploadPage.checkIncorrectFileMsg(table);
});

Then('I can delete files added to add more files', () => {
  fileUploadPage.deleteMoreFiles();
});

When('I add files more than 1Mb', (table) => {
  fileUploadPage.selectMultipleFalFiles(table);
  cy.contains('Upload files').click();
  cy.wait(1000);
});

Then('I am shown error message file must be smaller than 1MB', (table) => {
  fileUploadPage.checkErrorForFileMaxSize(table);
});

When('I click on supporting documents link', () => {
  cy.contains('Supporting documents').click();
});

Then('I can see the supporting documents I have uploaded', (table) => {
  const files = table.hashes();
  const fileNames = files.map(item => item.fileName);
  cy.get('.success .multi-file-upload--filelist-filename').each(($el, index) => {
    cy.contains(`${fileNames[index]} has been uploaded`).should('have.css', 'color', 'rgb(0, 112, 60)');
  });
});

When('auth token is no longer available to upload file', () => {
  cy.window().its('sessionStorage').invoke('clear').then(() => {
    cy.reload();
  });
});
