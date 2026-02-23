import { getPolicyValidation, isValidPolicyNumber } from './checksum.util';

describe('checksum util', () => {
  it('returns true when checksum is valid', () => {
    expect(isValidPolicyNumber('345882865')).toBeTrue();
  });

  it('returns false when checksum is invalid', () => {
    expect(isValidPolicyNumber('664371495')).toBeFalse();
  });

  it('returns false when policy number is not 9 digits', () => {
    expect(isValidPolicyNumber('12345')).toBeFalse();
    expect(isValidPolicyNumber('1234567890')).toBeFalse();
    expect(isValidPolicyNumber('1234abcd9')).toBeFalse();
  });

  it('maps policy number to the expected object shape', () => {
    expect(getPolicyValidation('345882865')).toEqual({
      policyNumber: '345882865',
      isValid: true
    });
  });
});
