export const FormatPhoneNumberForSubmission = ({ diallingCode, telephoneNumber }) => {
/* International Dialing Code and Phone Number need to be merged into
     * a single number for the eventual PATCH to the endpoint to create
     * the user.
     * We let the user enter the number with +-.() and spaces as that's
     * common for phone numbers
     * And then here we the special characters and spacesout
     * Then we add () around the dialling code and concat with the telephone number
     * and add it to the raw data set to be passed on
     */

  const strippedDiallingCode = diallingCode.replace(/[()+-. ]/g, '');
  const strippedTelephoneNumber = telephoneNumber.replace(/[()+-. ]/g, '');
  const combinedPhoneNumber = `(${strippedDiallingCode})${strippedTelephoneNumber}`;

  return combinedPhoneNumber;
};

export const FormatPhoneNumberForDisplay = (phoneNumber) => {
  const diallingCode = phoneNumber.split('(').pop().split(')')[0];
  const telephoneNumber = phoneNumber.split(')')[1];

  return ({ diallingCode, telephoneNumber });
};
