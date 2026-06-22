import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');
const BLOG_UI_FILES = [
  'BlogsManager.tsx',
  'BlogList.tsx',
  'BlogEditor.tsx',
  'BlogForm.tsx',
  'MarkdownEditor.tsx',
  'TagInput.tsx',
  'index.tsx',
];

describe('Phase 2c-3: blogs 已迁入 package', () => {
  it('列表、编辑器及其 UI 子组件均在 package/ui/screens/blogs', () => {
    for (const file of BLOG_UI_FILES) {
      expect(existsSync(join(SRC, 'package/ui/screens/blogs', file)), file).toBe(true);
    }
  });

  it('业务类型、adapter 与 entity 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/blog.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/blog.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/blog.entity.ts'))).toBe(true);
  });

  it('旧 feature 入口从 package 暴露 UI，旧 ui 目录无真身', () => {
    const body = readFileSync(join(SRC, 'features/blogs/index.ts'), 'utf8');
    expect(body).toContain(
      "export { BlogEditor, BlogsManager } from '@/package/ui/screens/blogs';",
    );
    for (const file of BLOG_UI_FILES.filter((name) => name !== 'index.tsx')) {
      expect(existsSync(join(SRC, 'features/blogs/ui', file)), file).toBe(false);
    }
  });
});
