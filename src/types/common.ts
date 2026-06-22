export type { Language, Translation } from '@/shared/i18n/translation';
export type { LinkType, NavLink } from '@/package/types/navigation';

export interface R2Image {
  key: string;
  name: string;
  url: string;
  thumbUrl: string;
  size: number;
  dimensions?: string;
  hash?: string;
  usages?: Array<{ type: string; name: string; id?: string }>;
  uploaded: string | Date;
}
