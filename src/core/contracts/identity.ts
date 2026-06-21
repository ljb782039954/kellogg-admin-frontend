import type { Language, Translation } from '@/shared/i18n/translation';

export interface ProjectIdentity {
  /** 项目唯一标识，如 'kellogg'。 */
  key: string;
  /** 品牌名称。 */
  name: Translation;
  /** Logo 资源路径或 URL。 */
  logo?: string;
  /** 支持的语言。 */
  languages: Language[];
  /** 默认语言。 */
  defaultLanguage: Language;
}
