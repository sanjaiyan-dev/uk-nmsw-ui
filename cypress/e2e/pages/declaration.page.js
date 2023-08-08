import dayjs from 'dayjs';

const currentDate = dayjs();

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

  bannerReportSent() {
    cy.get('.govuk-panel__title').should('have.text', 'Voyage details sent');
  }

  checkCyaSubmittedStatus() {
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status').next().should('contain.text', `Submitted`);
  }

  checkCyaFailedStatus() {
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status').next().should('contain.text', `Failed`);
  }

  checkCyaCancelledStatus() {
    cy.wait(3000);
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status').next().should('contain.text', `Cancelled`);
  }

  checkCurrentDeclaration() {
    cy.contains('All report types');
    cy.wait(4000);
    cy.get('.small-link-text').each(($ele) => {
      cy.wrap($ele).invoke('attr', 'href').then(declarationLink => {
        cy.get('@declarationId').then(decId => {
          if (declarationLink.includes(decId)) {
            cy.wrap($ele).as('currentDeclaration');
          }
        });
      });
    });
    cy.get('.govuk-pagination__list li').each((page, index, pages) => {
      cy.wrap(page).then(() => {
        const isLastPage = index === (pages.length - 1);
        // cy.log(index,pages.length,isLastPage);
        if (pages.length === 1) {
          return false;
        }
        if (!isLastPage) {
          cy.get('.govuk-pagination__next').then(($nextButton) => {
            if ($nextButton.length > 0) {
              cy.wrap($nextButton).click();

              cy.wait(2000);
              cy.get('.small-link-text').each(($ele) => {
                cy.wrap($ele).invoke('attr', 'href').then(declarationLink => {
                  cy.get('@declarationId').then(decId => {
                    if (declarationLink.includes(decId)) {
                      cy.wrap($ele).as('currentDeclaration');
                    }
                  });
                });
              });
            } else {
              return false;
            }
          });
        }

      });
    });
    cy.wait(20000);
  }

  checkVoyageDetailsStatus(status) {
    cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').then($ele => {
      if ($ele.text() === 'Failed') {
        status = 'failed'
      }
      switch (status) {
        case 'draft':
          cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Draft').parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status DraftActions Continue');
          break;
        case 'pending':
          cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Pending').should('have.css', 'color', 'rgb(89, 77, 0)').parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status PendingActions Review or cancel');
          break;
        case 'submitted':
          cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Submitted').parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status SubmittedActions Review or cancel');
          break;
        case 'cancelled':
          cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Cancelled').parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status CancelledActions Review');
          break;
        case 'failed':
          cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Failed').parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status FailedActions Review');
          break;
      }
    });
    cy.wait(10000);

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
    switch (status) {
      case 'draft':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Draft');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status DraftActions Continue');
        });
        break;
      case 'pending':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Pending');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status PendingActions Review or cancel');
        });
        break;
      case 'submitted':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Submitted');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status SubmittedActions Review or cancel');
        });
        break;
      case 'cancelled':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Cancelled');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status CancelledActions Review');
        });
        break;
      case 'failed':
        cy.get('@currentDeclaration').parent().parent().find('.govuk-tag').should('contain.text', 'Failed');
        cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
          cy.wrap($row).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status FailedActions Review');
        });
        break;
    }
    cy.wait(30000);
  }
}

export default new declarationPage();
