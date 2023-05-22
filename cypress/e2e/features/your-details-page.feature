Feature: User able to view the details registered
  As a user I can able to view the details I have provided when registering an account

  Background:
    Given I am on the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    When I click your details tab
    Then I am taken to your details page

    @regression
  Scenario: User able to see their details they entered when creating their account
    Then I am able to see all my details

  Scenario: User can able to reset password successfully from your details page
    When I click change your password link
    Then I am taken to forgotten-password page
    When I enter my email to request a forgotten password link
    And I click send the link
    Then I am taken to check your email page
    When I click the password reset link received
    Then I am taken to new password page
    When I enter a new password and confirmation password that matches the new password
    Then I can see the confirmation screen with sign in link
    When I sign-in with new password
    Then I am taken to your-voyages page
