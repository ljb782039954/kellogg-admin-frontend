import type { ComponentType, ReactNode } from 'react';

/** core 注入给业务 screen 的通用服务；具体形状在 P4 扩充。 */
export interface AdminScreenProps {
  routeId: string;
}

export interface BlockPreviewProps<Content = unknown, Resources = unknown> {
  content: Content;
  resources: Resources;
}

export interface BlockEditorProps<Content = unknown, Resources = unknown> {
  content: Content;
  resources: Resources;
  onChange(next: Content): void;
}

export interface AdminShellDefinition {
  Layout: ComponentType<{ children: ReactNode }>;
  LoginPage: ComponentType;
  ErrorPage: ComponentType<{ error?: unknown }>;
}

export interface ProjectUiDefinition {
  shell: AdminShellDefinition;
  screens: Record<string, ComponentType<AdminScreenProps>>;
  blockViews: Record<string, ComponentType<BlockPreviewProps>>;
  blockEditors: Record<string, ComponentType<BlockEditorProps>>;
}
