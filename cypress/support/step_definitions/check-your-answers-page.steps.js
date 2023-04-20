import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import cyaPage from "../../e2e/pages/cya.page";
import BasePage from "../../e2e/pages/base.page";
import FileUploadPage from "../../e2e/pages/file-upload.page";
import CyaPage from "../../e2e/pages/cya.page";

When('I click Check answers and submit', () => {
  cyaPage.clickCheckAnswersAndSubmit();
});

When('I can verify the Check Your Answers page', () => {
  cyaPage.verifyCYAPage();
  cyaPage.verifySaveAndSubmitButton();
  cyaPage.verifyH2Headings();
  cyaPage.verifyChangeLink();
});

Then('I can view Check Your Answers page', () => {
  cyaPage.verifyCYAPage();
});

Then('the details from my FAL 1 form are displayed on CYA page', () => {
  const fieldKeyValue = [
    {key: 'Voyage type', value: "Arrival to the UK"},
    {key: 'Ship name', value: "NMSW Test Ship"},
    {key: 'IMO number', value: "9999990"},
    {key: 'Call sign', value: "1234"},
    {key: 'Flag state of ship', value: "Canada"},
    {
      key: 'Departure details',
      value: "Departure port LOCODEUS  XXXDate of departure12 February 2023Time of departure13:00"
    },
    {key: 'Arrival details', value: "Arrival port LOCODEGB  XXXDate of arrival15 February 2023Time of arrival12:00"},
    {key: 'Next port of call', value: "JP  NXX"},
    {key: 'Brief description of the cargo', value: "No cargo"},
  ];

  cy.get('dl:nth-child(1) .govuk-summary-list__row').each((row, index) => {
    if (index !== 0) {
      cy.wrap(row).find('.govuk-summary-list__key').invoke('text').then(key => {
        let expectedValue = fieldKeyValue.filter(list => list.key === key)[0].value
        cy.wrap(row).find('.govuk-summary-list__value').should('contain.text', expectedValue)
      });
    }
  });
});

When('I click change the voyage details link', () => {
  cyaPage.clickChangeVoyageDetailLink();
});

Then('I am taken to error message page', () => {
  BasePage.checkH1('Something has gone wrong');
});

When('I click - Click here to continue', () => {
  cy.contains('Click here to continue').click();
});

When('I click upload files', () => {
  FileUploadPage.clickUpload();
  cy.wait(1000);
});

Then('I can see a link to an uploaded crew file {string}{string}', (folderName, fileName) => {
CyaPage.verifyFileUploaded(fileName);
});

When('I click on the file name for {string}, it is downloaded', (folderName) => {
  CyaPage.clickFalUploadedFile(folderName);
});

Then('I can see a link to an uploaded passenger file {string}{string}', (folderName, fileName) => {
  CyaPage.verifyFileUploaded(fileName);
});

Then('passenger section state No passenger details provided', () => {
  cy.get('#passengerDetails').next().contains('No passenger details provided');
  cy.get('#supportingDocuments').next().contains('No supporting documents provided');
});

When('I click on change next to Passenger details', () => {
cy.get('#passengerDetails').parent().find('a').contains('Change').click();
});

When('I navigate back to check your answers page', () => {
  BasePage.clickBackButton();
  BasePage.clickBackButton();
  cy.url().should('include', 'report-voyage/check-your-answers?');
});

When('I click Save and Submit', () => {
  cyaPage.clickSaveAndSubmitButton();
});
