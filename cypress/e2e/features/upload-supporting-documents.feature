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

  @regression @deleteDeclaration
  Scenario: User should be able to upload supporting documents for voyage report
    #upload mare than maximum allowed files
    When I add more files than limited number of supporting documents
      | fileName                                                                  |
      | ValidMELLINA CREW EFFECTS.xlsx                                            |
      | ValidTest_Data_100KB_RTF.rtf                                              |
      | ValidTest_data_xltm.xltm                                                  |
      | ValidNMSW FAL 5 and 6 Supporting Information - Crew Off Signers List.xlsx |
      | ValidTest_Data.xml                                                        |
      | ValidTest_Data_100KB_DOC.doc                                              |
      | ValidTest_Data_500KB_DOCX.docx                                            |
      | ValidTest_Data_csv.csv                                                    |
      | ValidTest_Data_Text.docm                                                  |
    Then I am shown corresponding error message
      | Field | multiFileUploadForm-error                                 |
      | Error | Error: You've selected too many files: you can only add 8 |
    #upload valid file
    When I upload a valid files, it gets uploaded
      | fileName                                                                  |
      | ValidNMSW FAL 5 and 6 Supporting Information - Crew Off Signers List.xlsx |
      | ValidTest_Data.xml                                                        |
      | ValidTest_Data_100KB_DOC.doc                                              |
      | ValidTest_Data_500KB_DOCX.docx                                            |
      | ValidTest_Data_csv.csv                                                    |
      | ValidTest_Data_Text.docm                                                  |
      | ValidTest_data_xltm.xltm                                                  |
    Then I can delete files added to add more files
    #upload file more than 1MB
    When I add files more than 1Mb
      | fileName                |
      | MBFileTest_Data_XLS.xls |
    Then I am shown error message file must be smaller than 1MB
      | fileName                |
      | MBFileTest_Data_XLS.xls |
    Then I can delete files added to add more files
    #upload invalid file types
    When I upload a file type that is not valid
      | fileName                              |
      | InvalidFree_Test_Data_100KB_PDF.pdf   |
      | InvalidFree_Test_Data_100KB_PPTX.pptx |
      | InvalidSample-gif-Image.gif           |
      | Invalidstylesheet-css.css             |
    Then I am shown error message to upload correct file type for the files uploaded
      | fileName                              |
      | InvalidFree_Test_Data_100KB_PDF.pdf   |
      | InvalidFree_Test_Data_100KB_PPTX.pptx |
      | InvalidSample-gif-Image.gif           |
      | Invalidstylesheet-css.css             |
    #re-upload correct files
    Then I am able to choose valid number of documents and upload in Files added section
      | fileName                       |
      | ValidMELLINA CREW EFFECTS.xlsx |
      | ValidTest_Data.xml             |
      | ValidTest_Data_500KB_DOCX.docx |
    Then I am able to delete the file
    #upload same file that is already uploaded
    When I attempt to add a file with the same name that is already added
      | fileName                       |
      | ValidMELLINA CREW EFFECTS.xlsx |
    Then I am shown an error message for 'ValidMELLINA CREW EFFECTS.xlsx'
    When auth token is no longer available to upload file
    Then I am taken to the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to upload supporting documents page
    #add more files within max limit
    Then I am able to add more limited number files to already added supporting files
      | fileName                     |
      | ValidTest_data_xltm.xltm     |
      | ValidTest_Data_100KB_RTF.rtf |
    #add more files which will exceed max limit
    When I add some more files than limited number of supporting documents
      | fileName                                                                  |
      | ValidMELLINA CREW EFFECTS.xlsx                                            |
      | ValidNMSW FAL 5 and 6 Supporting Information - Crew Off Signers List.xlsx |
      | ValidTest_Data.xml                                                        |
      | ValidTest_Data_100KB_DOC.doc                                              |
      | ValidTest_Data_500KB_DOCX.docx                                            |
      | ValidTest_Data_csv.csv                                                    |
      | ValidTest_Data_Text.docm                                                  |
    Then I am shown corresponding error message
      | Field | multiFileUploadForm-error                                             |
      | Error | Error: You've selected too many files: you can add up to 3 more files |
    When auth token is no longer available
    When I click save and continue
    Then I am taken to the sign-in page
    When I have entered a correct email address and password and sign in
    Then I am taken to task details page
    When I click on supporting documents link
    Then I am taken to upload supporting documents page
    Then I can see the supporting documents I have uploaded
      | fileName                       |
      | ValidMELLINA CREW EFFECTS.xlsx |
      | ValidTest_Data.xml             |
      | ValidTest_Data_500KB_DOCX.docx |
