import {Then} from "@badeball/cypress-cucumber-preprocessor";

const invalidCharacters = [
  {cellNumber: 'A5', error: 'Enter travel document as P, I, O or as Passport, ID card, Other'},
  {cellNumber: 'C5', error: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'D5', error: 'Number of the travel document must be only numbers'},
  {cellNumber: 'E5', error: 'Enter the surname using English letters instead of special characters not recognised'},
  {cellNumber: 'F5', error: 'Enter the forenames using English letters instead of special characters not recognised'},
  {
    cellNumber: 'G5',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the Travel Document'
  },
  {
    cellNumber: 'I5',
    error: 'Enter the place of birth using English letters instead of special characters not recognised'
  },
  {cellNumber: 'J5', error: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'L5', error: 'Enter the cabin using only letters and numbers'},
  {cellNumber: 'M5', error: 'Enter the port of embarkation using only letters and numbers'},
  {cellNumber: 'N5', error: 'Enter the port of disembarkation using only letters and numbers'},
  {
    cellNumber: 'O5',
    error: 'Enter Yes or Y if this passenger is in transit and No or N if this passenger is disembarking or embarking in the UK'
  },
]

const invalidDates = [
  {cellNumber: 'H5', error: 'Date must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'K5', error: 'Date must be in the dd/mm/yyyy format, for example, 22/02/2002'},
]

const maxCharacters = [
  {cellNumber: 'C5', error: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'D5', error: 'travel document number must be 35 characters or less'},
  {cellNumber: 'E5', error: 'surname must be 35 characters or less'},
  {cellNumber: 'F5', error: 'forenames must be 35 characters or less'},
  {cellNumber: 'G5', error: 'ensure this value has at most 6 characters'},
  {cellNumber: 'H5', error: 'Date must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {cellNumber: 'I5', error: 'place of birth must be 35 characters or less'},
  {cellNumber: 'J5', error: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
  {cellNumber: 'L5', error: 'cabin must be 35 characters or less'},
  {cellNumber: 'M5', error: 'port of embarkation must be 35 characters or less'},
  {cellNumber: 'N5', error: 'port of disembarkation must be 35 characters or less'},
]

const missingOtherDocument = [
  {
    cellNumber: 'B5',
    error: `You entered 'Other' as the travel document type. You must enter the type of travel document, for example SID for Seafarer's Identity Document`
  },
]

Then('I am shown error messages to fix for {string}', (errorType) => {
  let errList = []
  switch (errorType) {
    case 'invalid Characters':
      errList = invalidCharacters
      break;
    case 'invalid Dates':
      errList = invalidDates
      break;
    case 'max Characters':
      errList = maxCharacters
      break;
    case 'missing Other Document':
      errList = missingOtherDocument
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
