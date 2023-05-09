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
    When I select No to uploading passenger details
    Then I am taken to task details page
    And I can see status for FAL6 as completed
    And I can see Check answers and submit enabled
    When I click Check answers and submit
    Then I can view Check Your Answers page
    And passenger section state No passenger details provided
    When I click on change next to Passenger details
    And I select Yes to uploading passenger details
    When I navigate back to check your answers page
    When I click Save and Submit
    Then I am shown form error message
      | Error | Passenger details (FAL 6) upload is required for ships carrying passengers |
    When I click on change next to Passenger details
    And I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page
    When I have uploaded 'Fal6-Files''Passenger details FAL 6-PositiveData.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    And I can see Check answers and submit enabled
    When I click Check answers and submit
    When there is no supporting documents attached, I can see-no supporting documents message
    When I click change next to supporting documents
    Then I am taken to upload supporting documents page
    Then I am able to choose valid number of documents and upload in Files added section
      | fileName                       |
      | ValidMELLINA CREW EFFECTS.xlsx |
    When I click save and continue
    Then I am taken to task details page
    When I click Check answers and submit
    Then I am taken to Check Your Answers page
    And the details from my FAL 1 form are displayed on CYA page

  @regression
  Scenario Outline: User can verify the details uploaded and change the details
    Then I can see a link to an uploaded crew file 'Fal5-Files''Crew details including supernumeraries FAL 5-Positive-Test.xlsx'
    When I click on the file name for 'Fal5-Files', it is downloaded
    Then I can see a link to an uploaded passenger file 'Fal6-Files''Passenger details FAL 6-PositiveData.xlsx'
    When I click on the file name for 'Fal6-Files', it is downloaded
    Then I can see a link to an uploaded supporting document files 'Supporting-Documents''ValidMELLINA CREW EFFECTS.xlsx'
    When I click on the file name for 'Supporting-Documents', it is downloaded
    When I click change the voyage details link
    Then I am taken to upload-general-declaration page
    When I have uploaded 'Fal1-Files''General declaration FAL 1 - goodData.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click Check answers and submit
    Then the FE sends a POST to the declarationId endpoint
    Then I can view Check Your Answers page
    And I sign-out
    When I try to access a protected CYA page with declaration Id
    Then I am taken to the sign-in page
    When I provide incorrect '<emailAddress>' and '<password>' and sign-in
    Then I am taken to error message page
    When I click - Click here to continue
    Then I am taken to your-voyages page
    And I sign-out
    Examples:
      | emailAddress                                       | password      |
      | 98748f98-2dcf-41b8-8bc9-9627e6cd0d80@mailslurp.com | Test-NMSW-Dev |
