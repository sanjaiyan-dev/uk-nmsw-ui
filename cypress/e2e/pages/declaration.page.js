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
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status');
    cy.get('.govuk-summary-list__value > .govuk-tag').invoke('text').then((status) => {
        expect(status).to.be.oneOf(['Submitted','Pending','Failed']);
      });
  }

  checkCyaFailedStatus() {
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status');
    cy.get('.govuk-summary-list__value > .govuk-tag').invoke('text').then((status) => {
      expect(status).to.be.equal('Failed');
    });
  }

  checkCyaCancelledStatus() {
    cy.wait(3000);
    cy.get(':nth-child(1) > :nth-child(2) > .govuk-summary-list__key').should('have.text', 'Status');
    cy.get('.govuk-summary-list__value > .govuk-tag').invoke('text').then((status) => {
      expect(status).to.be.oneOf(['Cancelled','Failed']);
    });
  }

  checkCurrentDeclaration() {
    cy.contains('All report types');
    cy.wait(4000);
    cy.get('.reported-voyages-margin--top').invoke('text').then(reports => {
      let count = Math.floor(parseInt(reports.split(" ")[0]) / 50) + 1;
      cy.wrap(count).as('pageCount')
    })
    cy.get('@pageCount').then(count => [...Array(count).keys()]).each((index) => {
      cy.get('@declarationId').then(decId => {
        cy.get('body').then($body => {
          if ($body.find(`a[href$="${decId}"]`).length > 0) {
            cy.get(`a[href$="${decId}"]`).parent().parent().find('.govuk-tag').then(($ele) => {
              const currentStatus = $ele.text();
              switch (currentStatus) {
                case 'draft':
                  cy.wrap($ele).parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status DraftActions Continue');
                  break;
                case 'pending':
                  cy.wrap($ele).should('have.css', 'color', 'rgb(89, 77, 0)').parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status PendingActions Review or cancel');
                  break;
                case 'submitted':
                  cy.wrap($ele).should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status SubmittedActions Review or cancel');
                  break;
                case 'cancelled':
                  cy.wrap($ele).parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status CancelledActions Review');
                  break;
                case 'failed':
                  cy.wrap($ele).parent().parent().should('have.text', 'New NMSW Test ShipVoyage type:Arrival to the UKDate:15 October 2023Status FailedActions Review');
                  break;
              }
            }).then($ele => {
              cy.get(`a[href$="${decId}"]`).click()
              cy.wait(4000);
            })
            return false
          } else {
            cy.get('.govuk-pagination__next').click()
            cy.wait(4000);
          }
        })
      })
    })
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

  verifyCrownDependencyDeclaration() {
    cy.contains('All report types');
    cy.wait(4000);
    cy.get('.reported-voyages-margin--top').invoke('text').then(reports => {
      let count = Math.floor(parseInt(reports.split(" ")[0]) / 50) + 1;
      cy.wrap(count).as('pageCount')
    })
    cy.get('@pageCount').then(count => [...Array(count).keys()]).each((index) => {
      cy.get('@declarationId').then(decId => {
        cy.get('body').then($body => {
          if ($body.find(`a[href$="${decId}"]`).length > 0) {
            cy.get(`a[href$="${decId}"]`).parent().parent().find('.govuk-tag').then(($ele) => {
              const currentStatus = $ele.text();
              switch (currentStatus) {
                case 'draft':
                  cy.wrap($ele).parent().parent().should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status DraftActions Continue');;
                  break;
                case 'pending':
                  cy.wrap($ele).should('have.css', 'color', 'rgb(89, 77, 0)').parent().parent().should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status PendingActions Review or cancel');
                  break;
                case 'submitted':
                  cy.wrap($ele).should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status SubmittedActions Review or cancel');
                  break;
                case 'cancelled':
                  cy.wrap($ele).parent().parent().should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status CancelledActions Review');
                  break;
                case 'failed':
                  cy.wrap($ele).parent().parent().should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status FailedActions Review');
                  break;
              }
            }).then($ele => {
              cy.get(`a[href$="${decId}"]`).click()
            })
            return false
          } else {
            cy.get('.govuk-pagination__next').click()
            cy.wait(4000)
          }
        })
      })
    })
    cy.wait(10000);
  }

  verifyCancelledDeclaration() {
    cy.get('@declarationId').then(decId => {
      cy.get('body').then($body => {
        cy.get(`a[href$="${decId}"]`).parent().parent().find('.govuk-tag').then(($ele) => {
          const currentStatus = $ele.text();
          switch (currentStatus) {
            case 'cancelled':
              cy.wrap($ele).parent().parent().should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status CancelledActions Review');
              break;
            case 'failed':
              cy.wrap($ele).parent().parent().should('have.text', 'CD NMSW Test ShipVoyage type:Departure from the UKDate:03 May 2023Status FailedActions Review');
              break;
          }
        }).then($ele => {
          cy.get(`a[href$="${decId}"]`).click()
        })
          })
      })
  }
}

export default new declarationPage();
