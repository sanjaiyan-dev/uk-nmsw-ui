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

  Scenario: Error messages shown when user uploads required fields with null values
    When I have uploaded 'Fal5-Files''FAL5-mandatory-fields-missing.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-mandatory-fields-missing.xlsx'
    And I am shown error messages for 'null values'

  Scenario: Error messages shown when user uploads file with invalid DOB
    When I have uploaded 'Fal5-Files''FAL5-DOB.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-DOB.xlsx'
    Then I am shown error messages for 'invalid DOB'

  Scenario: Error messages shown when user uploads file with family name above 35 characters
    When I have uploaded 'Fal5-Files''FAL5-FamilyNameOver35.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-FamilyNameOver35.xlsx'
    Then I am shown error messages for 'fName above 35'

  Scenario: Error messages shown when user uploads file with invalid gender value
    When I have uploaded 'Fal5-Files''FAL5-Gender.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-Gender.xlsx'
    Then I am shown error messages for 'invalid gender value'

  Scenario: Error messages shown when user uploads file with given name with invalid characters'
    When I have uploaded 'Fal5-Files''FAL5-GivenNameInvaildCharacters.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-GivenNameInvaildCharacters.xlsx'
    Then I am shown error messages for 'invalid name characters'

  Scenario: Error messages shown when user uploads file with given name over 35 characters
    When I have uploaded 'Fal5-Files''FAL5-GivenNameOver35.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-GivenNameOver35.xlsx'
    Then I am shown error messages for 'givenName over 35'

  Scenario: Error messages shown when user uploads file with invalid travel document number
    When I have uploaded 'Fal5-Files''FAL5-invalidTravelDocNumber.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-invalidTravelDocNumber.xlsx'
    Then I am shown error messages to help me fix them for 'invalid travel docNo'

  Scenario: Error messages shown when user uploads file with invalid travel documents
    When I have uploaded 'Fal5-Files''FAL5-invalidValueTravelDoc.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-invalidValueTravelDoc.xlsx'
    Then I am shown error messages for 'invalid travel documents'

  Scenario: Error messages shown when user uploads file with no given name
    When I have uploaded 'Fal5-Files''FAL5-noGivenName.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-noGivenName.xlsx'
    Then I am shown error messages for 'no given name'

  Scenario: Error messages shown when user uploads file with no issuing country
    When I have uploaded 'Fal5-Files''FAL5-noIssuingCountry.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-noIssuingCountry.xlsx'
    Then I am shown error messages for 'no issuing country'

  Scenario: Error messages shown when user uploads file with no rank rating
    When I have uploaded 'Fal5-Files''FAL5-noRankrating.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-noRankrating.xlsx'
    Then I am shown error messages for 'no rank rating'

  Scenario: Error messages shown when user uploads file with no travel document number
    When I have uploaded 'Fal5-Files''FAL5-noTravelDocNumber.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-noTravelDocNumber.xlsx'
    Then I am shown error messages for 'no travel docNo'

  Scenario: Error messages shown when user uploads file with no value for O
    When I have uploaded 'Fal5-Files''FAL5-noValueForO.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-noValueForO.xlsx'
    Then I am shown error messages for 'no value for O'

  Scenario: Error messages shown when user uploads file with rank over 35
    When I have uploaded 'Fal5-Files''FAL5-rankratingOver35.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-rankratingOver35.xlsx'
    Then I am shown error messages for 'rank over 35'

  Scenario: Error messages shown when user uploads file without travel documents details
    When I have uploaded 'Fal5-Files''FAL5-travelDocMissing.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-travelDocMissing.xlsx'
    Then I am shown error messages for 'noTravel doc details'

  Scenario: Error messages shown when user uploads file without travel documents details
    When I have uploaded 'Fal5-Files''FAL5-3letterIssuingCountry.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL5-3letterIssuingCountry.xlsx'
    Then I am shown error messages for 'no3 Letter Country'
