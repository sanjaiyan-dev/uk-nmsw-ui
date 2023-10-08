import {Then, When} from "@badeball/cypress-cucumber-preprocessor";
import FileUploadPage from "../../e2e/pages/file-upload.page";

const invalidCharacters = [
  {cellNumber: 'A5', error: 'Travel document type: Enter travel document as P, I, O or as Passport, ID card, Other'},
  {
    cellNumber: 'C5',
    error: 'Travel document country: Travel document country should be a 3-letter ISO country code; for example, GBR, SWE, NLD'
  },
  {
    cellNumber: 'C6',
    error: 'Travel document country: Travel document country should be a 3-letter ISO country code; for example, GBR, SWE, NLD'
  },
  {
    cellNumber: 'E5',
    error: `Rank or rating: Enter the rank or rating using only English letters, numbers or spaces. The following found characters are not allowed: '!'`
  },
  /*{
    cellNumber: 'F5',
    error: `Surname: Enter the surname using only English letters, numbers or spaces. The following found characters are not allowed:  ''','('`
  },*/
  {
    cellNumber: 'F6',
    error: `Surname: value must contain at least one English letter or number`
  },
  {
    cellNumber: 'G5',
    error: `Forenames: Enter the forenames using only English letters, numbers or spaces. The following found characters are not allowed: '?'`
  },
  {
    cellNumber: 'H5',
    error: 'Gender: Enter M for male, F for female, or X for gender neutral if this is in the Travel Document'
  },
  {cellNumber: 'I5', error: 'Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {
    cellNumber: 'J5',
    error: `Place of birth: Enter the place of birth using only English letters, numbers or spaces. The following found characters are not allowed: '*'`
  },
  {
    cellNumber: 'K5',
    error: 'Nationality: Nationality should be a 3-letter ISO country code; for example, GBR, SWE, NLD'
  },
  {
    cellNumber: 'L5',
    error: 'Travel document expiry date: travel document expiry date must be in the dd/mm/yyyy format, for example, 22/02/2002'
  },
  {
    cellNumber: 'E6',
    error: 'Rank or rating: value must contain at least one English letter or number'
  },
  {cellNumber: 'G6', error: 'Forenames: value must contain at least one English letter or number'},

]

const missingValues = [
  {
    cellNumber: 'A6',
    error: 'Travel document type: field required'
  },
  {cellNumber: 'C5', error: 'Travel document country: field required'},
  {cellNumber: 'D5', error: 'Travel document number: field required'},
  {
    cellNumber: 'E5',
    error: 'Rank or rating: field required'
  },
  {cellNumber: 'F5', error: 'Surname: field required'},
  {
    cellNumber: 'F6',
    error: `Surname: Enter the surname using only English letters, numbers or spaces. The following found characters are not allowed: '-'`
  },
  {
    cellNumber: 'G5',
    error: 'Forenames: field required'
  },
  {
    cellNumber: 'H5', error: 'Gender: field required'
  },
  {cellNumber: 'I5',error: 'Date of birth: field required'},
  {cellNumber: 'I6',error: 'Date of birth: field required'},
]

const maxCharacters = [
  {
    cellNumber: 'C5',
    error: 'Travel document country: Travel document country should be a 3-letter ISO country code; for example, GBR, SWE, NLD'
  },
  {cellNumber: 'D5', error: 'Travel document number: ensure this value has at most 35 characters'},
  {cellNumber: 'E5', error: 'Rank or rating: ensure this value has at most 35 characters'},
  {cellNumber: 'F5', error: 'Surname: ensure this value has at most 35 characters'},
  {cellNumber: 'G5', error: 'Forenames: ensure this value has at most 35 characters'},
  {cellNumber: 'J5', error: 'Place of birth: ensure this value has at most 35 characters'},
  {
    cellNumber: 'K5',
    error: 'Nationality: Nationality should be a 3-letter ISO country code; for example, GBR, SWE, NLD'
  },
]

