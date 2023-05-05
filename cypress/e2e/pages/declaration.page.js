class declarationPage {

  bannerDeleteDraft() {
    cy.get('#govuk-notification-banner-title').contains('Success');
    cy.get('h3.govuk-notification-banner__heading').should('contain.text', 'Report for NMSW Test Ship deleted.');
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
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status').next().should('have.text', 'Submitted ');
  }

  checkCyaCancelledStatus() {
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status').next().should('have.text', 'Cancelled ');
  }

  checkVoyageDetailsDraftStatus() {
    cy.contains('All report types');
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-grid-row').each(($row) => {
      cy.wrap($row).should('have.text', 'NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status DraftActions Continue');
    })
    cy.get('.small-link-text').each(($ele) => {
      cy.wrap($ele).invoke('attr', 'href').then(value => {
        cy.get('@declarationId').then(decId => {
          if (value.includes(decId)) {
            cy.wrap($ele).as('currentDeclaration')
            cy.wrap($ele).parent().parent().find('.govuk-tag').should('contain.text', 'Draft');
            return false
          }
        })
      })
    })
  }

  checkVoyageDetailsSubmittedStatus() {
    cy.contains('All report types');
    cy.get('.small-link-text').each(($ele) => {
      cy.wrap($ele).invoke('attr', 'href').then(value => {
        cy.get('@declarationId').then(decId => {
          if (value.includes(decId)) {
            cy.wrap($ele).as('currentDeclaration')
            cy.wrap($ele).parent().parent().find('.govuk-tag').should('contain.text', 'Submitted')
            return false;
          }
        })
      })
    })
    cy.get('@currentDeclaration').parent().parent().each(($row) => {
         cy.wrap($row).should('have.text', 'NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status SubmittedActions Review or cancel');
      });
  }

  checkVoyageDetailsCancelledStatus() {
    cy.get('.small-link-text').each(($ele) => {
      cy.wrap($ele).invoke('attr', 'href').then(value => {
        cy.get('@declarationId').then(decId => {
          if (value.includes(decId)) {
            cy.wrap($ele).as('currentDeclaration')
            cy.wrap($ele).parent().parent().find('.govuk-tag').should('contain.text', 'Cancelled')
            return false
          }
        })
      })
    })
    cy.get('@currentDeclaration').parent().parent().each(($row) => {
      cy.wrap($row).should('have.text', 'NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status CancelledActions Review');
    });
  }

  checkVoyageDetailsFailedStatus() {
    cy.get('.small-link-text').each(($ele) => {
      cy.wrap($ele).invoke('attr', 'href').then(value => {
        cy.get('@declarationId').then(decId => {
          if (value.includes(decId)) {
            cy.wrap($ele).as('currentDeclaration')
            cy.wrap($ele).parent().parent().find('.govuk-tag').should('contain.text', 'Failed')
            return false
          }
        })
      })
    })
    cy.get('@currentDeclaration').parent().parent().each(($row) => {
      cy.wrap($row).should('have.text', 'NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status FailedActions Review and re-submit');
    });
  }

  bannerCancelReport() {
    cy.get('#govuk-notification-banner-title').contains('Success');
    cy.get('h3.govuk-notification-banner__heading').should('contain.text', 'Report for NMSW Test Ship cancelled.');
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
}

export default new declarationPage();
