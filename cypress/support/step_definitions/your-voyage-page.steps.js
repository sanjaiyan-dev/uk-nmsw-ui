import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import DeclarationPage from "../../e2e/pages/declaration.page";
import fileUploadPage from "../../e2e/pages/file-upload.page";
import SignInPage from "../../e2e/pages/sign-in.page";
import YourVoyagePage from "../../e2e/pages/your-voyage.page";

Then('I can see the draft details of the voyage, I have uploaded', () => {
  DeclarationPage.checkVoyageDetailsStatus('draft');
  cy.checkAxe();
});

Then('I click Yes to confirm the voyage report cancel', () => {
  cy.intercept('PATCH', '**/declaration/*').as('cancelPatch')
  DeclarationPage.confirmCancel();
  cy.wait('@cancelPatch').then(({response}) => {
    expect(response.body.status).to.equal('PreCancelled')
    expect(response.statusCode).to.equal(202);
  })
});

When('I have entered a correct {string} and {string} and sign in', (email, password) => {
  SignInPage.enterEmailAddress(email);
  SignInPage.enterPassword(password);
  SignInPage.clickSignIn();
});

Then('there should be no pagination', () => {
  cy.get('.govuk-pagination').should('not.exist');
});

Then('I am able to see the pagination based on number of reports', () => {
  fileUploadPage.getTotalReportsBefore();
  cy.get('@totalReportsBefore').then((text) => {
    const totalReports = text.split(" ")[0];
    switch (true) {
      case totalReports < 100:
        cy.get('li.govuk-pagination__item--current').should('have.text', '1');
        break;
      case totalReports > 100:
        cy.get('li.govuk-pagination__item--current').should('have.text', '1');
        cy.get('p[class="govuk-body-s govuk-!-font-weight-bold"]').parent().parent().should('have.length', 100);
        YourVoyagePage.clickNextPaginationLink();
        cy.get('.govuk-pagination__next').should('not.exist');
        YourVoyagePage.clickPreviousPageLink();
        cy.get('li.govuk-pagination__item--current').should('have.css', 'background-color').and('eq', 'rgb(29, 112, 184)');
        cy.get('p[class="govuk-body-s govuk-!-font-weight-bold"]').parent().parent().should('have.length', 100);
        break;
      default:
        break;
    }
  })
});
