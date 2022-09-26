import findCookiePreference from '../findCookiePreference';

describe('find cookie preference', () => {
  it('should return null if cookiePreference does not exist', () => {
    const result = findCookiePreference('cookiePreference');

    expect(result).toBe(null);
  });

  it('should return true if cookiePreference equals true', () => {
    document.cookie = 'cookiePreference=true';

    const result = findCookiePreference('cookiePreference');
    expect(result).toBe(true);
  });

  it('should return false if cookiePreference equals false', () => {
    document.cookie = 'cookiePreference=false';

    const result = findCookiePreference('cookiePreference');
    expect(result).toBe(false);
  });
});
