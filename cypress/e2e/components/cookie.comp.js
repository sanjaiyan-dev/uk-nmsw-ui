class CookieComponent {

  // Getters for page locators
  
  get bnrCookie() {
    return cy.get('.govuk-cookie-banner__heading')
  }
  get btnAcceptCookies() {
    return cy.contains('Accept analytics cookies');
  }

  get btnRejectCookies() {
    return cy.contains('Reject analytics cookies');
  }

  get lnkViewCookies() {
    return cy.get('[href="/cookies"][class="govuk-link"]');
  }

  get btnHideCookieMsg() {
    return cy.contains('Hide cookie message');
  }

  get cookiePanel() {
    return cy.get('.govuk-cookie-banner__message ');
  }

  get lnkCookieSetting() {
    return cy.contains('change your cookie settings');
  }

  //Re-usable methods

  checkBnrCookie() {
    this.bnrCookie.should('be.visible')
  }
  acceptCookies() {
    this.btnAcceptCookies.should('be.visible').click();
    this.btnHideCookieMsg.should('be.visible');
  }

  rejectCookies() {
    this.btnRejectCookies.should('be.visible').click();
    this.btnHideCookieMsg.should('be.visible');
  }

  viewCookies() {
    this.lnkViewCookies.should('be.visible').click();
  }

  confirmCookiePanel() {
    this.cookiePanel.should('be.visible');
  }

  clickCookieChangeLink() {
    this.lnkCookieSetting.should('be.visible').click();
  }

  open() {
    cy.visit('/');
  }

}

export default new CookieComponent();
