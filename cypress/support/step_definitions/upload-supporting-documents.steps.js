import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import taskPage from "../../e2e/pages/task.page";
import fileUploadPage from "../../e2e/pages/file-upload.page";

When('I click supporting documents link', () => {
  taskPage.clickSupportingDocsLink();
});

Then('I am taken to upload supporting documents page', () => {
  fileUploadPage.verifySupportingDocumentsPage();
});

When('I am able to choose valid number of documents, to upload in Files added section', (table) => {
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
  fileUploadPage.selectMultipleFiles(table);
});

When('I attempt to add a file with the same name that is already added', (table) => {
  fileUploadPage.selectMultipleFiles(table);
});

Then('I am shown an error message for {string}', (file) => {
  cy.get('.multi-file-upload--error-summary').should('have.text', `Error: A file called ${file} already exists in your list`);
});

Then('I am able to delete the file', () => {
  cy.get('.multi-file-upload--filelist').should('have.length', 7);
  fileUploadPage.clickDelete();
  cy.get('.multi-file-upload--filelist').should('have.length', 6);
});

When('I upload a valid file, it gets uploaded', (table) => {
  fileUploadPage.selectMultipleFiles(table);
  cy.contains('Upload files').click();
  cy.get('.success .multi-file-upload--filelist-filename').should('have.css', 'color', 'rgb(0, 112, 60)').should('have.text', 'General declaration FAL 1 - goodData.xlsx has been uploaded');
});

When('I upload an invalid file, it gets rejected', (table) => {
  fileUploadPage.selectMultipleFiles(table);
  cy.contains('Upload files').click();
  cy.get('.error .multi-file-upload--filelist-filename').should('have.css', 'color', 'rgb(212, 53, 28)').should('contain.text', 'MELLINA GEN DEC2.xlsx There was a problem check file and try again');
});
