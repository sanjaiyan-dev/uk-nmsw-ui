import FileUploadPage from "../../e2e/pages/file-upload.page";
import {Then, When} from "@badeball/cypress-cucumber-preprocessor";

const errorWithNullValues = [
  {cellNumber: 'B2', error: `You must select either 'arrival in the UK' or 'departure from the UK'`},
  {cellNumber: 'D3', error: 'Enter the IMO number'},
  {
    cellNumber: 'D4',
    error: 'Enter the 3-letter code for the flag state or the country where the vessel is usually based'
  },
  {
    cellNumber: 'B5',
    error: 'Enter a LOCODE for the arrival port'
  },
  {cellNumber: 'D5', error: 'Enter a date of arrival'},
  {
    cellNumber: 'F5',
    error: 'Enter an arrival time'
  },
  {
    cellNumber: 'B6',
    error: 'Enter a LOCODE for the departure port'
  },
  {cellNumber: 'D6', error: 'Enter a date of departure'},
  {
    cellNumber: 'F6',
    error: 'Enter a departure time'
  },
  {
    cellNumber: 'D7',
    error: 'Enter a last port of call LOCODE'
  },
  {
    cellNumber: 'F7',
    error: 'Enter a next port of call LOCODE'
  },
  {cellNumber: 'B3', error: 'You must enter the name of the ship'},
  {cellNumber: 'F3', error: 'Enter the call sign'},
  {cellNumber: 'B4', error: 'Enter the name of master or authorised officer on board'},
  {cellNumber: 'B13', error: `Enter a brief description of the cargo, or put \'No cargo\'`},
]

const errorMaxCharacters = [
  {cellNumber: 'B3', error: 'Name of ship must be 35 characters or less'},
  {cellNumber: 'F3', error: 'Call sign must be 35 characters or less'},
  {cellNumber: 'B4', error: 'Signatory must be 35 characters or less'},
  {
    cellNumber: 'D4',
    error: 'Flag state should indicate a country using 3 letters as given in the ISO list of 3166-1 alpha 3 codes'
  },
  {cellNumber: 'B13', error: 'Cargo must be 35 characters or less'},
]

const errorInvalidCharacters = [
  {
    cellNumber: 'B3',
    error: `Enter the name of ship using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '!'`
  },
  // {
  //   cellNumber: 'F3',
  //   error: `Enter the call sign using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '%'`
  // },
  {
    cellNumber: 'B4',
    error: `Enter the signatory using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '$'`
  },
  {
    cellNumber: 'B13',
    error: `Enter the cargo using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '&'`
  },
]

const errSamePort = [
  {
    cellNumber: '',
    error: `Arrival port and departure port cannot be the same LOCODE. You must report each leg of the voyage separately.`
  },
]

const errorBadImoLocode = [
  {cellNumber: 'D3', error: 'Imo number must be 15 characters or less'},
  {
    cellNumber: 'B5',
    error: 'Arrival port unlocode should be a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX'
  },
  {
    cellNumber: 'B6',
    error: 'Departure port unlocode should be a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX'
  },
  {
    cellNumber: 'D7',
    error: 'Previous port unlocode should be a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX'
  },
  {
    cellNumber: 'F7',
    error: 'Next port unlocode should be a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX'
  },
]

const errorImoWithHyphen =[
  {cellNumber: 'D3', error: `Enter the imo number using only English letters, numbers or spaces. The following found characters are not allowed: '-'`},
]

const errorInvalidArrivalFields = [
  {cellNumber: 'B5', error: 'You selected arrival in the UK. Enter an arrival LOCODE that starts with one of GB,GG,JE,IM'},
  {
    cellNumber: 'D7',
    error: 'Enter a last port of call that matches the last port of call you gave in cell B6'
  },
  {
    cellNumber: '',
    error: 'You selected arrival in the UK. Enter an arrival date and time that is after the departure from the previous port'
  },
]

const errorInvalidDepartureFields = [
  {
    cellNumber: 'B6',
    error: 'You selected departure from the UK. Enter a departure LOCODE that starts with one of GB,GG,JE,IM'
  },
  {
    cellNumber: 'F7',
    error: 'Enter a next port of call that matches the next port of call you gave in cell B5'
  },
  // {
  //   cellNumber: '',
  //   error: 'You selected departure from the UK. Enter a departure date and time that is before the arrival at the next port'
  // }
]

const errorDepartureDateInFuture = [
  {
    cellNumber: '',
    error: 'You selected departure from the UK. Enter a departure date and time that is before the arrival at the next port'
  },
]

const errBadDateTime = [
  {cellNumber: 'D5', error: 'arrival date must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {
    cellNumber: 'F5',
    error: 'arrival time must be in the HH:MM:SS or HH:MM:SS am/pm format, for example, 01:00:00 pm or 13:00:00'
  },
  {cellNumber: 'D6', error: 'departure date must be in the dd/mm/yyyy format, for example, 22/02/2002'},
  {
    cellNumber: 'F6',
    error: 'departure time must be in the HH:MM:SS or HH:MM:SS am/pm format, for example, 01:00:00 pm or 13:00:00'
  },
]

