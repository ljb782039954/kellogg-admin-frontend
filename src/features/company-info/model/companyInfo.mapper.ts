import type { CompanyInfo } from '@/types';
import { blankCompanyInfo } from './companyInfo.defaults';
import { companyInfoSchema, type CompanyInfoFormValues } from './companyInfo.schema';

const socialKeys = [
  'wechat',
  'weibo',
  'facebook',
  'instagram',
  'twitter',
  'youtube',
  'linkedin',
  'tiktok',
  'whatsapp',
] as const;

type SocialKey = (typeof socialKeys)[number];

function normalizeSocialMedia(
  socialMedia: CompanyInfoFormValues['socialMedia'],
): CompanyInfo['socialMedia'] {
  return socialKeys.reduce<CompanyInfo['socialMedia']>((result, key) => {
    const value = socialMedia[key as SocialKey]?.trim();

    if (value) {
      result[key] = value;
    } else if (key in socialMedia) {
      result[key] = undefined;
    }

    return result;
  }, {});
}

export { companyInfoSchema };
export type { CompanyInfoFormValues };

export function toCompanyInfoFormValues(input: Partial<CompanyInfo> | null | undefined): CompanyInfoFormValues {
  return companyInfoSchema.parse({
    ...blankCompanyInfo,
    ...input,
    name: { ...blankCompanyInfo.name, ...input?.name },
    description: { ...blankCompanyInfo.description, ...input?.description },
    contact: {
      ...blankCompanyInfo.contact,
      ...input?.contact,
      address: {
        ...blankCompanyInfo.contact.address,
        ...input?.contact?.address,
      },
    },
    socialMedia: {
      ...blankCompanyInfo.socialMedia,
      ...input?.socialMedia,
    },
  });
}

export function toCompanyInfoPayload(form: CompanyInfoFormValues): CompanyInfo {
  const parsed = companyInfoSchema.parse(form);

  return {
    ...parsed,
    socialMedia: normalizeSocialMedia(parsed.socialMedia),
  };
}
