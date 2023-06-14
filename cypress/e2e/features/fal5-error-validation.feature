Feature: Display FAL 5 field level errors
  As a user I can able to see clear error messages when uploading crew details for voyage report
  to help me fix it

  Background: Upload Crew-details page
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

  Scenario: Error messages shown when user uploads file with errors in different fields
    When I have uploaded 'Fal5-Files''FAL5-all-Errors.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-all-Errors.xlsx'
    Then I am shown error messages for 'mixed errors'

  Scenario: Error messages shown when user uploads file with mandatory missing values
    When I have uploaded 'Fal5-Files''FAL5-mandatory-fields-missing.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-mandatory-fields-missing.xlsx'
    Then I am shown error messages for 'missing values'

  Scenario: Error messages shown when user uploads file with more than allowed characters
    When I have uploaded 'Fal5-Files''FAL5-maxCharacters.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-maxCharacters.xlsx'
    Then I am shown error messages for 'max characters'

  Scenario: Error messages shown when user uploads file with invalid characters
    When I have uploaded 'Fal5-Files''FAL5-invalidCharacters.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-invalidCharacters.xlsx'
    Then I am shown error messages for 'invalid characters'

  Scenario: Error messages shown when user uploads file with invalid DOB
    When I have uploaded 'Fal5-Files''FAL5-invalidDOB.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-invalidDOB.xlsx'
    Then I am shown error messages for 'invalid DOB'
    When I click Re-upload file
    Then I am taken to upload-crew-details page

  Scenario: Error messages shown when user uploads file with invalid gender value
    When I have uploaded 'Fal5-Files''FAL5-invalidGender.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-invalidGender.xlsx'
    Then I am shown error messages for 'invalid gender value'
