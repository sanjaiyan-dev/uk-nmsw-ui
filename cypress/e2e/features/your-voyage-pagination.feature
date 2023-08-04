Feature: As a shipping agent I can able to report voyage and easily look through my voyages using pagination

  Background: I am on sign-in page
    Given I am on the sign-in page

  Scenario Outline: No pagination for an account with 0 voyages
    When I have entered a correct '<emailAddress>' and '<password>' and sign in
    Then I am taken to your-voyages page
    Then there should be no pagination
    Examples:
      | emailAddress                                       | password      |
      | 0e25b97b-35bb-4959-8da9-e0439c9a0df9@mailslurp.com | Test-NMSW-Dev |

  Scenario Outline: I can see a page link for each 50 records for account more than 100 voyages
    When I have entered a correct '<emailAddress>' and '<password>' and sign in
    Then I am taken to your-voyages page
    Then I am able to see the pagination based on number of reports
    Examples:
      | emailAddress                                       | password      |
      | 4f3a5d85-99bd-46db-b8ea-80ea8772c9c5@mailslurp.com | Test-NMSW-Dev |
