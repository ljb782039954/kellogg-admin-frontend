import { describe, it, expect } from 'vitest';
import { screens } from './index.tsx';
import { routes } from '@/package/routes';

describe('package screens 注册表', () => {
  it('为每个 route.screenId 提供组件', () => {
    for (const route of routes) {
      expect(screens[route.screenId], `缺少 screen: ${route.screenId}`).toBeTypeOf('function');
    }
  });

  it('不含未被任何路由引用的多余 screen', () => {
    const used = new Set(routes.map((r) => r.screenId));
    for (const id of Object.keys(screens)) {
      expect(used.has(id), `多余 screen: ${id}`).toBe(true);
    }
  });
});
