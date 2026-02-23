const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export function isCsvFile(file: File): boolean {
  // Some browsers leave MIME empty, so filename extension is fallback.
  const mimeType = file.type.toLowerCase();
  return mimeType === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
}

export function isWithinMaxFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE_BYTES;
}

export function parsePolicyNumbersFromCsv(content: string): string[] {
  // Split by rows/commas and keep numeric tokens only.
  return content
    .split(/\r?\n/)
    .flatMap((line) => line.split(','))
    .map((value) => value.trim())
    .filter((value) => /^\d+$/.test(value));
}
