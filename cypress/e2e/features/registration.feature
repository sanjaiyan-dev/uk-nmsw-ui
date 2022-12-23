Feature: User Registration
  As a user I can able to register/create account on NMSW
  Background:
    Given I am on NMSW landing page

  Scenario: Successful user registration
    When I click create an account on the landing page
    Then the registration page is displayed
    When I can provide my email address
    When I verify the email address
    Then I am redirected to provide my other details
    When I provide all my details
    Then I am redirected to password page
    When I provide my password
    Then my account is created and taken to confirmation page

  Scenario: user registration email page validation
    When I click create an account on the landing page
    Then the registration page is displayed
    When I click continue without providing any details
    Then I am shown form error message
      | Error | Enter an email address in the correct format, like name@example.comConfirm your email address |
    When I enter invalid email address and continue without confirm email address
    Then I am shown corresponding error message
      | Field | emailAddress-error                                                         |
      | Error | Error: Enter an email address in the correct format, like name@example.com |
    Then I am shown corresponding error message
      | Field | repeatEmailAddress-error          |
      | Error | Error: Confirm your email address |
    When I enter confirm email which is not same as email address
    Then I am shown corresponding error message
      |Field  | repeatEmailAddress-error               |
      |Error  | Error: Your email addresses must match |
    When I can provide my email address
    When I verify the email address
    Then I am redirected to provide my other details
    When I click continue without providing any details
    Then I am shown form error message
      | Error |Enter your full nameEnter your company nameEnter your phone numberEnter countrySelect is your company a shipping agent |
    When I provide all my details
    Then I am redirected to password page
    When I click continue without providing any details
    Then I am shown form error message
      | Error |Enter a passwordConfirm your password |
    When I enter password less than 10 characters
    Then I am shown corresponding error message
      |Field  | requirePassword-error |
      |Error  | Error: Passwords must be at least 10 characters long |
    When I enter password in invalid format
      |Field  | requirePassword-error |
      |Error  |Error: Enter a password that does not contain spaces |

