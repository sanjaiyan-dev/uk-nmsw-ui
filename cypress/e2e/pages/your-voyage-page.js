class YourVoyagePage {

  clickReportVoyage() {
    cy.contains('Report a voyage').click();
  }

  clickNextPaginationLink() {
    cy.get('.govuk-pagination__item').last().find('button').invoke('text')
      .then(parseInt).then(count => [...Array(count - 1).keys()])
      .each(index => {
        cy.get('.govuk-pagination__next').click()
        cy.wait(500);
      });
  }

  clickPreviousPageLink() {
    cy.get('.govuk-pagination__item').last().find('button').invoke('text')
      .then(parseInt).then(count => [...Array(count - 1).keys()])
      .each(index => {
        cy.get('.govuk-pagination__prev').click()
        cy.wait(500);
      });
  }
}

export default new YourVoyagePage();
