Feature: Cookie Page
  I want to accept or reject cookies in the cookie banner

  Background:
    Given I can see the cookie banner

  Scenario Outline: Accept or Reject the  cookie banner
    When I click '<cookie>' analytics cookies
    Then an essential cookie is set to store my preference to '<preference>'
    Then the confirmation banner is shown
    When I click on the 'change your cookie settings' link
    Then I am shown the cookie page
    Then I am provided a form to manage my preferences
    Then the form should be set to '<status>'
    When I change my cookie preference to '<changestatus>' and click save
    Then I am shown a success banner

    Examples:
      | cookie | preference   | status | changestatus |
      | Accept | track        | Yes    | No           |
      | Reject | do not track | No     | Yes          |


  Scenario: View the cookie link navigates to cookie page
    When I click on the view cookies link
    Then I am shown the cookie page
    Then the form should be set to no

  Scenario Outline: Accept or Reject and view cookie page
    When I click '<cookie>' analytics cookies
    When I click on the view cookies link
    Then the form should be set to '<status>'
    Examples:
      | cookie | status |
      | Accept | Yes    |
      | Reject | No     |
