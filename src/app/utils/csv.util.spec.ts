import { isCsvFile, isWithinMaxFileSize, parsePolicyNumbersFromCsv } from './csv.util';

describe('csv util', () => {
  it('accepts csv mime type', () => {
    const file = new File(['a,b'], 'policies.csv', { type: 'text/csv' });
    expect(isCsvFile(file)).toBeTrue();
  });

  it('accepts csv extension when mime type is empty', () => {
    const file = new File(['a,b'], 'policies.csv', { type: '' });
    expect(isCsvFile(file)).toBeTrue();
  });

  it('rejects non-csv file', () => {
    const file = new File(['{}'], 'policies.json', { type: 'application/json' });
    expect(isCsvFile(file)).toBeFalse();
  });

  it('enforces 2mb size limit', () => {
    const withinLimit = new File([new Uint8Array(2 * 1024 * 1024)], 'policies.csv', {
      type: 'text/csv'
    });
    const aboveLimit = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'policies.csv', {
      type: 'text/csv'
    });

    expect(isWithinMaxFileSize(withinLimit)).toBeTrue();
    expect(isWithinMaxFileSize(aboveLimit)).toBeFalse();
  });

  it('parses only digit policy tokens from csv content', () => {
    const csv = '345882865,664371495\nhello,457508000\n';
    expect(parsePolicyNumbersFromCsv(csv)).toEqual(['345882865', '664371495', '457508000']);
  });
});
