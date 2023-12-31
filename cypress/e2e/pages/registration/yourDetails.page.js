class yourDetailsPage {

  typeFullName(name) {
    cy.get('input#fullName-input').clear().type(name);
  }

  typeCompanyName(companyName) {
    cy.get('input#companyName-input').clear().type(companyName);
  }

  typePhoneCode(phCode,id) {
    cy.get('input#diallingCode-input').clear().type(phCode).get(`li[id=${id}]`).click({force: true});
  }

  typePhoneNumber(phNumber) {
    cy.get('input#telephoneNumber-input').clear().type(phNumber);
  }

  typeCountry(country,id) {
    cy.get('#country-input').clear().type(country).get(`li[id=${id}]`).click({force: true});
  }

  isShippingAgentYes() {
    cy.get('.govuk-radios__input').eq(0).click();
  }

  isShippingAgentNo() {
    cy.get('.govuk-radios__input').eq(1).click();
  }
}

export default new yourDetailsPage();
