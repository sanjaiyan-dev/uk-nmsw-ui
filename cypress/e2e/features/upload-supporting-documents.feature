Feature: Upload supporting documents
  As a user I can able to upload supporting documents for voyage report

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
    When I click supporting documents link
    Then I am taken to upload supporting documents page

  Scenario: User should be able to upload supporting documents for voyage report
    When I add more files than limited number of supporting documents
      | fileName                            |
      | GDF1-arrival-errors.xlsx            |
      | GDF1-bad-datetime.xlsx              |
      | GDF1-bad-imo-and-locodes.xlsx       |
      | GDF1-departure-dateinfuture.xlsx    |
      | GDF1-departure-errors.xlsx          |
      | GDF1-imo-goodwithIMO-prefix.xlsx    |
      | GDF1-imo-goodwithIMONumberOnly.xlsx |
      | GDF1-imo-goodwithIMOprefix.xlsx     |
      | GDF1-imo-invalidCharacters.xlsx     |

    Then I am shown corresponding error message
      | Field | multiFileUploadForm-error                                 |
      | Error | Error: You've selected too many files: you can only add 8 |
    When I upload a valid file, it gets uploaded
      | fileName                                  |
      | General declaration FAL 1 - goodData.xlsx |
    When I upload an invalid file, it gets rejected
      | fileName              |
      | MELLINA GEN DEC2.xlsx |
    Then I am able to choose valid number of documents, to upload in Files added section
      | fileName                  |
      | MELLINA CREW EFFECTS.xlsx |
      | MELLINA GEN DEC.xlsx      |
      | USPassportinside.jpg      |
    When I attempt to add a file with the same name that is already added
      | fileName                  |
      | MELLINA CREW EFFECTS.xlsx |
    Then I am shown an error message for 'MELLINA CREW EFFECTS.xlsx'
    Then I am able to add more limited number files to already added supporting files
      | fileName                                     |
      | GDF1-arrival-errors.xlsx                     |
      | General declaration FAL 1-Positive-test.xlsx |
    When I add some more files than limited number of supporting documents
      | fileName                                                             |
      | MELLINA SHIPS STORES (003).xlsx                                      |
      | NMSW FAL 5 and 6 Supporting Information - Crew Off Signers List.xlsx |
    Then I am shown corresponding error message
      | Field | multiFileUploadForm-error                                             |
      | Error | Error: You've selected too many files: you can add up to 1 more files |
    Then I am able to delete the file
    When I click save and continue
    Then I am taken to task details page
