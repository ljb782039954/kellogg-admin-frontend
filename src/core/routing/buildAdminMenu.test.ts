import { describe, it, expect } from 'vitest';
import { buildAdminMenu } from './buildAdminMenu';
import type { AdminRouteDefinition, AdminMenuGroupDefinition } from '@/core/contracts';

const groups: AdminMenuGroupDefinition[] = [
  { id: 'content', title: { zh: '内容', en: 'Content' }, order: 2 },
  { id: 'overview', title: { zh: '概览', en: 'Overview' }, order: 1 },
];

const routes: AdminRouteDefinition[] = [
  { id: 'dashboard', path: 'dashboard', title: { zh: '概览', en: 'Dashboard' }, menu: { group: 'overview', order: 1 }, screenId: 'dashboard' },
  { id: 'pages', path: 'pages', title: { zh: '页面', en: 'Pages' }, menu: { group: 'content', order: 2 }, screenId: 'pages' },
  { id: 'media', path: 'media', title: { zh: '图片', en: 'Media' }, menu: { group: 'content', order: 1 }, screenId: 'media' },
  { id: 'page-edit', path: 'pages/:id/edit', title: { zh: '编辑', en: 'Edit' }, screenId: 'page-builder' },
];

describe('buildAdminMenu', () => {
  it('按 group.order 排序分组，按 item.order 排序项', () => {
    const menu = buildAdminMenu(routes, groups);
    expect(menu.map((g) => g.id)).toEqual(['overview', 'content']);
    expect(menu[1].items.map((i) => i.routeId)).toEqual(['media', 'pages']);
  });

  it('item.path 为绝对路径', () => {
    const menu = buildAdminMenu(routes, groups);
    expect(menu[0].items[0].path).toBe('/dashboard');
  });

  it('不纳入无 menu 的 route，不输出空 group', () => {
    const menu = buildAdminMenu(routes, groups);
    const all = menu.flatMap((g) => g.items.map((i) => i.routeId));
    expect(all).not.toContain('page-edit');
    expect(menu.every((g) => g.items.length > 0)).toBe(true);
  });
});
