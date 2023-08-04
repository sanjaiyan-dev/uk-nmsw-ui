import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import TaskPage from "../../e2e/pages/task.page";

Then('I am taken to task details page', () => {
  TaskPage.checkTaskPage();
  cy.injectAxe();
});

Then('I can verify voyage details on the task details page', () => {
  TaskPage.checkShipName('New NMSW Test Ship');
  TaskPage.checkVoyageType('Arrival to the UK');
  TaskPage.checkFal1UploadDocStatus();
});

When('I click delete draft', () => {
  TaskPage.clickDeleteDraftButton();
});

Then('I am taken to confirm delete draft page', () => {
  cy.url().should('include', 'confirm-delete-draft');
  cy.injectAxe();
});

When('I click No to delete the draft', () => {
  TaskPage.clickNoDeleteDraft();
});

When('I click Yes to delete the draft and confirm', () => {
  cy.intercept('DELETE', '**/declaration/*').as('deleteDraft');
  cy.checkAxe();
  TaskPage.clickYesDeleteDraft();
  cy.wait('@deleteDraft').then(({response}) => {
    expect(response.statusCode).to.equal(204);
  })
});

Then('I can see status for FAL5 as completed', () => {
  TaskPage.checkFal5Status();
});

Then('I can see status for FAL5 as required', () => {
  cy.get('main#content li:nth-child(2) > a > strong').should('have.text', 'Required');
});

Then('I can see status for FAL6 as completed', () => {
  TaskPage.checkFal6Status();
});

Then('I can see status for FAL6 as completed and FAL5 as required', () => {
  TaskPage.checkFal6StatusBeforeFal5Upload();
});

Then('I can see status for FAL6 as required', () => {
  cy.get('main#content li:nth-child(3) > a > strong').should('have.text', 'Required');
});

Then('I can see Check answers and submit not enabled', () => {
  cy.get('main#content li > div > span').should('not.have.attr', 'a');
  cy.get('main#content div > strong').should('have.text', 'Cannot start yet');
});

Then('I can see Check answers and submit enabled', () => {
  cy.checkAxe();
  cy.get('main#content li:nth-child(2) > ul > li >a').should('have.attr', 'href');
  cy.get('main#content li:nth-child(2) > ul > li > a > strong').should('have.text', 'Not started');
});

When('I click continue under actions', () => {
  cy.get('main#content a').first().contains('Continue').click();
});

Then('I can see the see the status of Fal-6 as required', () => {
TaskPage.checkFal6StatusBeforeFal6Upload();
});
