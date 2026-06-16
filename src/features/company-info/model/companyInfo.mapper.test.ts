import { describe, expect, it } from 'vitest';
import { blankCompanyInfo } from './companyInfo.defaults';
import {
  companyInfoSchema,
  toCompanyInfoFormValues,
  toCompanyInfoPayload,
} from './companyInfo.mapper';

describe('company info mapper', () => {
  it('fills missing nested values with defaults', () => {
    const form = toCompanyInfoFormValues({
      name: { zh: '杭州品牌', en: 'Hangzhou Brand' },
      socialMedia: { instagram: 'https://instagram.example' },
    });

    expect(form).toEqual({
      ...blankCompanyInfo,
      name: { zh: '杭州品牌', en: 'Hangzhou Brand' },
      socialMedia: { instagram: 'https://instagram.example' },
    });
  });

  it('normalizes blank optional social links to undefined in payloads', () => {
    const payload = toCompanyInfoPayload({
      ...blankCompanyInfo,
      socialMedia: {
        instagram: '  https://instagram.example  ',
        twitter: '   ',
        youtube: '',
      },
    });

    expect(payload.socialMedia).toEqual({
      instagram: 'https://instagram.example',
      twitter: undefined,
      youtube: undefined,
    });
  });

  it('validates the complete nested company info shape', () => {
    const parsed = companyInfoSchema.parse(blankCompanyInfo);

    expect(parsed).toEqual(blankCompanyInfo);
  });
});
