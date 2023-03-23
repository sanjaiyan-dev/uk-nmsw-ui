class YourDetailsInfoPage {
  checkHeading() {
    cy.get('h1').should('have.text', 'Your details');
  }
}

export default new YourDetailsInfoPage();
