import { Then } from '@badeball/cypress-cucumber-preprocessor';
import FileUploadPage from '../../e2e/pages/file-upload.page';

const invalidCharacters = [{
  cellNumber: 'A5', error: `Travel document type: Enter travel document as P, I, O or as Passport, ID card, Other`
}, {
  cellNumber: 'C5', error: `Travel document country: Travel document country should be a 3-letter ISO country code; for example, GBR, SWE, NLD`
}, {
  cellNumber: 'D5', error: `Travel document number: Enter the travel document number using only English letters, numbers or spaces. The following found characters are not allowed: '!'`
}, {
  cellNumber: 'E5', error: `Surname: Enter the surname using only English letters, numbers or spaces. The following found characters are not allowed: '*'`
},{
  cellNumber: 'E6', error: `Surname: value must contain at least one English letter or number`
},{
  cellNumber: 'F6', error: `Forenames: value must contain at least one English letter or number`
},
  {
  cellNumber: 'G5', error: `Gender: Enter M for male, F for female, or X for gender neutral if this is in the Travel Document`
}, {
  cellNumber: 'I5', error: `Place of birth: Enter the place of birth using only English letters, numbers or spaces. The following found characters are not allowed: '~'`
}, {
  cellNumber: 'J5', error: `Nationality: Nationality should be a 3-letter ISO country code; for example, GBR, SWE, NLD`
}, {
  cellNumber: 'L5', error: `Cabin: Enter the cabin using only English letters, numbers or spaces. The following found characters are not allowed: '?'`
},
//   {
//   cellNumber: 'M5', error: `Port of embarkation: Enter the port of embarkation using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '{','}'`
// },
//   {
//   cellNumber: 'N5', error: `Port of disembarkation: Enter the port of disembarkation using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '|'`
// },
  {
  cellNumber: 'O5', error: `Transit: Enter Yes or Y if this passenger is in transit and No or N if this passenger is disembarking or embarking in the UK`
},];

const invalidDates = [{
  cellNumber: 'H5', error: `Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002`
}, {
  cellNumber: 'K5', error: `Travel document expiry date: travel document expiry date must be in the dd/mm/yyyy format, for example, 22/02/2002`
},];

const maxCharacters = [{
  cellNumber: 'C5', error: `Travel document country: Travel document country should be a 3-letter ISO country code; for example, GBR, SWE, NLD`
}, {
  cellNumber: 'D5', error: `Travel document number: ensure this value has at most 35 characters`
}, {
  cellNumber: 'E5', error: `Surname: ensure this value has at most 35 characters`
}, {
  cellNumber: 'F5', error: `Forenames: ensure this value has at most 35 characters`
}, {
  cellNumber: 'G5', error: `Gender: ensure this value has at most 6 characters`
}, {
  cellNumber: 'H5', error: `Date of birth: date of birth must be in the dd/mm/yyyy format, for example, 22/02/2002`
}, {
  cellNumber: 'I5', error: `Place of birth: ensure this value has at most 35 characters`
}, {
  cellNumber: 'J5', error: `Nationality: Nationality should be a 3-letter ISO country code; for example, GBR, SWE, NLD`
}, {
  cellNumber: 'L5', error: `Cabin: ensure this value has at most 35 characters`
}, {
  cellNumber: 'M5', error: `Port of embarkation: ensure this value has at most 35 characters`
}, {
  cellNumber: 'N5', error: `Port of disembarkation: ensure this value has at most 35 characters`
},];

const missingOtherDocument = [{
  cellNumber: 'B5', error: `Travel document nature: You entered 'Other' as the travel document type, so you must enter the nature of the travel document here, for example 'SID' for Seafarer's Identity Document`
},];

const missingValues = [
  {cellNumber: 'C5', error: 'Travel document country: field required'},
  {cellNumber: 'D5', error: 'Travel document number: field required'},
  {cellNumber: 'E5', error: 'Surname: field required'},
  {cellNumber: 'F5', error: 'Forenames: field required'},
  {cellNumber: 'G5', error: 'Gender: field required'},
  {cellNumber: 'H5',error: 'Date of birth: field required'},
  {cellNumber: 'M5',error: 'Port of embarkation: field required'},
  {cellNumber: 'N5',error: 'Port of disembarkation: field required'},
  {cellNumber: 'O5',error: 'Transit: field required'},
  {cellNumber: 'A7',error: 'Travel document type: field required'},
]

const fileMismatchError =[
  {
    cellNumber: 'message',
    error: `This file does not contain a worksheet tab named 'FAL 6'. Please check you are using the latest version of the FAL 6 template.`
  }
]

Then('I am shown error messages to fix for {string}', (errorType) => {
  let errList = [];
  switch (errorType) {
  case 'invalid Characters':
    errList = invalidCharacters;
    break;
  case 'invalid Dates':
    errList = invalidDates;
    break;
  case 'max Characters':
    errList = maxCharacters;
    break;
  case 'missing Other Document':
    errList = missingOtherDocument;
    break;
  case 'missing values':
      errList = missingValues;
    break;
  case 'fileNotMatched':
      errList = fileMismatchError
    break;
  }
  cy.get('tbody > tr')
    .each(($row) => {
      const cellNo = $row.find('td')
        .eq(0)
        .text()
        .replace('Cell number', '');
      const err = $row.find('td')
        .eq(1)
        .text()
        .replace('Error', '')
        .trim();

      const getErrorForCell = errList.filter(item => item.cellNumber === cellNo.trim());
      if (getErrorForCell.length > 0) {
        expect(err)
          .to
          .be
          .equal(getErrorForCell[0].error);
      }
    });
});

Then('I am shown error message for duplicate records for {string}', (fileName) =>{
if(fileName ==='FAL 5') {
  FileUploadPage.checkDuplicationRecord(7,8)
}else
  FileUploadPage.checkDuplicationRecord(10,11);
});
