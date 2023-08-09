Feature: User sign-in
  As a user I can able to sign in to my registered account

  Background:
    Given I am on the sign-in page

# Scenario: Create account from sign-in page
#   When I click on the create one now link
#   Then I am taken to the create-account page

#  @regression
#  Scenario: User can sign-in successfully
#    When I have entered a correct email address and password and sign in
#    Then I am taken to your-voyages page
#    Then I can able to sign-out

  Scenario: User is shown - info page asking them to verify their email that is registered not verified
    When I have entered an email address for an unverified email address
    Then I am shown email address has not been verified
    When I click Resend verification email
    Then I am taken to check your email page
    When I click on not received an email
    Then I am taken to request-new-verification-link page
    And I click `Request New Link` button
    Then I am taken to check your email page
    And I can see email received to verify the email
#
#  Scenario:  User should not be signed-in when email is in invalid format
#    When the user enters invalid email address and sign-in
#    Then I am shown corresponding error message
#      | Field | email-error                       |
#      | Error | Error: Enter a real email address |
#
#  Scenario: User should not be signed-in without providing email and password
#    When I click sign-in without providing email and password
#    Then I am shown form error message
#      | Error | Enter your email addressEnter your password |
#
#  Scenario Outline: User should see a generic error message when signing in with invalid credentials
#    When I provide incorrect '<emailAddress>' and '<password>' and sign-in
#    Then I am shown form error message
#      | Error | Email and password combination is invalid |
#    Examples:
#      | emailAddress                                       | password |
#      | TestEmail@test.com                                 | 12345    |
#      | abf4b167-04bc-4ff1-b4b0-7f9ceb0b6ffd@mailslurp.com | test-12  |
#
#  Scenario: User should not be signed-in without providing email and password
#    When I try to access a protected page
#    Then I am taken to the sign-in page
#
#  Scenario Outline: Message is shown when internal users attempts to sign-in in external application
#    When I attempt to sign in with internal valid '<role>' credentials
#    Then I am shown form error message
#      | Error | Email and password combination is invalid |
#    Examples:
#      | role     |
#      | admin    |
#      | standard |
#
