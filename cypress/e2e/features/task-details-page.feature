Feature: Task details page after file uploads
  As a user I can able to see task details page after file uploads

  Background: sign-in to upload files
    Given I am on the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    When I click report a voyage
    Then I am taken to upload-general-declaration page

  @regression @deleteDeclaration
  Scenario: I can see task details page after fal1 gets uploaded successfully
    When I have uploaded 'Fal1-Files''General declaration FAL 1-Positive-test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    And I sign-out
    When I try to access a protected page with declaration Id
    Then I am taken to the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to task details page
    And I can see status for FAL5 as required
    Then I can verify voyage details on the task details page
    And I can see Check answers and submit not enabled
    When I click crew details link
    Then I am taken to upload-crew-details page
    When I have uploaded 'Fal5-Files''FAL5-with-spl-characters.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    And I can see status for FAL5 as completed
    And I can see Check answers and submit not enabled
    And I can see status for FAL6 as required
    When I click Passenger details link
    Then I am taken to Passenger-details page
    When I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page
    When I have uploaded 'Fal6-Files''FAL6-With-Spl-characters.xlsx'
    When I click check for errors
    Then the FE sends a POST to the declarationId endpoint
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    And I can see status for FAL6 as completed
    And I sign-out
    When I try to access a protected page with declaration Id
    Then I am taken to the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to task details page
    And I can see status for FAL6 as completed
    And I can see Check answers and submit enabled
    When I click Your voyage tab
    Then I am taken to your-voyages page
    Then I can see the draft details of the voyage, I have uploaded
    When I click continue under actions
    Then I am taken to task details page
    When I click delete draft
    Then I am taken to confirm delete draft page
    When I click No to delete the draft
    Then I am taken to task details page
    When I click delete draft
    Then I am taken to confirm delete draft page
    When I click Yes to delete the draft and confirm
    Then I am taken to your-voyages page

  Scenario: Verify application navigates user to sign-in page with missing auth token
    When I have uploaded 'Fal1-Files''General declaration FAL 1-Positive-test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When auth token is no longer available
    When I click save and continue
    Then I am taken to the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to task details page

  @deleteDeclaration
  Scenario: Error messages shown when user uploads Fal5 and 6 with same document number and country
    When I have uploaded 'Fal1-Files''General declaration FAL 1-Positive-test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click crew details link
    When I have uploaded 'Fal5-Files''FAL 5-With-2same-NumberAndCountry.xlsx'
    When I click check for errors
    Then I am shown corresponding error message
      | Field | fileUploadInput-error                                                                                                                                                    |
      | Error | Error: Details listed on this file are not allowed, because they're the same as details you've already uploaded. Check the details in your file and try uploading again. |
    When I have uploaded 'Fal5-Files''Crew details including supernumeraries FAL 5-Positive-Test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click Passenger details link
    When I select Yes to uploading passenger details
    When I have uploaded 'Fal6-Files''FAL 6-With-2same-NumberAndCountry.xlsx'
    When I click check for errors
    Then I am shown corresponding error message
      | Field | fileUploadInput-error                                                                                                                                                    |
      | Error | Error: Details listed on this file are not allowed, because they're the same as details you've already uploaded. Check the details in your file and try uploading again. |
    When I have uploaded 'Fal6-Files''FAL 6-With-same-TD-NumberAndCountry-asFAL5.xlsx'
    When I click check for errors
    Then I am shown corresponding error message
      | Field | fileUploadInput-error                                                                                                                                                    |
      | Error | Error: Details listed on this file are not allowed, because they're the same as details you've already uploaded. Check the details in your file and try uploading again. |
    And I click Your voyage tab
    Then I am taken to your-voyages page
    Then I can see the draft details of the voyage, I have uploaded
    When I click continue under actions
    Then I am taken to task details page
    And I can see the see the status of Fal-6 as required
    When I click Passenger details link
    Then I am taken to Passenger-details page
    When I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page
    When I have uploaded 'Fal6-Files''FAL 6-CorrectedWith-same-TD-NumberAndCountry-asFAL5.xlsx'
    When I click check for errors
    When I click save and continue
    Then I am taken to task details page
    And I can see status for FAL6 as completed
