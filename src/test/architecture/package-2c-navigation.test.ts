import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');
const UI_FILES = [
  'NavigationEditor.tsx',
  'NavigationFormView.tsx',
  'NavigationPreview.tsx',
  'index.tsx',
];

describe('Phase 2c: navigation 已迁入 package', () => {
  it('Header 导航 UI 真身位于 package/ui/screens/navigation', () => {
    for (const file of UI_FILES) {
      expect(existsSync(join(SRC, 'package/ui/screens/navigation', file)), file).toBe(true);
    }
  });

  it('业务类型、adapter 与 entity 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/navigation.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/navigation.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/navigation.entity.ts'))).toBe(true);
  });

  it('旧 feature 入口从 package 暴露 UI，旧 ui 目录无真身', () => {
    const body = readFileSync(join(SRC, 'features/navigation/index.ts'), 'utf8');
    expect(body).toContain(
      "export { NavigationEditor } from '@/package/ui/screens/navigation';",
    );
    expect(existsSync(join(SRC, 'features/navigation/ui'))).toBe(false);
  });
});
