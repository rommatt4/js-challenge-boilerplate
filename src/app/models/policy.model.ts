export interface PolicyRecord {
  // Keep as string so leading zeroes are preserved.
  policyNumber: string;
  isValid: boolean;
}

export interface ApiSubmissionResponse {
  id: number;
}
