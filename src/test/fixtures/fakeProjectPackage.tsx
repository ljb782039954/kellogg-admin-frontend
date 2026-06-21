import type { ReactNode } from 'react';
import type { ProjectPackage } from '@/core/contracts';

function Screen() {
  return <div>screen</div>;
}
function BlockView() {
  return <div>view</div>;
}
function BlockEditor() {
  return <div>editor</div>;
}
function Layout({ children }: { children: ReactNode }) {
  return <div data-testid="layout">{children}</div>;
}
function LoginPage() {
  return <div>login</div>;
}
function ErrorPage() {
  return <div>error</div>;
}

/** 测试用最小合法项目包：所有 screenId/previewId/editorId 均可解析。 */
export const fakeProjectPackage: ProjectPackage = {
  identity: {
    key: 'fake',
    name: { zh: '测试', en: 'Fake' },
    languages: ['zh', 'en'],
    defaultLanguage: 'zh',
  },
  routes: [
    {
      id: 'dashboard',
      path: 'dashboard',
      title: { zh: '概览', en: 'Dashboard' },
      menu: { group: 'main', order: 1 },
      screenId: 'dashboard',
    },
  ],
  entities: [
    {
      key: 'widget',
      endpoint: '/widgets',
      adapter: {
        fromDto: (dto) => dto,
        toInput: (model) => model,
        toRequest: (input) => input,
      },
      capabilities: { list: true },
      screens: { list: 'widget-list' },
    },
  ],
  pageBuilder: {
    blocks: [
      {
        type: 'hero',
        title: { zh: '英雄', en: 'Hero' },
        category: 'content',
        icon: 'Square',
        create: () => ({ id: 'b1', type: 'hero', content: {}, isVisible: true }),
        previewId: 'hero',
        editorId: 'hero',
      },
    ],
  },
  ui: {
    shell: { Layout, LoginPage, ErrorPage },
    screens: { dashboard: Screen, 'widget-list': Screen },
    blockViews: { hero: BlockView },
    blockEditors: { hero: BlockEditor },
  },
};
