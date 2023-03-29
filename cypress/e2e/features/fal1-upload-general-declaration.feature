Feature: Upload General declaration (FAL1) page
  As a user I can able to upload general declaration for voyage report

  Background:
    Given I am on the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    When I click report a voyage
    Then I am taken to upload-general-declaration page

  Scenario: General declaration page validation
    When I click check for errors without uploading any file
    Then I am shown corresponding error message
      | Field | fileUploadInput-error |
      | Error | Error: Select a file  |
    When I upload the file is not of type .csv or .xlsx
    Then previous the error message should clear
    When I click check for errors
    Then I am shown corresponding error message
      | Field | fileUploadInput-error                 |
      | Error | Error: The file must be a csv or xlsx |
    When I upload the file larger than 4MB
    When I click check for errors
    Then I am shown corresponding error message
      | Field | fileUploadInput-error                    |
      | Error | Error: The file must be smaller than 4MB |

  Scenario: Upload general declaration (Fal1) successfully
    When I have uploaded 'Fal1-Files''General declaration FAL 1-Positive-test.xlsx'
    When I click check for errors
    Then the FE sends a POST to the declaration-declarationId-upload-fal1 endpoint
    When there are no errors, I am shown the no errors found for 'General declaration FAL 1-Positive-test.xlsx'
    When I click save and continue
    Then I am taken to task details page
