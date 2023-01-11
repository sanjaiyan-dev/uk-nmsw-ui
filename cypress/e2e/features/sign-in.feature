Feature: User sign-in
  As a user I can able to register/create account on NMSW

  Background:
    Given I am on the sign-in page

  Scenario: Create account from sign-in page
    When I click on the create one now link
    Then I am taken to the create-account page

    Scenario: User can sign-in successfully
      When I enter valid credentials and sign-in
      Then I am taken to your-voyages page
