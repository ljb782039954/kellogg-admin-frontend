import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

describe('Phase 2c-2: blog-categories 已迁入 package', () => {
  it('屏幕真身落在 package/ui/screens/blog-categories', () => {
    for (const file of ['BlogCategoriesManager.tsx', 'BlogCategoryRow.tsx', 'index.tsx']) {
      expect(existsSync(join(SRC, 'package/ui/screens/blog-categories', file)), file).toBe(true);
    }
  });

  it('业务类型、adapter 与 entity 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/blog-category.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/blog-category.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/blog-category.entity.ts'))).toBe(true);
  });

  it('旧 feature 入口只从 package 暴露 UI 真身', () => {
    const body = readFileSync(join(SRC, 'features/blog-categories/index.ts'), 'utf8');
    expect(body).toContain(
      "export { BlogCategoriesManager } from '@/package/ui/screens/blog-categories';",
    );
    expect(existsSync(join(SRC, 'features/blog-categories/ui/BlogCategoriesManager.tsx'))).toBe(false);
    expect(existsSync(join(SRC, 'features/blog-categories/ui/BlogCategoryRow.tsx'))).toBe(false);
  });
});
