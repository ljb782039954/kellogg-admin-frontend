import { describe, it, expect } from 'vitest';
import { projectPackage } from '@/package';

describe('projectPackage', () => {
  it('通过 defineProjectPackage 完整性校验（不抛错即已通过）', () => {
    expect(projectPackage.routes.length).toBeGreaterThan(0);
  });
  it('reviews entity 已接入且引用存在的 screen', () => {
    const reviews = projectPackage.entities.find((e) => e.key === 'reviews');
    expect(reviews).toBeDefined();
    expect(reviews!.screens.list).toBe('reviews');
    expect(projectPackage.ui.screens.reviews).toBeDefined();
  });
});
