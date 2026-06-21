import { describe, it, expect } from 'vitest';
import { routes, menuGroups } from './index';

describe('package routes', () => {
  it('route id 与 path 唯一', () => {
    expect(new Set(routes.map((r) => r.id)).size).toBe(routes.length);
    expect(new Set(routes.map((r) => r.path)).size).toBe(routes.length);
  });

  it('每个带 menu 的 route 其 group 都在 menuGroups 中', () => {
    const ids = new Set(menuGroups.map((g) => g.id));
    for (const r of routes) {
      if (r.menu) expect(ids.has(r.menu.group)).toBe(true);
    }
  });

  it('覆盖关键路由', () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toContain('dashboard');
    expect(paths).toContain('pages/:pageId/edit');
    expect(paths).toContain('blog/:id/edit');
  });
});
