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
      | fileName                                                                  |
      | ValidMELLINA CREW EFFECTS.xlsx                                            |
      | ValidNMSW FAL 5 and 6 Supporting Information - Crew Off Signers List.xlsx |

    When I click save and continue
    Then I am taken to task details page
    And I can see Check answers and submit enabled
    When I click Check answers and submit
    Then I am taken to Check Your Answers page
    And the details from my FAL 1 form are displayed on CYA page

  @regression @deleteDeclaration
  Scenario: User can able to cancel a declaration that has not yet been submitted
    When I click Your voyage tab
    Then I am taken to your-voyages page
    Then I can see the draft details of the voyage, I have uploaded
    Then I am taken to task details page
    When I click delete draft
    Then I am taken to confirm delete draft page
    When I click Yes to delete the draft and confirm
    Then I can see the confirmation banner -Voyage details deleted

  @regression
  Scenario: User can able to submit the declaration request
    When I confirm submission
    Then I can see the confirmation banner -Voyage details sent
    When I click return to your voyages link
    Then I can see the reported voyage
    And I can review the report with the pending or submitted status

  @regression
  Scenario: User can able to cancel the submitted declaration
    When I confirm submission
    Then I can see the confirmation banner -Voyage details sent
    When I click return to your voyages link
    Then I can see the reported voyage
    And I can review the report with the pending or submitted status
    When I click cancel, to cancel the submitted voyage report
    Then I click Yes to confirm the voyage report cancel
    And I can see the confirmation banner for cancellation
    Then I can see the cancelled reported voyage
    Then I am taken to review the report with Cancelled status

  Scenario: User can able to submit and cancel report to CBP for crown dependency ports
    When I click change the voyage details link
    Then I am taken to upload-general-declaration page
    When I have uploaded 'Fal1-Files''FAL 1-CrownDependency.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click Check answers and submit
    Then I can view Check Your Answers page
    And the details from my FAL1-crown dependency are displayed on CYA page
    When I confirm submission
    Then I can see the confirmation banner -Voyage details sent
    When I click return to your voyages link
    Then I can see the reported voyage for crown dependency
    And I can review the report with the pending or submitted status
    When I click cancel, to cancel the submitted voyage report
    Then I click Yes to confirm the voyage report cancel
    And I can see the confirmation banner for cancellation for crown dependency report
    Then I can see the cancelled reported voyage
    Then I am taken to review the report with Cancelled status

  Scenario: User can able to submit the declaration with allowed spl characters
    When I click change next to crew details
    Then I am taken to upload-crew-details page
    When I have uploaded 'Fal5-Files''FAL5-with-spl-characters.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click Check answers and submit
    Then I am taken to Check Your Answers page
    When I click change next to Passenger details
    Then I am taken to Passenger-details page
    When I select Yes to uploading passenger details
    Then I am taken to upload-Passenger-details page
    When I have uploaded 'Fal6-Files''FAL6-With-Spl-characters.xlsx'
    When I click check for errors
    When there are no errors, I am shown the no errors found page
    When I click save and continue
    Then I am taken to task details page
    When I click Check answers and submit
    Then I am taken to Check Your Answers page
    When I confirm submission
    Then I can see the confirmation banner -Voyage details sent
    When I click return to your voyages link
    Then I can see the reported voyage
    And I can review the report with the pending or submitted status
