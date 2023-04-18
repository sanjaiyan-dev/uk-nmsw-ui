Feature: Upload Passenger details (FAL6) file
  As a user I can able to upload Passenger details for voyage report

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
    And I can see status for FAL6 as required
    When I click Passenger details link
    Then I am taken to Passenger-details page

  @regression
  Scenario: User should be able to upload fal6-Passenger details file for voyage report
    When I select Yes to uploading passenger details
    When I navigate back to task details page
    Then I am taken to task details page
    And I can see status for FAL6 as required
    When I click Passenger details link
    Then I am taken to Passenger-details page
    When I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page
    When I have uploaded 'Fal6-Files''Passenger details FAL 6-PositiveData.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    And I can see status for FAL6 as completed and FAL5 as required

  Scenario: User taken to task details page when selected No to uploading passenger details
    When I select No to uploading passenger details
    Then I am taken to task details page
    And I can see status for FAL6 as completed and FAL5 as required

  Scenario: Passenger details page validation
    When I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page
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
    When I upload a template file 'Passenger details FAL 6.xlsx' with null values
    When I click check for errors
    Then I am shown corresponding error message
      | Field | fileUploadInput-error    |
      | Error | Error: Template is empty |
