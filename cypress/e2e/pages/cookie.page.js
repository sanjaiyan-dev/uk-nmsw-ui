class CookiePage {

  get btnRadioYes() {
    return cy.get('input[type="radio"][value="true"]');
  }

  get btnRadioNo() {
    return cy.get('input[type="radio"][value="false"]');
  }

  get formManageCookie() {
    return cy.get('#changeYourCookieSettings');
  }

  get btnSaveCookies() {
    return cy.get('[data-testid="save-button"]');
  }

  get btnSaveCookie() {
    return cy.get('button[data-testid="save-button"]');
  }

  get bannerSuccess() {
    return cy.get('#govuk-notification-banner-title');
  }

  get bnrSuccessMsg() {
    return cy.get('.govuk-notification-banner__content');
  }

  //Re-usable methods
  saveCookies() {
    this.btnSaveCookies.should('be.visible').click();
  }

  checkBtnRadioYes() {
    this.btnRadioYes.scrollIntoView().should('be.checked');
    this.btnRadioNo.scrollIntoView().should('not.be.checked');
  }

  clickBtnRadioYes() {
    this.btnRadioYes.check('true');
  }

  checkBtnRadioNo() {
    this.btnRadioNo.scrollIntoView().should('be.checked');
    this.btnRadioYes.scrollIntoView().should('not.be.checked');
  }

  clickBtnRadioNo() {
    this.btnRadioNo.check('false');
  }

  clickBtnSaveCookie() {
    this.btnSaveCookie.click();
  }

  checkFormManageCookie() {
    this.formManageCookie.scrollIntoView().should('be.visible');
  }

  verifyBannerSuccess() {
    this.bannerSuccess.should('have.text', 'Success');
  }

  verifyBnrSuccessMsg() {
    this.bnrSuccessMsg.should('have.text', 'You\'ve set your cookie preferences.');
  }

  verifyUrl() {
    cy.url().should('include', '/cookies');
  }

}

export default new CookiePage();
