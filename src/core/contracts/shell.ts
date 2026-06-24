import type { ComponentType, ReactNode } from 'react';
import type { Language, Translation } from '@/shared/i18n/translation';
import type { ProjectIdentity } from './identity';
import type { IconName } from './icon';
import type { AdminLoginPageProps } from './auth';

/** package 声明的菜单分组展示信息。 */
export interface AdminMenuGroupDefinition {
  id: string;
  title: Translation;
  order: number;
  icon?: IconName;
}

/** core 据 routes 构建的菜单项（运行期模型）。 */
export interface AdminMenuItem {
  routeId: string;
  path: string;
  title: Translation;
  icon?: IconName;
  order: number;
}

/** core 据 routes + menuGroups 构建的菜单分组（运行期模型）。 */
export interface AdminMenuGroup {
  id: string;
  title: Translation;
  order: number;
  icon?: IconName;
  items: AdminMenuItem[];
}

export interface AdminShellProps {
  identity: ProjectIdentity;
  menu: AdminMenuGroup[];
  language: Language;
  onLanguageChange(language: Language): void;
  children: ReactNode;
}

export interface AdminShellDefinition {
  Layout: ComponentType<AdminShellProps>;
  LoginPage: ComponentType<AdminLoginPageProps>;
  ErrorPage: ComponentType<{ error?: unknown }>;
}
