import { describe, it, expect } from 'vitest';
import { projectPackage } from './index';
import { routes } from './routes';

describe('kellogg projectPackage', () => {
  it('通过 defineProjectPackage 校验（导入即校验，不抛错）', () => {
    expect(projectPackage.identity.key).toBe('kellogg');
  });

  it('路由数量与 routes 模块一致', () => {
    expect(projectPackage.routes).toHaveLength(routes.length);
  });

  it('每个 route.screenId 在 ui.screens 中有实现', () => {
    for (const r of projectPackage.routes) {
      expect(projectPackage.ui.screens[r.screenId]).toBeTypeOf('function');
    }
  });

  it('reviews entity 已接入且引用存在的 screen', () => {
    const reviews = projectPackage.entities.find((e) => e.key === 'reviews');
    expect(reviews).toBeDefined();
    expect(reviews!.screens.list).toBe('reviews');
    expect(projectPackage.ui.screens.reviews).toBeDefined();
  });
});
