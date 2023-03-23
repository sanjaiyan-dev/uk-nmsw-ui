import FileUploadPage from "../../e2e/pages/file-upload.page";
import {Then, When} from "@badeball/cypress-cucumber-preprocessor";

const errorWithNullValues = [
  {cellNumber: 'B2', error: `You must select either 'arrival in the UK' or 'departure from the UK'`},
  {cellNumber: 'B3', error: 'You must enter the name of the ship'},
  {cellNumber: 'D3', error: 'Enter the IMO number'},
  {cellNumber: 'F3', error: 'Enter the call sign'},
  {cellNumber: 'B4', error: 'Enter the name of master or authorised officer on board'},
  {
    cellNumber: 'D4',
    error: 'Enter the 3-letter code for the flag state or the country where the vessel is usually based'
  },
  {cellNumber: 'B5', error: 'Enter a LOCODE for the arrival port'},
  {cellNumber: 'D5', error: 'Enter a date of arrival'},
  {cellNumber: 'F5', error: 'Enter an arrival time'},
  {cellNumber: 'B6', error: 'Enter a LOCODE for the departure port'},
  {cellNumber: 'D6', error: 'Enter a date of departure'},
  {cellNumber: 'F6', error: 'Enter a departure time'},
  {cellNumber: 'D7', error: 'Enter a last port of call LOCODE'},
  {cellNumber: 'F7', error: 'Enter a next port of call LOCODE'},
  {cellNumber: 'B13', error: 'Enter a brief description of the cargo, or put \'No cargo\''},
]

const errorMaxCharacters = [
  {cellNumber: 'B3', error: 'Enter the name of the ship using 35 characters or less'},
  {cellNumber: 'F3', error: 'Enter the call sign using 35 characters or less'},
  {cellNumber: 'B4', error: 'Enter the name of the master using 35 characters or less'},
  {
    cellNumber: 'D4',
    error: 'Enter the code for the country using 3 letters as given in the ISO list of 3166-1 alpha 3 codes'
  },
  {cellNumber: 'B13', error: 'Enter the cargo details using 35 characters or less'},
  {
    cellNumber: '', error: 'Enter a departure date from the UK that is not more than 24 hours in the future'
  },
]

const errorInvalidCharacters = [
  {cellNumber: 'B3', error: `Enter the ship's name using English letters instead of special characters not recognised`},
  {cellNumber: 'F3', error: 'Enter the call sign using only letters and numbers'},
  {
    cellNumber: 'B4',
    error: 'Enter the name of the master using English letters instead of special characters not recognised'
  },
  {
    cellNumber: 'B13',
    error: 'Enter the description using English letters instead of special characters not recognised'
  },
]

const errorBadImoLocode = [
  {cellNumber: 'D3', error: 'Enter 7 numbers for the IMO number'},
  {
    cellNumber: 'B5',
    error: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX'
  },
  {
    cellNumber: 'B6',
    error: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX'
  },
  {
    cellNumber: 'D7',
    error: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX'
  },
  {
    cellNumber: 'F7',
    error: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX'
  },
  {cellNumber: '', error: 'Enter a departure date from the UK that is not more than 24 hours in the future'},
]

const errorInvalidArrivalFields = [
  {cellNumber: 'B5', error: 'You selected arrival in the UK. Enter an arrival LOCODE that starts with GB'},
  {
    cellNumber: 'B6',
    error: 'You selected arrival in the UK. Enter a departure LOCODE for the last port of call and not a GB port'
  },
  {
    cellNumber: 'D7',
    error: 'Enter a last port of call that matches the last port of call you gave in cell B6'
  },
  {
    cellNumber: 'F7',
    error: 'Enter a LOCODE that does not start with GB for the next port of call'
  },
  {
    cellNumber: '',
    error: 'You selected arrival in the UK. Enter an arrival date and time that is after the departure from the previous port'
  },
]

const errorInvalidDepartureFields = [
  {
    cellNumber: 'B5',
    error: 'You selected departure from the UK. Enter an arrival LOCODE for the next port of call and not a GB port'
  },
  {
    cellNumber: 'B6',
    error: 'You selected departure from the UK. Enter a departure LOCODE that starts with GB'
  },
  {
    cellNumber: 'D7',
    error: 'Enter a LOCODE that does not start with GB for the last port of call'
  },
  {
    cellNumber: 'F7',
    error: 'Enter a next port of call that matches the next port of call you gave in cell B5'
  },
  {
    cellNumber: '',
    error: 'You selected departure from the UK. Enter a departure date and time that is before the arrival at the next port'
  }
]

const errorDepartureDateInFuture = [
  {
    cellNumber: '',
    error: 'Enter a departure date from the UK that is not more than 24 hours in the future'
  },
]
const errorImoInvalidCharacters = [
  {cellNumber: 'D3', error: 'Enter 7 numbers for the IMO number'},
]

const errorImoTooShort = [
  {cellNumber: 'D3', error: 'Enter 7 numbers for the IMO number'},
]

Then('I am taken to Errors found page for {string}', (fileName) => {
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
    case 'invalid arrival-fields':
      errList = errorInvalidArrivalFields
      break;
    case 'invalid departure-fields':
      errList = errorInvalidDepartureFields
      break;
    case 'departure-date in future':
      errList = errorDepartureDateInFuture
      break;
    case 'imo-Invalid characters':
      errList = errorImoInvalidCharacters
      break;
    case 'imo-too short':
      errList = errorImoTooShort
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

Then('I am shown error messages to  fix them for \'invalid-date-time format\'', () => {
  cy.get('.govuk-heading-xl').should('have.text', 'Upload failed');
  cy.get('#content .govuk-body').should('have.text', 'There are formatting errors in the excel file that we cannot identify. These errors may be incorrect date or time formats: you need to use dd/mm/yyyy and HH:MM. You can re-upload the file when you have fixed these errors.');
});

Then('I can see re-upload file to upload the valid file', () => {
  FileUploadPage.clickReUploadFile();
});

When('there are no errors, I am shown the no errors found for {string}', (fileName) => {
  FileUploadPage.checkNoErrors();
  FileUploadPage.checkFileName(fileName);
});