const errGBLocodeWithXXX =[
  {cellNumber: 'B5', error: `'GB XXX' is not an acceptable LOCODE`},
  {cellNumber: 'B6', error: `'GB XXX' is not an acceptable LOCODE`},
  {cellNumber: 'D7', error: `'GB XXX' is not an acceptable LOCODE`},
  {cellNumber: 'F7', error: `'GB XXX' is not an acceptable LOCODE`},
]

const  errSplCharactersNotAllowedNotDeleted = [
  // {cellNumber: 'B3', error: `Enter the name of ship using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '"','%','=','[','*','_',']','!','&','{','£','+','}','?'`},
  // {cellNumber: 'D3', error: `Enter the imo number using only English letters, numbers or spaces. The following found characters are not allowed: '.','}',':','[',']',')','?','\\',';','{',',','/','(','-'`},
  // {cellNumber: 'F3', error: `Enter the call sign using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '[',']','{','}','?'`},
  // {cellNumber: 'B4', error: `Enter the signatory using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '[',']','{','}','?'`},
  {cellNumber: 'D4', error: `Flag state should indicate a country using 3 letters as given in the ISO list of 3166-1 alpha 3 codes`},
  // {cellNumber: 'B13', error: `Enter the cargo using only English letters, numbers, or one of \` -()/\`. The following found characters are not allowed: '[',']','{','}','?'`},

]

const errBEDeletedSplCharactersAndRequireMandatoryValues = [
  {cellNumber: 'B3', error: `name_of_ship must contain at least one English letter or number`},
  // {cellNumber: 'D3', error: `Enter the imo number using only English letters, numbers or spaces. The following found characters are not allowed: ':','.',';',','`},
  {cellNumber: 'F3', error: `call_sign must contain at least one English letter or number`},
  {cellNumber: 'B4', error: `signatory must contain at least one English letter or number`},
  {cellNumber: 'D4', error: `Flag state should indicate a country using 3 letters as given in the ISO list of 3166-1 alpha 3 codes`},
  {cellNumber: 'B13', error: `cargo must contain at least one English letter or number`},

]

Then('I am taken to Errors found page for {string}', (fileName) => {
  cy.wait(1000);
  cy.url().should('include', 'field-errors');
  cy.contains('Errors found');
  cy.contains('Your file has errors. Check the file to fix any errors and re-upload your file.');
  cy.get('table > caption').should('include.text', 'errors found in ' + fileName);
});

Then('I am shown error messages to help me fix them for {string}', (errorType) => {
  let errList = []
  switch (errorType) {
    case 'null values':
      errList = errorWithNullValues
      break;
    case 'character limit':
      errList = errorMaxCharacters
      break;
    case 'invalid characters':
      errList = errorInvalidCharacters
      break;
    case 'bad Imo-Locode':
      errList = errorBadImoLocode
      break;
    case 'imo-with-hyphen':
      errList = errorImoWithHyphen
      break;
    case 'invalid arrival-fields':
      errList = errorInvalidArrivalFields
      break;
    case 'invalid departure-fields':
      errList = errorInvalidDepartureFields
      break;
    case 'departure-date in future':
      errList = errorDepartureDateInFuture
      break;
    case 'bad-dateTime':
      errList = errBadDateTime
      break;
    case 'unlocode-with-XXX':
      errList = errGBLocodeWithXXX
      break;
    case 'same-port-error':
      errList = errSamePort;
      break;
    case 'spl-characters-not-allowed-not-deleted':
      errList = errSplCharactersNotAllowedNotDeleted
      break;
    case 'BE-deleted-spl-characters-and-require-mandatory-values':
      errList = errBEDeletedSplCharactersAndRequireMandatoryValues;
      break;
  }

  cy.get('tbody > tr').each(($row) => {
    const cellNo = $row.find('td').eq(0).text().replace('Cell number', '');
    const err = $row.find('td').eq(1).text().replace('Error', '').trim();

    const getErrorForCell = errList.filter(item => item.cellNumber === cellNo.trim());
    if (getErrorForCell.length > 0) {
      expect(err).to.contain(getErrorForCell[0].error);
    }
  });
});

Then('I am shown error messages to  fix them for \'invalid-date-time format\'', () => {
  cy.get('.govuk-heading-xl').should('have.text', 'Upload failed');
  cy.get('#content .govuk-body').should('have.text', 'There are formatting errors in the excel file that we cannot identify. These errors may be incorrect date or time formats: you need to use dd/mm/yyyy and HH:MM. You can re-upload the file when you have fixed these errors.');
});

Then('I can click re-upload file to upload the valid file', () => {
  FileUploadPage.clickReUploadFile();
});

When('there are no errors, I am shown the no errors found for {string}', (fileName) => {
  FileUploadPage.checkNoErrors();
  FileUploadPage.checkFileName(fileName);
});
