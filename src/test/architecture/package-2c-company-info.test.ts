import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');
const UI_FILES = [
  'CompanyInfoEditor.tsx',
  'CompanyInfoFormView.tsx',
  'sections/BasicInfoSection.tsx',
  'sections/ContactSection.tsx',
  'sections/SocialMediaSection.tsx',
  'index.tsx',
];

describe('Phase 2c: company-info 已迁入 package', () => {
  it('公司信息 UI 真身位于 package/ui/screens/company-info', () => {
    for (const file of UI_FILES) {
      expect(existsSync(join(SRC, 'package/ui/screens/company-info', file)), file).toBe(true);
    }
  });

  it('业务类型、adapter 与 entity 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/company-info.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/company-info.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/company-info.entity.ts'))).toBe(true);
  });

  it('旧 feature 入口从 package 暴露 UI，旧 ui 目录无真身', () => {
    const body = readFileSync(join(SRC, 'features/company-info/index.ts'), 'utf8');
    expect(body).toContain(
      "export { CompanyInfoEditor } from '@/package/ui/screens/company-info';",
    );
    expect(existsSync(join(SRC, 'features/company-info/ui'))).toBe(false);
  });
});
