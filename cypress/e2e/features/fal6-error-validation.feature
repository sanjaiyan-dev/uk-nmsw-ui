Feature: Display FAL 6 field level errors
  As a user I can able to see clear error messages when uploading crew details for voyage report
  to help me fix it

  Background: Upload Passenger-details page
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
    When I click Passenger details link
    Then I am taken to Passenger-details page
    When I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page

  Scenario: Error messages shown when user uploads file with invalid Characters
    When I have uploaded 'Fal6-Files''Passenger details FAL 6 - invalidCharacters.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'Passenger details FAL 6 - invalidCharacters.xlsx'
    Then I am shown error messages to fix for 'invalid Characters'

  Scenario: Error messages shown when user uploads file with invalid dates
    When I have uploaded 'Fal6-Files''Passenger details FAL 6 - invalidDates.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'Passenger details FAL 6 - invalidDates.xlsx'
    Then I am shown error messages to fix for 'invalid Dates'

  Scenario: Error messages shown when user uploads file with more than allowed characters
    When I have uploaded 'Fal6-Files''Passenger details FAL 6 - maxCharacters.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'Passenger details FAL 6 - maxCharacters.xlsx'
    Then I am shown error messages to fix for 'max Characters'

  Scenario: Error messages shown when user uploads file with mandatory missing values'
    When I have uploaded 'Fal6-Files''Passenger details FAL 6 - missingOtherTD.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'Passenger details FAL 6 - missingOtherTD.xlsx'
    Then I am shown error messages to fix for 'missing Other Document'

  Scenario: Error messages shown when user uploads file with mandatory missing values
    When I have uploaded 'Fal6-Files''FAL6-mandatory-fields-missing.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL6-mandatory-fields-missing.xlsx'
    Then I am shown error messages to fix for 'missing values'