const mixedErrors = [
  {
    cellNumber: 'A5',
    error: 'Travel document type: field required'
  },
  {cellNumber: 'A6', error: 'Travel document type: Enter travel document as P, I, O or as Passport, ID card, Other'},
  {
    cellNumber: 'B7',
    error: `Travel document nature: You entered 'Other' as the travel document type, so you must enter the nature of the travel document here, for example 'SID' for Seafarer's Identity Document`
  },
  {cellNumber: 'C8', error: 'Travel document country: field required'},
  {
    cellNumber: 'C9',
    error: 'Travel document country: Travel document country should be a 3-letter ISO country code; for example, GBR, SWE, NLD'
  },
  {cellNumber: 'D11', error: 'Travel document number: field required'},
  {cellNumber: 'D13', error: 'Travel document number: ensure this value has at most 35 characters'},
  {
    cellNumber: 'E14',
    error: 'Rank or rating: field required'
  },
  {cellNumber: 'E15', error: 'Rank or rating: ensure this value has at most 35 characters'},
  {
    cellNumber: 'E16',
    error: `Rank or rating: Enter the rank or rating using only English letters, numbers or spaces. The following found characters are not allowed: '!'`
  },
  {cellNumber: 'F17', error: 'Surname: field required'},
  {
    cellNumber: 'F18',
    error: `Surname: Enter the surname using only English letters, numbers or spaces. The following found characters are not allowed: '!'`
  },
  {cellNumber: 'F19', error: 'Surname: ensure this value has at most 35 characters'},
  {
    cellNumber: 'G20',
    error: 'Forenames: field required'
  },
  {
    cellNumber: 'G21',
    error: `Forenames: Enter the forenames using only English letters, numbers or spaces. The following found characters are not allowed: '!'`
  },
  {cellNumber: 'G22', error: 'Forenames: ensure this value has at most 35 characters'},
  {
    cellNumber: 'H23',
    error: 'Gender: field required'
  },
  {
    cellNumber: 'H24',
    error: 'Gender: Enter M for male, F for female, or X for gender neutral if this is in the Travel Document'
  },
  {cellNumber: 'I26', error: 'Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'I27', error: 'Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'J29', error: 'Place of birth: ensure this value has at most 35 characters'},
  {
    cellNumber: 'J30',
    error: `Place of birth: Enter the place of birth using only English letters, numbers or spaces. The following found characters are not allowed: '!'`
  },
  {
    cellNumber: 'K32',
    error: 'Nationality: Nationality should be a 3-letter ISO country code; for example, GBR, SWE, NLD'
  },
  {
    cellNumber: 'K33',
    error: 'Nationality: Nationality should be a 3-letter ISO country code; for example, GBR, SWE, NLD'
  },
  {
    cellNumber: 'L35',
    error: 'Travel document expiry date: travel document expiry date must be in the dd/mm/yyyy format, for example, 22/02/2002'
  },
]

const dobError = [
  {cellNumber: 'I5', error: 'Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'I6', error: 'Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'I7', error: 'Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'I8', error: 'Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'I9', error: 'Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'I10',error: 'Date of birth: field required'}
]

const genderError = [
  {
    cellNumber: 'H5',
    error: 'Gender: field required'
  },
  {
    cellNumber: 'H6',
    error: 'Gender: Enter M for male, F for female, or X for gender neutral if this is in the Travel Document'
  },
  {
    cellNumber: 'H7',
    error: 'Gender: Enter M for male, F for female, or X for gender neutral if this is in the Travel Document'
  },
  {
    cellNumber: 'H8',
    error: 'Gender: Enter M for male, F for female, or X for gender neutral if this is in the Travel Document'
  },
  {
    cellNumber: 'H9',
    error: 'Gender: ensure this value has at most 6 characters'
  },
  {
    cellNumber: 'H11',
    error: 'Gender: Enter M for male, F for female, or X for gender neutral if this is in the Travel Document'
  },
]

const fileMismatchError =[
  {
    cellNumber: 'message',
    error: `This file does not contain a worksheet tab named \'FAL 5\'. Please check you are using the latest version of the FAL 5 template.`
  }
]
const duplicationError =[
  {
    cellNumber: 'duplication',
    error: `Duplicated travel document information found in the following rows: 7, 8`
  }
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
    case 'fileNotMatched':
      errList = fileMismatchError
      break;
    case 'duplication':
      errList = duplicationError
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
