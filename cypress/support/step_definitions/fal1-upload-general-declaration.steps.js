import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import YourVoyagePage from "../../e2e/pages/your-voyage.page";
import FileUploadPage from "../../e2e/pages/file-upload.page";
import LandingPage from "../../e2e/pages/landing.page";
import SignInPage from "../../e2e/pages/sign-in.page";
import BasePage from "../../e2e/pages/base.page";

let fileName;

When('I click report a voyage', () => {
  cy.intercept('POST', '**/declaration').as('newDeclaration');
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

When('I click check for errors for file not of type .csv or .xlsx', () => {
  FileUploadPage.clickCheckForErrors();
});

When('I click check for errors for file larger than 4MB', () => {
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

When('I upload a template file {string} with null values', (fileName) => {
  FileUploadPage.chooseInvalidFile(fileName);
});

Then('previous the error message should clear', () => {
  cy.get('#fileUploadInput-error').should('not.be.visible');
});

When('I click check for errors', () => {
  cy.intercept('POST', '**/declaration/**').as('declaration');
  FileUploadPage.clickCheckForErrors();
  FileUploadPage.getDeclarationId();
});

Then('the FE sends a POST to the declarationId endpoint', () => {
  cy.wait('@declaration').then((result) => {
    let url = result.request.url;
    let declarationId = url.split("/")[5];
    cy.wrap(declarationId).as('declarationId');
  });
});

When('there are no errors, I am shown the no errors found page', () => {
  cy.intercept('POST', '**/declaration/**').as('declaration');
  FileUploadPage.checkNoErrors();
});

When('I click save and continue', () => {
  FileUploadPage.clickSaveAndContinue();
});


When('I navigate back to task details page', () => {
  BasePage.clickBackButton();
  BasePage.clickBackButton();
  cy.url().should('include', 'report-voyage?report=');
});

Then('I am directed back to the Upload general declaration FAL 1 page', () => {
  FileUploadPage.verifyUploadGeneralDecPage();
});

Then('I sign-out', () => {
  SignInPage.clickSignOut();
});

When('I try to access a protected page with declaration Id', () => {
  cy.get('@declarationId').then(declarationId => {
    cy.visitUrl(`/report-voyage?report=${declarationId}`);
  });
});

When('I try to access a protected CYA page with declaration Id', () => {
  cy.get('@declarationId').then(declarationId => {
    cy.visitUrl(`/report-voyage/check-your-answers?report=${declarationId}`);
  });
});

Then('I navigate back to your-voyage page without adding General Declaration', () => {
  cy.intercept('DELETE', '**/declaration/*').as('deleteDec');
  cy.wait('@newDeclaration').then(({response}) => {
    const decID = response.body.id;
    cy.wrap(decID).as('decID');
  });
  cy.visitUrl('/your-voyages');
  cy.wait('@deleteDec').then((result) => {
    let url = result.request.url;
    let delDecId = url.split("/")[5];
    cy.wrap(delDecId).as('delDecId');
  });
  cy.get('@delDecId').then((delDecId) => {
    cy.get('@decID').then((decID) => {
      expect(delDecId).to.eq(decID);
    });
  });
});

Then('the voyage without general declaration is not added to the reported voyage', () => {
  FileUploadPage.getTotalReportsAfter();
  cy.get('@totalReportsBefore').then((totalReportsBefore) => {
    cy.get('@totalReportsAfter').then((totalReportsAfter) => {
      expect(totalReportsBefore).to.eq(totalReportsAfter);
    })
  })
});

Then('I am able to see the total number of voyage reports', () => {
  FileUploadPage.getTotalReportsBefore();
});
