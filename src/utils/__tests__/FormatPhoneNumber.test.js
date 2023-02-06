import { FormatPhoneNumberForSubmission } from '../FormatPhoneNumber';

describe('Formatting phone numbers', () => {
  it('should return a correctly formatted phone number when there are no special characters', () => {
    const response = FormatPhoneNumberForSubmission({
      diallingCode: '44',
      telephoneNumber: '123',
    });
    expect(response).toBe('(44)123');
  });

  it('should return a correctly formatted phone number when there are special characters', () => {
    const response = FormatPhoneNumberForSubmission({
      diallingCode: '+(44)',
      telephoneNumber: '123-456.789 123+456',
    });
    expect(response).toBe('(44)123456789123456');
  });
});
