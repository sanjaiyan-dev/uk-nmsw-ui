Feature: User can able to download the file templates
  As a user I can able to download the available template files

  Background:
    Given I am on the sign-in page
    And I have entered a correct email address and password and sign in

  @signOut
  Scenario: Able to download the template files

    When I click template tab on the navigation bar
    Then I am taken to templates page, listing templates
    When I click File templates, I can able to download
