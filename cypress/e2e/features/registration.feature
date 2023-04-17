Feature: User Registration
  As a user I can able to register/create account on NMSW

  Background:
    Given I am on NMSW landing page

  @registration @regression
  Scenario: Successful user registration
    When I click create an account on the landing page
    Then the registration page is displayed
    When I provide my email address
    When I verify the email address
    Then the email address verified page is loaded with a continue button
    Then I am redirected to provide my other details
    When I provide all my details
    Then I am redirected to password page
    When I provide my password
    Then my account is created and taken to confirmation page
    When I verify my email address again
    Then I am shown - You already have an account
    When I click sign-in
    Then I am taken to the sign-in page


  @registration
  Scenario: User able to verify email and complete registration when account is not active
    When I click create an account on the landing page
    Then the registration page is displayed
    And I provide my email address
    Then I am taken to check your email page
    When I navigate back to landing page
    When I create an account with same email previously registered
    Then I am taken to check your email page
    When I click on not received an email
    Then the user is redirected to request-new-verification-link
    And I click `Request New Link` button
    Then I am taken to check your email page
    When I navigate back to landing page
    When I create an account with same email previously registered
    And I verify the email address
    Then the email address verified page is loaded with a continue button
    Then I am redirected to provide my other details
    When I provide all my details
    Then I am redirected to password page
    When I provide my new password
    Then my account is created and taken to confirmation page
    When I am on request-new-verification-link
    When I click on 'change email details link'
    When I enter the email address
    And I click `Request New Link` button
    Then I am shown - You already have an account

  @registration
  Scenario: Should not register existing user
    When I click create an account on the landing page
    Then the registration page is displayed
    When I provide my email address
    When I verify the email address
    Then the email address verified page is loaded with a continue button
    Then I am redirected to provide my other details
    When I provide all my details
    Then I am redirected to password page
    When I provide my password
    Then my account is created and taken to confirmation page
    When I navigate back to landing page
    When I create an account with same email previously registered
    Then I am shown the message user already registered
    When I verify my email address again
    Then I am shown - You already have an account
    When I click the verification link that is expired
    Then I am shown 'link expired' and the link to 'request new link'

  @registration
  Scenario: user registration email page validation
    When I click create an account on the landing page
    Then the registration page is displayed
    When I click back navigation button
    Then I am taken back to create an account page
    When I click create an account on the landing page
    When I click send verification email without providing any details
    Then I am shown form error message
      | Error | Enter a real email addressConfirm your email address |
    When I enter invalid email address and continue without confirm email address
    Then I am shown corresponding error message
      | Field | emailAddress-error                |
      | Error | Error: Enter a real email address |
    Then I am shown corresponding error message
      | Field | repeatEmailAddress-error          |
      | Error | Error: Confirm your email address |
    When I enter confirm email which is not same as email address
    Then I am shown corresponding error message
      | Field | repeatEmailAddress-error          |
      | Error | Error: Email addresses must match |
    When I provide my email address
    When I verify the email address
    Then the email address verified page is loaded with a continue button
    Then I am redirected to provide my other details
    When I click continue without providing any details
    Then I am shown form error message
      | Error | Enter your full nameEnter your company nameSelect an international dialling codeEnter a telephone numberSelect a countrySelect yes if your company is a shipping agent |
    When there are no dial codes that match the number given
    Then I am shown no results found for dialled code
    When I have typed at least one number in dialling code field
    Then a list of possible matched dialled code is returned
    When I have typed at least 2 letters in the country field
    Then a list of possible matched country name is returned
    When there are no country names that contain combination of letters
    Then I am shown no results found for country field
    When I provide any letters in telephone number field
    Then I am shown corresponding error message
      | Field | telephoneNumber-error                                 |
      | Error | Error: Telephone number must be in the correct format |
    When I enter non allowed symbols like  / <>
    Then I am shown corresponding error message
      | Field | telephoneNumber-error                                 |
      | Error | Error: Telephone number must be in the correct format |
    When I enter only allowed symbols and NO numbers
    Then I am shown corresponding error message
      | Field | telephoneNumber-error                                 |
      | Error | Error: Telephone number must be in the correct format |
    When I provide all my details
    Then I am redirected to password page
    When I click back navigation button
    Then I am redirected to provide my other details
    When I provide all my details
    Then I am redirected to password page
    When I click continue without providing any details
    Then I am shown form error message
      | Error | Enter a passwordConfirm your password |
    When I enter password less than 10 characters
    Then I am shown corresponding error message
      | Field | requirePassword-error                               |
      | Error | Error: Password must be at least 10 characters long |
    When I enter password in invalid format
    Then I am shown corresponding error message
      | Field | requirePassword-error                   |
      | Error | Error: Password must not contain spaces |
    When I provide my password
    Then my account is created and taken to confirmation page
    When I navigate back
    When I provide my password
    Then I am shown - You already have an account

  Scenario: user attempts to request resend but we don't know their email address
    When I am on request-new-verification-link
    And I click `Request New Link` button
    Then I am shown corresponding error message
      | Field | emailAddress-error              |
      | Error | Error: Enter your email address |
    When I enter the email address
    And I click `Request New Link` button
    Then I am taken to check your email page

  Scenario: User redirected to request-new-verification-link when email address not identified
    When the user has reached your-details page and the application cannot identify user email address
    Then the application redirect user to the verification failed page
    When I click the resend verification email button
    Then the user is redirected to request-new-verification-link

  Scenario: user has added a new email address to resend form which has been tried for registration before
    When I click create an account on the landing page
    Then the registration page is displayed
    When I provide my email address
    Then I am taken to check your email page
    When I navigate back to landing page
    When I click create an account on the landing page
    Then the registration page is displayed
    And I provide new email address
    Then I am taken to check your email page
    When I click on request new email
    Then I am on request-new-verification-link
    When I click change the email sent and  change to different email
    And I click `Request New Link` button
    Then I am taken to check your email page
    And I verify the email address
    Then the email address verified page is loaded with a continue button
