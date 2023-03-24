import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import TaskPage from "../../e2e/pages/task.page";

Then('I can verify voyage details on the task details page', () => {
  TaskPage.checkShipName('NMSW Test Ship');
  TaskPage.checkVoyageType('Arrival to the UK');
  TaskPage.checkFal1UploadDocStatus();
});

Then('I can verify new voyage details on the task details page', () => {
  TaskPage.checkShipName('JensShip');
  TaskPage.checkVoyageType('Arrival to the UK');
  TaskPage.checkFal1UploadDocStatus();
});

When('I click delete draft', () => {
  TaskPage.clickDeleteDraftButton();
});

Then('I am taken to confirm delete draft page', () => {
  cy.url().should('include', 'confirm-delete-draft');
});

When('I click No to delete the draft', () => {
  TaskPage.clickNoDeleteDraft();
});

When('I click Yes to delete the draft', () => {
  TaskPage.clickYesDeleteDraft();
});
