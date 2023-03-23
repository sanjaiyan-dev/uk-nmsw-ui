import {Then} from "@badeball/cypress-cucumber-preprocessor";
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
