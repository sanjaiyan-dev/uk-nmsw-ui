import {Then} from "@badeball/cypress-cucumber-preprocessor";
import DeclarationPage from "../../e2e/pages/declaration.page";

Then('I can see the draft details of the voyage, I have uploaded', () => {
  DeclarationPage.checkVoyageDetailsDraftStatus();
});

Then('I click Yes to confirm the voyage report cancel', () => {
  cy.intercept('PATCH', '**/declaration/*').as('cancelPatch')
  DeclarationPage.confirmCancel();
  cy.wait('@cancelPatch').then(({response}) => {
    expect(response.body.status).to.equal('PreCancelled')
    expect(response.statusCode).to.equal(202);
  })
});
