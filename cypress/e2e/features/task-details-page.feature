Feature: Task details page after file uploads
  As a user I can able to see task details page after file uploads

  Background: sign-in to upload files
    Given I am on the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    When I click report a voyage
    Then I am taken to upload-general-declaration page

  Scenario: I can see task details page after fal1 gets uploaded successfully
    When I have uploaded 'Fal1-Files''General declaration FAL 1-Positive-test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    Then I can verify voyage details on the task details page

  Scenario: Verify application navigates user to landing page with missing auth token
    When I have uploaded 'Fal1-Files''General declaration FAL 1-Positive-test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When auth token is no longer available
    When I click save and continue
    Then user is redirected to NMSW landing page
#    And I click start now
#    When I have entered a correct email address and password and sign in
#    Then I am taken to task details page
