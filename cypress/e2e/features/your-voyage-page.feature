Feature: As a shipping agent I can able to report voyage and see the reports I have made

  @deleteDeclaration
  Scenario: User can an able to report voyage and see the reports made
    Given I am on the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
