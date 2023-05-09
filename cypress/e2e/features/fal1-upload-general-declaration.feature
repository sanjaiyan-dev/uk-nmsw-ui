Feature: Upload General declaration (FAL1) page
  As a user I can able to upload general declaration for voyage report

  Background:
    Given I am on the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to your-voyages page
    Then I am able to see the total number of voyage reports
    When I click report a voyage
    Then I am taken to upload-general-declaration page

  Scenario: General declaration page validation
    When I navigate back to your-voyage page without adding General Declaration
    Then the voyage without general declaration is not added to the reported voyage
    Then I click report a voyage
    Then I am taken to upload-general-declaration page
    When I click check for errors without uploading any file
    Then I am shown corresponding error message
      | Field | fileUploadInput-error |
      | Error | Error: Select a file  |
    When I upload the file is not of type .csv or .xlsx
    Then previous the error message should clear
    When I click check for errors for file not of type .csv or .xlsx
    Then I am shown corresponding error message
      | Field | fileUploadInput-error                 |
      | Error | Error: The file must be a csv or xlsx |
    When I upload the file larger than 4MB
    When I click check for errors for file larger than 4MB
    Then I am shown corresponding error message
      | Field | fileUploadInput-error                    |
      | Error | Error: The file must be smaller than 4MB |

  @regression @deleteDeclaration
  Scenario: Upload general declaration (Fal1) successfully
    When I have uploaded 'Fal1-Files''General declaration FAL 1-Positive-test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found for 'General declaration FAL 1-Positive-test.xlsx'
    When I click save and continue
    Then I am taken to task details page
    When I try to access a protected CYA page with declaration Id
    When I click Save and Submit
    Then I am shown form error message
      | Error | Crew details (FAL 5) upload is requiredYou need to provide passenger details, even if the ship is carrying no passengers |
