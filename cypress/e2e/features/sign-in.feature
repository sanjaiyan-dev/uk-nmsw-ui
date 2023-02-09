Feature: User sign-in
  As a user I can able to sign in to my registered account

  Background:
    Given I am on the sign-in page

  Scenario: Create account from sign-in page
    When I click on the create one now link
    Then I am taken to the create-account page

  Scenario: User can sign-in successfully
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    Then I can able to sign-out

  Scenario: User is shown - Request a new verification link when account is inactive
    When I have entered an email address for an unverified email address
    Then I am shown - Request a new verification link

  Scenario:  User should not be signed-in when email is in invalid format
    When the user enters invalid email address and sign-in
    Then I am shown corresponding error message
      | Field | email-error                                                                  |
      | Error | Error: Enter your email address in the correct format, like name@example.com |

  Scenario: User should not be signed-in without providing email and password
    When I click sign-in without providing email and password
    Then I am shown form error message
      | Error | Enter your email addressEnter your password |

  Scenario Outline: User should see a generic error message when signing in with invalid credentials
    When I provide incorrect '<emailAddress>' and '<password>' and sign-in
    Then I am shown form error message
      | Error | Email and password combination is invalid |
    Examples:
      | emailAddress                                       | password |
      | TestEmail@test.com                                 | 12345    |
      | 4f3a5d85-99bd-46db-b8ea-80ea8772c9c5@mailslurp.com | test-12  |

  Scenario: User should not be signed-in without providing email and password
    When user try to access a protected page
    Then I am on NMSW landing page