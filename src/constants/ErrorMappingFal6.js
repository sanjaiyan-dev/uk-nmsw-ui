const ErrorMappingFal6 = {
  A: { // travel document type
    order: 'a',
    'field required': 'Enter P, I or O, or you may enter the full word: P - Passport, I - ID card - for a national ID card or O - Other - for any other document',
    'Enter travel document as P, I, O or as Passport, ID card, Other': 'Enter travel document as P, I, O or as Passport, ID card, Other',
  },
  B: { // other travel doument type
    order: 'b',
    "You entered 'Other' as the travel document type. You must enter the type of travel document, for example SID for Seafarer's Identity Document": "You entered 'Other' as the travel document type. You must enter the type of travel document, for example SID for Seafarer's Identity Document",
  },
  C: { // travel document issuing country
    order: 'c',
    'field required': 'Enter the 3-letter ISO country code for the issuing country; for example, GBR, SWE, NLD',
    'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD': 'Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD',
  },
  D: { // travel document number
    order: 'd',
    'field required': 'Enter the number of the travel document',
    'Number of the travel document must be only numbers': 'Enter the number of the travel document using only numbers',
    'travel document number must be 35 characters or less': 'Enter the number of the travel document in 35 characters or less',
  },
  E: { // surname
    order: 'e',
    'field required': 'Enter family name or surname as it appears in the travel document',
    'surname must be 35 characters or less': 'Enter family name or surname in 35 characters or less',
    'Enter the surname using English letters instead of special characters not recognised': 'Enter family name or surname using English letters instead of special characters not recognised',
  },
  F: { // forenames
    order: 'f',
    'field required': 'Enter all forenames or given names as they appear in the travel document - if the crew member has no forename recorded enter UNKNOWN',
    'forenames must be 35 characters or less': 'Enter all forenames or given names in 35 characters or less',
    'Enter the forenames using English letters instead of special characters not recognised': 'Enter forenames using English letters instead of special characters not recognised',
  },
  G: { // gender
    order: 'g',
    'field required': 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
    'ensure this value has at most 6 characters': 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
    'Enter M for male, F for female, or X for gender neutral if this is in the travel document': 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
  },
  H: { // date of birth
    order: 'h',
    'Date must be in the dd/mm/yyyy format, for example, 22/02/2002': 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022',
  },
  I: { // place of birth
    order: 'i',
    'place of birth must be 35 characters or less': 'Enter the place of birth in 35 characters or less',
    'Enter the place of birth using English letters instead of special characters not recognised': 'Enter place of birth using English letters instead of special characters not recognised',
  },
  J: { // nationality
    order: 'j',
    'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD': 'Enter the nationality as a 3-letter ISO country code; for example, GBR, SWE, NLD',
  },
  K: { // travel document expiry
    order: 'k',
    'Date must be in the dd/mm/yyyy format, for example, 22/02/2002': 'Enter the travel document expiry date in the dd/mm/yyyy format, for example, 12/02/2022',
  },
  L: { // cabin number
    order: 'l',
    'Enter the cabin using only letters and numbers': 'Enter the cabin number using letters and numbers only and omit any other characters',
    'cabin must be 35 characters or less': 'Enter the cabin number in 35 characters or less',
  },
  M: { // port of embarkation
    order: 'm',
    'field required': 'Enter the name of the port or the LOCODE for the port; for example, Southampton, GBSOU or GB SOU',
    'port of embarkation must be 35 characters or less': 'Enter the name of the port in 35 characters or less',
    'Enter the port of embarkation using only letters and numbers': 'Enter the name of the port using English letters instead of special characters not recognised',
  },
  N: { // port of disembarkation
    order: 'n',
    'field required': 'Enter the name of the port or the LOCODE for the port; for example, Southampton, GBSOU or GB SOU',
    'port of disembarkation must be 35 characters or less': 'Enter the name of the port in 35 characters or less',
    'Enter the port of disembarkation using only letters and numbers': 'Enter the name of the port using English letters instead of special characters not recognised',
  },
  O: { // transit
    order: 'o',
    'field required': 'Enter Yes or Y if this passenger is in transit and No or N if this passenger is disembarking or embarking in the UK',
    'Enter Yes or Y if this passenger is in transit and No or N if this passenger is disembarking or embarking in the UK': 'Enter Yes or Y if this passenger is in transit and No or N if this passenger is disembarking or embarking in the UK',
  },
};

export default ErrorMappingFal6;
