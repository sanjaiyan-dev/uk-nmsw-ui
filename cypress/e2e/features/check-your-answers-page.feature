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
    When I click crew details link
    Then I am taken to upload-crew-details page
    When I have uploaded 'Fal5-Files''Crew details including supernumeraries FAL 5-Positive-Test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click Passenger details link
    Then I am taken to Passenger-details page
    When I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page
    When I have uploaded 'Fal6-Files''Passenger details FAL 6-PositiveData.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    And I can see Check answers and submit enabled
    When I click Check answers and submit
    Then I can view Check Your Answers page
    Then I can verify the Check Your Answers page

  Scenario: User can Verify the details upload and change the details
    And the details from my FAL 1 form are displayed on CYA page
    When I click change the voyage details link
    Then I am taken to upload-general-declaration page
    When I have uploaded 'Fal1-Files''General declaration FAL 1 - goodData.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click Check answers and submit
    Then I can view Check Your Answers page
