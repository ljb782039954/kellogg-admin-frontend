import type { Translation } from '@/shared/i18n/translation';
import type { IconName } from './icon';

export interface AdminMenuPlacement {
  group: string;
  order: number;
}

export interface AdminRouteDefinition {
  id: string;
  path: string;
  title: Translation;
  icon?: IconName;
  menu?: AdminMenuPlacement;
  /** 指向 ProjectUiDefinition.screens 的注册 id。 */
  screenId: string;
}
