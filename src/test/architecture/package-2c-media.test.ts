import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');
const UI_FILES = [
  'MediaManager.tsx',
  'MediaHeader.tsx',
  'MediaGrid.tsx',
  'MediaDetails.tsx',
  'index.tsx',
];

describe('Phase 2c-6: media UI 已迁入 package', () => {
  it('媒体管理 UI 真身位于 package/ui/screens/media', () => {
    for (const file of UI_FILES) {
      expect(existsSync(join(SRC, 'package/ui/screens/media', file)), file).toBe(true);
    }
  });

  it('旧 feature 入口从 package 暴露 UI，旧 ui 目录无真身', () => {
    const body = readFileSync(join(SRC, 'features/media/index.ts'), 'utf8');
    expect(body).toContain(
      "export { MediaManager } from '@/package/ui/screens/media';",
    );
    for (const file of UI_FILES.filter((name) => name !== 'index.tsx')) {
      expect(existsSync(join(SRC, 'features/media/ui', file)), file).toBe(false);
    }
  });

  it('技术型 media model/api 仍留在 feature/shared，未伪装为业务 entity', () => {
    expect(existsSync(join(SRC, 'features/media/model/useMediaManager.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'shared/media/api/media.api.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/media.entity.ts'))).toBe(false);
  });
});
