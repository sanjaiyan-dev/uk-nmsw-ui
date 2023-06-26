Feature: User able to reset password
  As a user I can able to reset my password for a registered account

  Background:
    Given I am on the sign-in page

    @regression
  Scenario: User should be able to reset password successfully and signed-in with new password
    When I click Forgotten your password? link
    Then I am taken to forgotten-password page
    When I enter my email to request a forgotten password link
    And I click send the link
    Then I am taken to check your email page
    When I click the password reset link received
    Then I am taken to new password page
    When I click Reset password button without providing password details
    Then I am shown form error message
      | Error | Enter a passwordConfirm new password |
    When I enter a new password
    And I enter a confirmation password that is different to the new password
    Then I am shown form error message
      | Error | Passwords must match |
    When I enter a new password and confirmation password that matches the new password
    Then I can see the confirmation screen with sign in link
    When I sign-in with old password
    Then I am shown form error message
      | Error | Email and password combination is invalid |
    When I sign-in with new password
    Then I am taken to your-voyages page
    When I click the same password reset link again
    Then I am taken to new password page
    When I enter a new password and confirmation password that matches the new password
    Then I am shown the message - Password reset link has expired
    And I click `Request New Link` button
    Then I am taken to forgotten-password page

  Scenario: User is redirected as expected invalid or missing token
    When user tries to reset password with missing token
    When I enter a new password and confirmation password that matches the new password
    Then I am shown the message - Password reset link has expired
    When user tries to reset password with invalid token
    When I enter a new password and confirmation password that matches the new password
    Then I am shown the message - Password reset link has expired

  Scenario: User can able to request for new password-reset link
    When I click Forgotten your password? link
    Then I am taken to forgotten-password page
    Then I enter my email to request a forgotten password link
    And I click send the link
    Then I am taken to check your email page
    When I click on not received an email
    Then the user is redirected to request-new-password-link
    And I click `Request New Link` button
    Then I am taken to check your email page
    When I click on not received an email
    Then I click change the email sent link
    And I change to different email previously registered
    And I click `Request New Link` button
    Then I am taken to check your email page
    When I click on not received an email
    Then I click change the email sent link
    And I enter the email in invalid format
    Then I click `Request New Link` button
    Then I am shown corresponding error message
      | Field | emailAddress-error                |
      | Error | Error: Enter a real email address |

  Scenario: User should not receive email for email address not registered
    When I click Forgotten your password? link
    Then I am taken to forgotten-password page
    Then I enter an email address that is not registered
    Then I am shown check your email page but email should not be sent

  Scenario: User able to request password reset link for unverified email address
    When I click Forgotten your password? link
    Then I am taken to forgotten-password page
    Then I enter the email that is registered but not verified
    And I click send the link
    Then I shown email address has not been verified
    When I click send verification email
#    Then I am taken to check your email page
