import dayjs from "dayjs";

const currentDate = dayjs();
const formattedDate = currentDate.format('DD MMMM YYYY');

class declarationPage {

  bannerDeleteDraft() {
    cy.get('#govuk-notification-banner-title').contains('Success');
    cy.get('h3.govuk-notification-banner__heading').should('contain.text', 'Report for New NMSW Test Ship deleted.');
  }

  clickCancelButton() {
    cy.get('.govuk-button--warning').should('have.text', 'Cancel').click();
  }

  confirmCancel() {
    cy.get('input[id="deleteVoyage-input[0]"]').click();
    cy.contains('Confirm').click();
  }

  bannerSubmitReport() {
    cy.get('.govuk-panel__title').should('have.text', 'Voyage details submitted');
  }

  checkCyaSubmittedStatus() {
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status').next().should('contain.text', `Submitted`);
  }

  checkCyaCancelledStatus() {
    cy.wait(3000);
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status').next().should('contain.text', `Cancelled`);
  }

  checkVoyageDetailsStatus(status) {
    cy.contains('All report types');
    cy.wait(3000);
    cy.get('.small-link-text').each(($ele) => {
      cy.wrap($ele).invoke('attr', 'href').then(declarationLink => {
        cy.get('@declarationId').then(decId => {
          if (declarationLink.includes(decId)) {
            cy.wrap($ele).as('currentDeclaration')
          }
        })
      })
    })
    switch (status) {
      case 'draft':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Draft');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status DraftActions Continue');
        })
        break;
      case 'submitted':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Submitted');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status SubmittedActions Review or cancel');
        })
        break;
      case 'cancelled':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Cancelled');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status CancelledActions Review');
        })
        break;
      case 'failed':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Failed');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status FailedActions Review and re-submit');
        })
        break;
    }
    cy.wait(30000);
  }

  bannerCancelReport() {
    cy.get('#govuk-notification-banner-title').contains('Success');
    cy.get('h3.govuk-notification-banner__heading').should('contain.text', 'Report for New NMSW Test Ship cancelled.');
  }

  verifyChangeLinkNotExist() {
    cy.get('.govuk-summary-list__actions > a').should('not.exist');
  }

  verifySaveAndSubmitNotExist() {
    cy.get('button[class="govuk-button"]').contains('Save and submit').should('not.exist');
  }

  verifyCancelButtonNotExist() {
    cy.get('button[class="govuk-button govuk-button--warning"]').should('not.exist');
  }

  verifyCrownDependencyVoyage(status) {
    cy.wait(3000);
    cy.get('.small-link-text').each(($ele) => {
      cy.wrap($ele).invoke('attr', 'href').then(declarationLink => {
        cy.get('@declarationId').then(decId => {
          if (declarationLink.includes(decId)) {
            cy.wrap($ele).as('currentDeclaration')
          }
        })
      })
    })
    switch (status) {
      case 'draft':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Draft');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status DraftActions Continue');
        })
        break;
      case 'submitted':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Submitted');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status SubmittedActions Review or cancel');
        })
        break;
      case 'cancelled':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Cancelled');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status CancelledActions Review');
        })
        break;
      case 'failed':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Failed');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status FailedActions Review and re-submit');
        })
        break;
    }
    cy.wait(30000);
  }
}

export default new declarationPage();
