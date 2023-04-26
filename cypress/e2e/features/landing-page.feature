Feature: Landing page with link to Fal templates
  As a user I can able to see Fal templates to download and links to navigate

  @regression
  Scenario: Ensure landing page features are available for user to report a voyage
    Given I am on NMSW landing page
    When I click GOV UK logo
    Then I am taken to GOV UK page
    Then I can click short survey link for feedback
    When I click create an account on the landing page
    Then the registration page is displayed
    When I click back navigation button
    When I click File templates, I can able to download to use
    And I click start now
    Then I am taken to the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    When I click service name header
    Then user is redirected to NMSW landing page
    When I click template tab on the navigation bar
    When I click Your voyage tab
    Then I am taken to your-voyages page
    When I click your details tab
    Then I am taken to your details page
    When I click help tab
    Then I am taken to help and support page
    When I click File templates, I can able to download to use
    When I click footer Contact us Link
    Then I am taken to contact us page
    When I click help section in contact us page
    Then I am taken to help and support page with help menu highlighted
    And I can able to sign-out
    Then I am taken to the sign-in page
    When I click submit required forms using email
    Then I am taken to help and support page
    When I click footer Contact us Link
    Then I am taken to contact us page
    When I click help section in contact us page
    Then I am taken to help and support page
    When I click footer Accessibility link
    Then I am taken to accessibility page
    When I click footer Cookies link
    Then I am taken to cookie page
    When I click Privacy link
    Then I am taken to Privacy notice page
