Feature: Cookie Page
  I want to accept or reject cookies in the cookie banner

  Background:
    Given I can see the cookie banner

  Scenario: Accept to the  cookie banner
    When I click 'Accept' analytics cookies
    Then an essential cookie is set to store my preference to 'track'
    Then the confirmation banner is shown
    When I click on the 'change your cookie settings' link
    Then I am shown the cookie page
    Then I am provided a form to manage my preferences
    Then the form should be set to 'Yes'
    When I change my cookie preference to 'No' and click save
    Then I am shown a success banner

  Scenario: Reject to the cookie banner
    When I click 'Reject' analytics cookies
    Then an essential cookie is set to store my preference to 'do not track'
    Then the confirmation banner is shown
    When I click on the 'change your cookie settings' link
    Then I am shown the cookie page
    Then I am provided a form to manage my preferences
    Then the form should be set to 'No'
    When I change my cookie preference to 'Yes' and click save
    Then I am shown a success banner


  Scenario: View the cookie link navigates to cookie page
    When I click on the view cookies link
    Then I am shown the cookie page
    Then the form should be set to no

  Scenario:
    When I click 'Accept' analytics cookies
    When I click on the view cookies link
    Then the form should be set to 'Yes'

  Scenario:
    When I click 'Reject' analytics cookies
    When I click on the view cookies link
    Then the form should be set to 'No'
