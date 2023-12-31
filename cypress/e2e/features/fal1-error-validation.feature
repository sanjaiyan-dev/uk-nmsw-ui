Feature: Display FAL 1 field level errors
  As a user I can able to see clear error messages when uploading general declaration for voyage report
  to help me fix it

  Background: Sign-in to upload files
    Given I am on the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    When I click report a voyage
    Then I am taken to upload-general-declaration page

  Scenario: Error messages shown when user uploads required fields with null values
    When I have uploaded 'Fal1-Files''GDF1-mandatory-fields-missing.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-mandatory-fields-missing.xlsx'
    And I am shown error messages to help me fix them for 'null values'

  Scenario: Error messages shown when user uploads file with character limits breached
    When I have uploaded 'Fal1-Files''GDF1-too-many-characters.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-too-many-characters.xlsx'
    Then I am shown error messages to help me fix them for 'character limit'

  Scenario: Error messages shown when user uploads file with invalid characters
    When I have uploaded 'Fal1-Files''GDF1-invalidCharacters.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-invalidCharacters.xlsx'
    Then I am shown error messages to help me fix them for 'invalid characters'

  Scenario: Error messages shown when user uploads file with bad IMO or LOCODE
    When I have uploaded 'Fal1-Files''GDF1-bad-imo-and-locodes.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-bad-imo-and-locodes.xlsx'
    Then I am shown error messages to help me fix them for 'bad Imo-Locode'

  Scenario: Error messages shown when user uploads file with incorrect arrival port and related cells with invalid values'
    When I have uploaded 'Fal1-Files''GDF1-arrival-errors.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-arrival-errors.xlsx'
    Then I am shown error messages to help me fix them for 'invalid arrival-fields'

  Scenario: Error messages shown when user uploads file with incorrect departure port and related cells with invalid values
    When I have uploaded 'Fal1-Files''GDF1-departure-errors.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-departure-errors.xlsx'
    Then I am shown error messages to help me fix them for 'invalid departure-fields'

  Scenario: Error messages shown when user uploads file with departure date in future
    When I have uploaded 'Fal1-Files''GDF1-departure-dateinfuture.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-departure-dateinfuture.xlsx'
    Then I am shown error messages to help me fix them for 'departure-date in future'

  Scenario: Error messages shown when user uploads file with invalid date time formats
    When I have uploaded 'Fal1-Files''GDF1-bad-datetime.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-bad-datetime.xlsx'
    Then I am shown error messages to help me fix them for 'bad-dateTime'

  Scenario: Error messages shown when user uploads file with IMO with hyphen
    When I have uploaded 'Fal1-Files''GDF1-imo-with-prefix.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1-imo-with-prefix.xlsx'
    Then I am shown error messages to help me fix them for 'imo-with-hyphen'

  Scenario: Error messages shown when user uploads file with GB port locodes in XXX format
    When I have uploaded 'Fal1-Files''GDF1 -unlocode-with-XXX.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'GDF1 -unlocode-with-XXX.xlsx'
    Then I am shown error messages to help me fix them for 'unlocode-with-XXX'

  Scenario: Error messages shown when user uploads file with same arrival and departure ports
    When I have uploaded 'Fal1-Files''FAL1-same-arrival-departure-port.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL1-same-arrival-departure-port.xlsx'
    Then I am shown error messages to help me fix them for 'same-port-error'

  Scenario: Error messages shown when user uploads file with special characters that are not accepted and not deleted at the back end
    When I have uploaded 'Fal1-Files''FAL1-with-spl-characters-not-allowed-not-deleted.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL1-with-spl-characters-not-allowed-not-deleted.xlsx'
    Then I am shown error messages to help me fix them for 'spl-characters-not-allowed-not-deleted'

  Scenario: Error messages shown when user uploads file with special characters that are not accepted and deleted at the back end
    When I have uploaded 'Fal1-Files''FAL1-with-spl-characters-deleted-in-BE.xlsx'
    When I click check for errors
    Then I am taken to Errors found page for 'FAL1-with-spl-characters-deleted-in-BE.xlsx'
    Then I am shown error messages to help me fix them for 'BE-deleted-spl-characters-and-require-mandatory-values'

  Scenario: No error messages should be shown for uploading files with IMO numbers only
    When I have uploaded 'Fal1-Files''GDF1-imo-goodwithIMONumberOnly.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found for 'GDF1-imo-goodwithIMONumberOnly.xlsx'

  Scenario: No error messages should be shown for uploading files with LOCODE with spaces
    When I have uploaded 'Fal1-Files''GDF1-LOCODE-GoodWithSpaces.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found for 'GDF1-LOCODE-GoodWithSpaces.xlsx'

  Scenario: No error messages should be shown for uploading values with whitespaces
    When I have uploaded 'Fal1-Files''FAL 1-with-whitespace.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found for 'FAL 1-with-whitespace.xlsx'

  @deleteDeclaration
  Scenario: No error messages should be shown for uploading files with LOCODE without spaces
    When I have uploaded 'Fal1-Files''GDF1-LOCODE-GoodWithoutSpaces.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found for 'GDF1-LOCODE-GoodWithoutSpaces.xlsx'
