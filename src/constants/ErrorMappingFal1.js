const ErrorMappingFal1 = {
  B2: {
    order: 'a',
    'none is not an allowed value': "You must select either 'arrival in the UK' or 'departure from the UK'",
  },
  B3: { // name of ship
    order: 'b',
    'none is not an allowed value': 'You must enter the name of the ship',
    'ensure this value has at most 35 characters': 'Enter the name of the ship using 35 characters or less',
    'Enter the value using English letters instead of special characters not recognised': 'Enter the ship\'s name using English letters instead of special characters not recognised',
  },
  D3: { // IMO number
    order: 'c',
    'none is not an allowed value': 'Enter the IMO number',
    'Enter 7 numbers for the IMO number': 'Enter 7 numbers for the IMO number',
  },
  F3: { // callsign
    order: 'd',
    'none is not an allowed value': 'Enter the call sign',
    'ensure this value has at most 35 characters': 'Enter the call sign using 35 characters or less',
    'Enter the call sign using only letters and numbers': 'Enter the call sign using only letters and numbers',
  },
  B4: { // signatory / master o ship
    order: 'e',
    'none is not an allowed value': 'Enter the name of master or authorised officer on board',
    'ensure this value has at most 35 characters': 'Enter the name of the master using 35 characters or less',
    'Enter the value using English letters instead of special characters not recognised': 'Enter the name of the master using English letters instead of special characters not recognised',
  },
  D4: { // flagstate
    order: 'f',
    'none is not an allowed value': 'Enter the 3-letter code for the flag state or the country where the vessel is usually based',
    'Enter the code for the country using 3 letters as given in the ISO list of 3166-1 alpha 3 codes': 'Enter the code for the country using 3 letters as given in the ISO list of 3166-1 alpha 3 codes ',
  },
  B5: { // arrival port
    order: 'g',
    'none is not an allowed value': 'Enter a LOCODE for the arrival port',
    'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX': 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX',
    'You selected arrival in the UK. Enter an arrival LOCODE that starts with GB': 'You selected arrival in the UK. Enter an arrival LOCODE that starts with GB',
    'You selected departure in the UK. Enter an arrival LOCODE for the next port of call and not a GB port': 'You selected departure from the UK. Enter an arrival LOCODE for the next port of call and not a GB port',
  },
  D5: {
    order: 'h',
    'none is not an allowed value': 'Enter a date of arrival',
  },
  F5: {
    order: 'i',
    'none is not an allowed value': 'Enter an arrival time',
  },
  B6: { // departure port
    order: 'j',
    'none is not an allowed value': 'Enter a LOCODE for the departure port',
    'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX': 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX',
    'You selected arrival in the UK. Enter a departure LOCODE for the last port of call and not a GB port': 'You selected arrival in the UK. Enter a departure LOCODE for the last port of call and not a GB port',
    'You selected departure from the UK. Enter an departure LOCODE that starts with GB': 'You selected departure from the UK. Enter a departure LOCODE that starts with GB',
  },
  D6: {
    order: 'k',
    'none is not an allowed value': 'Enter a date of departure',
  },
  F6: {
    order: 'l',
    'none is not an allowed value': 'Enter a departure time',
  },
  D7: { // previous port
    order: 'm',
    'none is not an allowed value': 'Enter a last port of call LOCODE',
    'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX': 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX',
    'Enter a last port of call that matches the last port of call you gave in cell B6': 'Enter a last port of call that matches the last port of call you gave in cell B6',
    'Enter a LOCODE that does not start with GB for the last port of call': 'Enter a LOCODE that does not start with GB for the last port of call',
  },
  F7: { // next port
    order: 'n',
    'none is not an allowed value': 'Enter a next port of call LOCODE',
    'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX': 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX',
    'Enter a LOCODE that does not start with GB for the last port of call': 'Enter a LOCODE that does not start with GB for the next port of call', // API returns incorrect reference to 'last port' here, it should be 'next port'
    'Enter a last port of call that matches the last port of call you gave in cell B5': 'Enter a next port of call that matches the next port of call you gave in cell B5',
  },
  B13: { // cargo
    order: 'o',
    'none is not an allowed value': "Enter a brief description of the cargo, or put 'No cargo'",
    'ensure this value has at most 35 characters': 'Enter the cargo details using 35 characters or less',
    'Enter the value using English letters instead of special characters not recognised': 'Enter the description using English letters instead of special characters not recognised',
  },
};

export default ErrorMappingFal1;
