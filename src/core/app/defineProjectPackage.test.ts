import { describe, it, expect } from 'vitest';
import {
  defineProjectPackage,
  validateProjectPackage,
} from './defineProjectPackage';
import { defineProjectUi } from './defineProjectUi';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';
import type { ProjectPackage } from '@/core/contracts';

function clone(): ProjectPackage {
  return {
    ...fakeProjectPackage,
    menuGroups: fakeProjectPackage.menuGroups
      ? fakeProjectPackage.menuGroups.map((g) => ({ ...g }))
      : undefined,
    routes: fakeProjectPackage.routes.map((r) => ({ ...r })),
    entities: fakeProjectPackage.entities.map((e) => ({ ...e })),
    pageBuilder: fakeProjectPackage.pageBuilder
      ? {
          ...fakeProjectPackage.pageBuilder,
          blocks: fakeProjectPackage.pageBuilder.blocks.map((b) => ({ ...b })),
        }
      : undefined,
    ui: { ...fakeProjectPackage.ui, screens: { ...fakeProjectPackage.ui.screens } },
  };
}

describe('validateProjectPackage', () => {
  it('合法包返回空错误数组', () => {
    expect(validateProjectPackage(fakeProjectPackage)).toEqual([]);
  });

  it('检出重复 route id', () => {
    const pkg = clone();
    pkg.routes = [pkg.routes[0], { ...pkg.routes[0] }];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('route id'))).toBe(true);
  });

  it('检出缺失的 screenId', () => {
    const pkg = clone();
    pkg.routes = [{ ...pkg.routes[0], screenId: 'missing' }];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('missing'))).toBe(true);
  });

  it('检出重复 block type', () => {
    const pkg = clone();
    const block = pkg.pageBuilder!.blocks[0];
    pkg.pageBuilder!.blocks = [block, { ...block }];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('block type'))).toBe(true);
  });

  it('检出缺失的 previewId / editorId', () => {
    const pkg = clone();
    pkg.pageBuilder!.blocks = [
      { ...pkg.pageBuilder!.blocks[0], previewId: 'nope', editorId: 'nope' },
    ];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('previewId'))).toBe(true);
    expect(errors.some((e) => e.includes('editorId'))).toBe(true);
  });

  it('检出 menu.group 不存在于 menuGroups', () => {
    const pkg = clone();
    pkg.menuGroups = [{ id: 'other', title: { zh: '其它', en: 'Other' }, order: 1 }];
    const errors = validateProjectPackage(pkg);
    expect(errors.some((e) => e.includes('menuGroups'))).toBe(true);
  });
});

describe('defineProjectPackage', () => {
  it('合法包原样返回', () => {
    expect(defineProjectPackage(fakeProjectPackage)).toBe(fakeProjectPackage);
  });

  it('非法包抛出聚合错误', () => {
    const pkg = clone();
    pkg.routes = [{ ...pkg.routes[0], screenId: 'missing' }];
    expect(() => defineProjectPackage(pkg)).toThrow(/校验失败/);
  });
});

describe('defineProjectUi', () => {
  it('缺少 shell 成员时抛错', () => {
    expect(() =>
      defineProjectUi({
        // @ts-expect-error 故意缺少 LoginPage/ErrorPage 以触发校验
        shell: { Layout: () => null },
        screens: {},
        blockViews: {},
        blockEditors: {},
      }),
    ).toThrow(/shell/);
  });
});
