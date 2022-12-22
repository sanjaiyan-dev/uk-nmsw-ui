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
