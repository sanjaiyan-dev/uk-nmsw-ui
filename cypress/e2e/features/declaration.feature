Feature: Submit or cancel the declaration request
  As an agent I can able to submit or cancel a declaration

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
    When I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page
    When I have uploaded 'Fal6-Files''Passenger details FAL 6-PositiveData.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click supporting documents link
    Then I am taken to upload supporting documents page
    Then I am able to choose valid number of documents and upload in Files added section
      | fileName                       |
      | ValidMELLINA CREW EFFECTS.xlsx |
    When I click save and continue
    Then I am taken to task details page
    And I can see Check answers and submit enabled
    When I click Check answers and submit
    Then I am taken to Check Your Answers page

  Scenario: User can able to cancel a declaration that has not yet been submitted
    When I click Your voyage tab
    Then I am taken to your-voyages page
    Then I can see the draft details of the voyage, I have uploaded
    When I click continue under actions
    Then I am taken to task details page
    When I click delete draft
    Then I am taken to confirm delete draft page
    When I click Yes to delete the draft and confirm
    Then I can see the confirmation banner -Voyage details deleted

  Scenario: User can able to submit the declaration request
    When I click Save and Submit to confirm submission
    Then I can see the confirmation banner -Voyage details submitted
    When I click return to your voyages link
    Then I can see the status of reported voyage as SUBMITTED
    When I click review or cancel action link next to Submitted status
    Then I am taken to review your report with submitted status

  Scenario: User can able to cancel the submitted declaration
    When I click Save and Submit to confirm submission
    Then I can see the confirmation banner -Voyage details submitted
    When I click return to your voyages link
    Then I can see the status of reported voyage as SUBMITTED
    When I click review or cancel action link next to Submitted status
    Then I am taken to review your report with submitted status
    When I click cancel, to cancel the submitted voyage report
    Then I click Yes to confirm the voyage report cancel
    And I can see the confirmation banner for cancellation
    Then I can see the status of reported voyage as CANCELLED
    When I click review action link next to Cancelled status
    Then I am taken to review your report with Cancelled status
