import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

describe('Phase 2c: pages 已迁入 package', () => {
  it('页面管理 UI 真身位于 package/ui/screens/pages', () => {
    expect(existsSync(join(SRC, 'package/ui/screens/pages/PagesManager.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/screens/pages/index.tsx'))).toBe(true);
  });

  it('页面索引类型、adapter 与 entity 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/page.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/pages.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/pages.entity.ts'))).toBe(true);
  });

  it('旧 feature 入口从 package 暴露 UI，旧 ui 目录无真身', () => {
    const body = readFileSync(join(SRC, 'features/pages/index.ts'), 'utf8');
    expect(body).toContain(
      "export { PagesManager } from '@/package/ui/screens/pages';",
    );
    expect(existsSync(join(SRC, 'features/pages/ui'))).toBe(false);
  });
});
