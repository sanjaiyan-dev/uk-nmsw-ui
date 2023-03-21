Feature: Check your answer page
  As a user I can able to check the details I have given and submit the declaration

  Background: User navigates to check your answers page
    Given I am on the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    When I click report a voyage
    Then I am taken to upload-general-declaration page
    When I have uploaded 'Fal1-Files''General declaration FAL 1-Positive-test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    Then I can verify voyage details on the task details page
    When I click Check answers and submit
    Then I can verify the Check Your Answers page

  Scenario: Verify the details of Voyage details
    Then the details from my FAL 1 form are displayed on CYA page
    When I click change the voyage details link
    Then I am taken to upload-general-declaration page
    When I have uploaded 'Fal1-Files''General declaration FAL 1 - goodData.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    Then I can verify new voyage details on the task details page
    When I click Check answers and submit
    Then I can view Check Your Answers page
