import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import BasePage from "../../e2e/pages/base.page";
import PasswordPage from "../../e2e/pages/registration/password.page";

When('I click change your password link', () => {
  cy.contains('Change your password').click();
});

Then('I am able to see all my details', () => {
  BasePage.checkH1('Your details');
  PasswordPage.checkYourDetails();
});
