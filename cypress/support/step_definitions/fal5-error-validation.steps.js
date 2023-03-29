import {Then} from "@badeball/cypress-cucumber-preprocessor";

const errorWithNullValues = [
  {
    cellNumber: 'A5',
    error: `Enter P, I or O, or you may enter the full word: P - Passport, I - ID card - for a national ID card or O - Other - for any other document`
  },
  {cellNumber: 'C5', error: 'Enter the 3-letter ISO country code for the issuing country; for example, GBR, SWE, NLD'},
  {cellNumber: 'D5', error: 'Enter the number of the travel document'},
  {
    cellNumber: 'E5',
    error: 'Enter the rank, rating or job title; for supernumeraries just put SN or supernumerary, not the job title'
  },
  {cellNumber: 'F5', error: 'Enter family name or surname as it appears in the travel document'},
  {
    cellNumber: 'G5',
    error: 'Enter all forenames or given names as they appear in the travel document - if the crew member has no forename recorded enter UNKNOWN'
  },
  {
    cellNumber: 'H5',
    error: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document'
  },
]

const dobError = [
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
  {cellNumber: 'I6', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'I7', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
  {cellNumber: 'I8', error: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022'},
]

const familyNameOver35 = [
  {cellNumber: 'F5', error: 'Enter family name or surname in 35 characters or less'},
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
]

const givenNameInvaildCharacters = [
  {cellNumber: 'G5', error: 'Enter forenames using English letters instead of special characters not recognised'},
]

const givenNameOver35 = [
  {cellNumber: 'G5', error: 'Enter all forenames or given names in 35 characters or less'},
]

const invalidTravelDocNumber = [
  {cellNumber: 'D5', error: 'Enter the number of the travel document in 35 characters or less'},
]

const invalidValueTravelDoc = [
  {cellNumber: 'A5', error: 'Enter travel document as P, I, O or as Passport, ID card, Other'},
]

const noGivenName = [
  {
    cellNumber: 'G5',
    error: 'Enter all forenames or given names as they appear in the travel document - if the crew member has no forename recorded enter UNKNOWN'
  },
]

const noIssuingCountry = [
  {cellNumber: 'C5', error: `Enter the 3-letter ISO country code for the issuing country; for example, GBR, SWE, NLD`},
]

const noRankRating = [
  {
    cellNumber: 'E5',
    error: 'Enter the rank, rating or job title; for supernumeraries just put SN or supernumerary, not the job title'
  },
]

const noTravelDocNumber = [
  {cellNumber: 'D5', error: 'Enter the number of the travel document'},
]

const noValueForO = [
  {cellNumber: 'C5', error: 'Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD'},
]

const rankRatingOver35 = [
  {cellNumber: 'E5', error: `Enter the rank, rating or job title in 35 characters or less`},
]

const travelDocMissing = [
  {
    cellNumber: 'A5',
    error: `Enter P, I or O, or you may enter the full word: P - Passport, I - ID card - for a national ID card or O - Other - for any other document`
  },
]

const threeLetterIssuingCountry = [
  {cellNumber: 'C5', error: `Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD`},
]

Then('I am shown error messages for {string}', (errorType) => {
  let errList = []
  switch (errorType) {
    case 'null values':
      errList = errorWithNullValues
      break;
    case 'invalid DOB':
      errList = dobError
      break;
    case 'fName above 35':
      errList = familyNameOver35
      break;
    case 'invalid gender value':
      errList = genderError
      break;
    case 'invalid name characters':
      errList = givenNameInvaildCharacters
      break;
    case 'givenName over 35':
      errList = givenNameOver35
      break;
    case 'invalid travel docNo':
      errList = invalidTravelDocNumber
      break;
    case 'invalid travel documents':
      errList = invalidValueTravelDoc
      break;
    case 'no given name':
      errList = noGivenName
      break;
    case 'no issuing country':
      errList = noIssuingCountry
      break;
    case 'no rank rating':
      errList = noRankRating
      break;
    case 'no travel docNo':
      errList = noTravelDocNumber
      break;
    case 'no value for O':
      errList = noValueForO
      break;
    case 'rank over 35':
      errList = rankRatingOver35
      break;
    case 'noTravel doc details':
      errList = travelDocMissing
      break;
    case 'no3 Letter Country':
      errList = threeLetterIssuingCountry
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
