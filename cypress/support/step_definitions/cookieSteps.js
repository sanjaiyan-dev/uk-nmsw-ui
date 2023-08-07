import {Given, When, Then} from '@badeball/cypress-cucumber-preprocessor';
import CookieComp from '../../e2e/components/cookie.comp.js';
import CookiePage from '../../e2e/pages/cookie.page';

Given('I can see the cookie banner', () => {
  cy.injectAxe();
  CookieComp.open();
  CookieComp.checkBnrCookie();
  cy.checkAxe();
});

When('I click {string} analytics cookies', (handleCookie) => {
  if (handleCookie === 'Accept') {
    CookieComp.acceptCookies();
  } else {
    CookieComp.rejectCookies();
  }
});

Then('an essential cookie is set to store my preference to {string}', (pref) => {
  if (pref === 'track') {
    cy.getCookie('cookiePreference').should('have.property', 'value', 'true');
  } else {
    cy.getCookie('cookiePreference').should('have.property', 'value', 'false');
  }
});

When('I click on the view cookies link', () => {
  CookieComp.viewCookies();
});

Then('the cookie banner is not visible', () => {
  CookieComp.bnrCookie.should('not.exist');
});

Then('the confirmation banner is shown', () => {
  CookieComp.confirmCookiePanel();
});

When('I click on the \'change your cookie settings\' link', () => {
  CookieComp.clickCookieChangeLink();
});

Then('the confirmation banner is not shown', () => {
  CookieComp.confirmNoCookiePanel();
});

Then('I am shown the cookie page with a form to manage my preferences', () => {
  CookiePage.verifyUrl();
  cy.checkAxe();
  CookiePage.checkFormManageCookie();
});

When('I click hide cookie message', () => {
  CookieComp.btnHideCookieMsg.click();
});

Then('I can no longer see the cookie banner', () => {
  CookieComp.bnrCookie.should('not.exist');
});

Then('the form should be set to {string}', (option) => {
  if (option === 'Yes') {
    CookiePage.checkBtnRadioYes();
  } else {
    CookiePage.checkBtnRadioNo();
  }
});

Then('the form should be set to no', () => {
  CookiePage.checkBtnRadioNo();
});

When('I change my cookie preference to {string} and click save', (pref) => {
  if (pref === 'Yes') {
    CookiePage.clickBtnRadioYes();
  } else {
    CookiePage.clickBtnRadioNo();
  }
  CookiePage.clickBtnSaveCookie();
});

Then('my {string} for analytics cookies should be saved', (chgPref) => {
  if (chgPref === 'NO') {
    CookiePage.checkBtnRadioNo();
  } else {
    CookiePage.clickBtnRadioYes();
  }
});

Then('I am shown a success banner', () => {
  CookiePage.verifyBannerSuccess();
  CookiePage.verifyBnrSuccessMsg();
});

Then('I refresh the page', () =>{
  cy.reload();
});

