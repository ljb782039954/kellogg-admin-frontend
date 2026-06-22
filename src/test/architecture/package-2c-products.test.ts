import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');
const UI_FILES = [
  'BulkPriceSection.tsx',
  'ProductCustomFieldsSection.tsx',
  'ProductEditorContainer.tsx',
  'ProductEditorView.tsx',
  'ProductListSection.tsx',
  'ProductMediaSection.tsx',
  'ProductVariantsSection.tsx',
  'index.tsx',
];

describe('Phase 2c-5: products 已迁入 package', () => {
  it('产品管理 UI 真身位于 package/ui/screens/products', () => {
    for (const file of UI_FILES) {
      expect(existsSync(join(SRC, 'package/ui/screens/products', file)), file).toBe(true);
    }
  });

  it('业务类型、adapter 与 entity 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/product.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/product.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/product.entity.ts'))).toBe(true);
  });

  it('旧 feature 入口从 package 暴露 UI，旧 ui 目录无真身', () => {
    const body = readFileSync(join(SRC, 'features/products/index.ts'), 'utf8');
    expect(body).toContain(
      "export { ProductsEditor } from '@/package/ui/screens/products';",
    );
    for (const file of UI_FILES.filter((name) => name !== 'index.tsx')) {
      expect(existsSync(join(SRC, 'features/products/ui', file)), file).toBe(false);
    }
  });
});
