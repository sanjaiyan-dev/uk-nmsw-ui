Feature: User Registration
  As a user I can able to register/create account on NMSW

  Background:
    Given I am on NMSW landing page

  Scenario: Successful user registration
    When I click create an account on the landing page
    Then the registration page is displayed
    When I can provide my email address
    When I verify the email address
    Then the email address verified page is loaded with a continue button
    Then I am redirected to provide my other details
    When I provide all my details
    Then I am redirected to password page
    When I provide my password
    Then my account is created and taken to confirmation page
    When I verify my email address again
    Then I am shown - You already have an account
    When I click the verification link that is expired
    Then I am shown 'link expired' and the link to 'request new link'

#  Scenario: Should not register existing user
#    When I click create an account on the landing page
#    Then the registration page is displayed
#    When I can provide my email address
#    When I verify the email address
#    Then I am redirected to provide my other details
#    When I navigate back to landing page
#    When I create an account with same email previously registered
#    Then I am shown the message user already registered
#    When I click sign-in
#    Then I am taken to the sign-in page


#  Scenario: user registration email page validation
#    When I click create an account on the landing page
#    Then the registration page is displayed
#    When I click back navigation button
#    Then I am taken back to create an account page
#    When I click create an account on the landing page
#    When I click send verification email without providing any details
#    Then I am shown form error message
#      | Error | Enter an email address in the correct format, like name@example.comConfirm your email address |
#    When I enter invalid email address and continue without confirm email address
#    Then I am shown corresponding error message
#      | Field | emailAddress-error                                                         |
#      | Error | Error: Enter an email address in the correct format, like name@example.com |
#    Then I am shown corresponding error message
#      | Field | repeatEmailAddress-error          |
#      | Error | Error: Confirm your email address |
#    When I enter confirm email which is not same as email address
#    Then I am shown corresponding error message
#      | Field | repeatEmailAddress-error               |
#      | Error | Error: Your email addresses must match |
#    When I can provide my email address
#    When I verify the email address
#    Then I am redirected to provide my other details
#    When I click continue without providing any details
#    Then I am shown form error message
#      | Error | Enter your full nameEnter your company nameEnter your phone numberEnter countrySelect is your company a shipping agent |
#    When I click back navigation button
#    When I verify the email address
#    Then I am redirected to provide my other details
#    When I provide all my details
#    Then I am redirected to password page
#    When I click back navigation button
#    Then I am redirected to provide my other details
#    When I provide all my details
#    Then I am redirected to password page
#    When I click continue without providing any details
#    Then I am shown form error message
#      | Error | Enter a passwordConfirm your password |
#    When I enter password less than 10 characters
#    Then I am shown corresponding error message
#      | Field | requirePassword-error                                |
#      | Error | Error: Passwords must be at least 10 characters long |
#    When I enter password in invalid format
#      | Field | requirePassword-error                                |
#      | Error | Error: Enter a password that does not contain spaces |

#  Scenario: User redirected to request-new-verification-link when email address not identified
#    When the user has reached your-details page and the application cannot identify user email address
#    Then the application redirect user to the verification failed page
#    When I click the resend verification email button
#    Then the user is redirected to request-new-verification-link
