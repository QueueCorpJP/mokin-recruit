import {
  getEmploymentTypeInEnglish,
  getEmploymentTypeInJapanese,
} from '../employmentType';

describe('employmentType utils', () => {
  it('maps English to Japanese correctly', () => {
    expect(getEmploymentTypeInJapanese('FULL_TIME')).toBe('正社員');
    expect(getEmploymentTypeInJapanese('PART_TIME')).toBe('パート・アルバイト');
    expect(getEmploymentTypeInJapanese('CONTRACT')).toBe('契約社員');
    expect(getEmploymentTypeInJapanese('INTERN')).toBe('インターン');
  });

  it('passes through unknown types for Japanese mapping', () => {
    expect(getEmploymentTypeInJapanese('FREELANCE')).toBe('FREELANCE');
  });

  it('maps Japanese to English correctly', () => {
    expect(getEmploymentTypeInEnglish('正社員')).toBe('FULL_TIME');
    expect(getEmploymentTypeInEnglish('パート・アルバイト')).toBe('PART_TIME');
    expect(getEmploymentTypeInEnglish('契約社員')).toBe('CONTRACT');
    expect(getEmploymentTypeInEnglish('インターン')).toBe('INTERN');
  });

  it('returns default for unknown Japanese types', () => {
    expect(getEmploymentTypeInEnglish('不明')).toBe('FULL_TIME');
  });
});
