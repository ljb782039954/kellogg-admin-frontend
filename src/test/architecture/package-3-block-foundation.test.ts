import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

describe('P3: Block 非 UI 基础已迁入 package', () => {
  it('类型、业务 registry 与 page-builder definition 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/block.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/blocks/registry.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/page-builder/definition.ts'))).toBe(true);
  });

  it('旧类型兼容导出已删除，blockCatalog 只委托 package/blocks', () => {
    expect(existsSync(join(SRC, 'types/blocks.ts'))).toBe(false);
    expect(readFileSync(
      join(SRC, 'features/page-builder/model/blockCatalog.ts'),
      'utf8',
    )).toContain("from '@/package/blocks/registry'");
  });

  it('Blocks 与 Editors 视觉文件已迁入 package/ui', () => {
    expect(existsSync(join(SRC, 'package/ui/blocks/blocks/Carousel.tsx'))).toBe(true);
    expect(existsSync(join(
      SRC,
      'package/ui/editors/page-builder/property-editors/CarouselPropsEditor.tsx',
    ))).toBe(true);
    expect(existsSync(join(SRC, 'components/blocks/Carousel.tsx'))).toBe(false);
    expect(existsSync(join(
      SRC,
      'ui/themes/default/page-builder/property-editors/CarouselPropsEditor.tsx',
    ))).toBe(false);
    expect(readFileSync(
      join(SRC, 'package/ui/blocks/legacyRegistry.tsx'),
      'utf8',
    )).toContain("from './blocks'");
    expect(readFileSync(
      join(SRC, 'package/ui/editors/legacyRegistry.tsx'),
      'utf8',
    )).toContain("from './page-builder'");
  });
});
