import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import FileUploadPage from "../../e2e/pages/file-upload.page";

const invalidCharacters = [
  {cellNumber: 'A5', error: 'Enter travel document as P, I, O or as Passport, ID card, Other'},
  {cellNumber: 'C5', error: 'Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'C6', error: 'Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'D5', error: 'Enter the number of the travel document using only numbers'},
  {
    cellNumber: 'E5',
    error: 'Enter the rank, rating or job title using English letters instead of special characters not recognised'
  },
  {
    cellNumber: 'F5',
    error: 'Enter family name or surname using English letters instead of special characters not recognised'
  },
  {cellNumber: 'G5', error: 'Enter forenames using English letters instead of special characters not recognised'},
  {
    cellNumber: 'H5',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {cellNumber: 'I5', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'J5', error: 'Enter place of birth using English letters instead of special characters not recognised'},
  {cellNumber: 'K5', error: 'Enter the nationality as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'L5', error: 'Enter the travel document expiry date in the dd/mm/yyyy format, for example, 12/02/2022'},
]

const missingValues = [
  {
    cellNumber: 'A6',
    error: 'Enter P, I or O, or you may enter the full word: P - Passport, I - ID card - for a national ID card or O - Other - for any other document'
  },
  {cellNumber: 'C5', error: 'Enter the 3-letter ISO country code for the issuing country; for example, GBR, SWE, NLD'},
  {cellNumber: 'D5', error: 'Enter the number of the travel document'},
  {
    cellNumber: 'E5',
    error: 'Enter the rank, rating or job title; for supernumeraries just put SN or supernumerary, not the job title'
  },
  {cellNumber: 'F5', error: 'Enter family name or surname as it appears in the travel document'},
  {
    cellNumber: 'F6',
    error: 'Enter family name or surname using English letters instead of special characters not recognised'
  },
  {
    cellNumber: 'G5',
    error: 'Enter all forenames or given names as they appear in the travel document - if the crew member has no forename recorded enter UNKNOWN'
  },
  {
    cellNumber: 'H5', error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
]

const maxCharacters = [
  {cellNumber: 'C5', error: 'Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'D5', error: 'Enter the number of the travel document in 35 characters or less'},
  {cellNumber: 'E5', error: 'Enter the rank, rating or job title in 35 characters or less'},
  {cellNumber: 'F5', error: 'Enter family name or surname in 35 characters or less'},
  {cellNumber: 'G5', error: 'Enter all forenames or given names in 35 characters or less'},
  {cellNumber: 'J5', error: 'Enter the place of birth in 35 characters or less'},
  {cellNumber: 'K5', error: 'Enter the nationality as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
]

const mixedErrors = [
  {
    cellNumber: 'A5',
    error: 'Enter P, I or O, or you may enter the full word: P - Passport, I - ID card - for a national ID card or O - Other - for any other document'
  },
  {cellNumber: 'A6', error: 'Enter travel document as P, I, O or as Passport, ID card, Other'},
  {
    cellNumber: 'B7',
    error: `You entered 'Other' as the travel document type. You must enter the type of travel document, for example SID for Seafarer's Identity Document`
  },
  {cellNumber: 'C8', error: 'Enter the 3-letter ISO country code for the issuing country; for example, GBR, SWE, NLD'},
  {cellNumber: 'C9', error: 'Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'D11', error: 'Enter the number of the travel document'},
  {cellNumber: 'D12', error: 'Enter the number of the travel document using only numbers'},
  {cellNumber: 'D13', error: 'Enter the number of the travel document in 35 characters or less'},
  {
    cellNumber: 'E14',
    error: 'Enter the rank, rating or job title; for supernumeraries just put SN or supernumerary, not the job title'
  },
  {cellNumber: 'E15', error: 'Enter the rank, rating or job title in 35 characters or less'},
  {
    cellNumber: 'E16',
    error: 'Enter the rank, rating or job title using English letters instead of special characters not recognised'
  },
  {cellNumber: 'F17', error: 'Enter family name or surname as it appears in the travel document'},
  {
    cellNumber: 'F18',
    error: 'Enter family name or surname using English letters instead of special characters not recognised'
  },
  {cellNumber: 'F19', error: 'Enter family name or surname in 35 characters or less'},
  {
    cellNumber: 'G20',
    error: 'Enter all forenames or given names as they appear in the travel document - if the crew member has no forename recorded enter UNKNOWN'
  },
  {cellNumber: 'G21', error: 'Enter forenames using English letters instead of special characters not recognised'},
  {cellNumber: 'G22', error: 'Enter all forenames or given names in 35 characters or less'},
  {
    cellNumber: 'H23',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {
    cellNumber: 'H24',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {cellNumber: 'I26', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'I27', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'J29', error: 'Enter the place of birth in 35 characters or less'},
  {cellNumber: 'J30', error: 'Enter place of birth using English letters instead of special characters not recognised'},
  {cellNumber: 'K32', error: 'Enter the nationality as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'K33', error: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'L35', error: 'Enter the travel document expiry date in the dd/mm/yyyy format, for example, 12/02/2022'},
]

const dobError = [
  {cellNumber: 'I5', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'I6', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'I7', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'I8', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'I9', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
]

const genderError = [
  {
    cellNumber: 'H5',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {
    cellNumber: 'H6',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {
    cellNumber: 'H7',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {
    cellNumber: 'H8',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {
    cellNumber: 'H9',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {
    cellNumber: 'H10',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
  {
    cellNumber: 'H11',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
]

Then('I am shown error messages for {string}', (errorType) => {
  let errList = []
  switch (errorType) {
    case 'invalid characters':
      errList = invalidCharacters
      break;
    case 'missing values':
      errList = missingValues
      break;
    case  'max characters':
      errList = maxCharacters
      break;
    case 'mixed errors':
      errList = mixedErrors
      break;
    case 'invalid DOB':
      errList = dobError
      break;
    case 'invalid gender value':
      errList = genderError
      break;

  }
  cy.get('tbody > tr').each(($row) => {
    const cellNo = $row.find('td').eq(0).text().replace('Cell number', '');
    const err = $row.find('td').eq(1).text().replace('Error', '').trim();

    const getErrorForCell = errList.filter(item => item.cellNumber === cellNo.trim());
    if (getErrorForCell.length > 0) {
      expect(err).to.be.equal(getErrorForCell[0].error);
    }
  });
});

When('I click Re-upload file', () => {
  FileUploadPage.clickReUploadFile();
});
