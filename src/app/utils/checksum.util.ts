export function isValidPolicyNumber(policyNumber: string): boolean {
  // Guard bad inputs so checksum math only runs on 9 digits.
  if (!/^\d{9}$/.test(policyNumber)) {
    return false;
  }

  // Reverse digits so index math matches d1 on the right.
  const digits = policyNumber.split('').map(Number).reverse();
  const checksum = digits.reduce((sum, digit, index) => sum + digit * (index + 1), 0);

  return checksum % 11 === 0;
}

export function getPolicyValidation(policyNumber: string): { policyNumber: string; isValid: boolean } {
  // Keep API/UI object shape consistent in one place.
  return {
    policyNumber,
    isValid: isValidPolicyNumber(policyNumber)
  };
}
