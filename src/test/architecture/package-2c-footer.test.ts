import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

describe('Phase 2c: footer 已迁入 package', () => {
  it('Footer UI 真身位于 package/ui/screens/footer', () => {
    expect(existsSync(join(SRC, 'package/ui/screens/footer/FooterEditor.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/screens/footer/index.tsx'))).toBe(true);
  });

  it('业务类型、adapter 与 entity 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/footer.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/footer.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/footer.entity.ts'))).toBe(true);
  });

  it('旧 feature 入口从 package 暴露 UI，旧 ui 目录无真身', () => {
    const body = readFileSync(join(SRC, 'features/footer/index.ts'), 'utf8');
    expect(body).toContain(
      "export { FooterEditor, FooterEditorView } from '@/package/ui/screens/footer';",
    );
    expect(existsSync(join(SRC, 'features/footer/ui'))).toBe(false);
  });
});
