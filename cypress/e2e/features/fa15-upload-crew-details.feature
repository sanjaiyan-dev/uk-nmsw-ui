Feature: Upload Crew details (FAL5) file
  As a user I can able to upload crew details for voyage report

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

  @regression @deleteDeclaration
  Scenario: User should be able to upload fal5-crew details file for voyage report
    When I have uploaded 'Fal5-Files''Crew details including supernumeraries FAL 5-Positive-Test.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I try to access a protected CYA page with declaration Id
    When I click Save and Submit
    Then I am shown form error message
      | Error | You need to provide passenger details, even if the ship is carrying no passengers |

  Scenario: Crew details page validation
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
    When I upload a template file 'Crew details including supernumeraries FAL 5.xlsx' with null values
    When I click check for errors
    Then I am shown corresponding error message
      | Field | fileUploadInput-error    |
      | Error | Error: Template is empty |
