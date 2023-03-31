const ErrorMappingFal5 = {
  A: { // travel document type
    order: 'a',
    'field required': 'Enter P, I or O, or you may enter the full word: P - Passport, I - ID card - for a national ID card or O - Other - for any other document',
    'travel document type must be 8 characters or less': 'Enter travel document as P, I, O or as Passport, ID card, Other',
    'Enter travel document as P, I, O or as Passport, ID card, Other': 'Enter travel document as P, I, O or as Passport, ID card, Other',
  },
  B: { // other travel doument type
    order: 'b',
    "You entered 'Other' as the travel document type. You must enter the type of travel document, for example SID for Seafarer's Identity Document": "You entered 'Other' as the travel document type. You must enter the type of travel document, for example SID for Seafarer's Identity Document",
    'travel document nature must be 35 characters or less': 'Enter the type of travel document in 35 characters or less',
  },
  C: { // travel document issuing country
    order: 'c',
    'field required': 'Enter the 3-letter ISO country code for the issuing country; for example, GBR, SWE, NLD',
    'ensure this value has at most 3 characters': 'Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD',
  },
  D: { // travel document number
    order: 'd',
    'field required': 'Enter the number of the travel document',
    'Number of the travel document must be only numbers': 'Enter the number of the travel document using only numbers',
    'travel document number must be 35 characters or less': 'Enter the number of the travel document in 35 characters or less',
  },
  E: { // rank or rating
    order: 'e',
    'field required': 'Enter the rank, rating or job title; for supernumeraries just put SN or supernumerary, not the job title',
    'ensure this value has at most 35 characters': 'Enter the rank, rating or job title in 35 characters or less',
    'Enter the rank or rating using English letters instead of special characters not recognised': 'Enter the rank, rating or job title using English letters instead of special characters not recognised',
  },
  F: { // surname
    order: 'f',
    'field required': 'Enter family name or surname as it appears in the travel document',
    'surname must be 35 characters or less': 'Enter family name or surname in 35 characters or less',
    'Enter the surname using English letters instead of special characters not recognised': 'Enter family name or surname using English letters instead of special characters not recognised',
  },
  G: { // forenames
    order: 'g',
    'field required': 'Enter all forenames or given names as they appear in the travel document - if the crew member has no forename recorded enter UNKNOWN',
    'forenames must be 35 characters or less': 'Enter all forenames or given names in 35 characters or less',
    'Enter the forenames using English letters instead of special characters not recognised': 'Enter forenames using English letters instead of special characters not recognised',
  },
  H: { // gender
    order: 'h',
    'field required': 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
    'ensure this value has at most 6 characters': 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
    'Enter M for male, F for female, or X for gender neutral if this is in the Travel Document': 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
  },
  I: { // date of birth
    order: 'i',
    'Date must be in the dd/mm/yyyy format, for example, 22/02/2002': 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022',
  },
  J: { // place of birth
    order: 'j',
    'place of birth must be 35 characters or less': 'Enter the place of birth in 35 characters or less',
    'Enter the place of birth using English letters instead of special characters not recognised': 'Enter place of birth using English letters instead of special characters not recognised',
  },
  K: { // nationality
    order: 'k',
    'ensure this value has at most 3 characters': 'Enter the nationality as a 3-letter ISO country code; for example, GBR, SWE, NLD',
  },
  L: { // travel document expiry
    order: 'l',
    'Date must be in the dd/mm/yyyy format, for example, 22/02/2002': 'Enter the travel document expiry date in the dd/mm/yyyy format, for example, 12/02/2022',
  },
};

export default ErrorMappingFal5;
