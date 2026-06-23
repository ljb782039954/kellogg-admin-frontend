import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');
const UI_FILES = [
  'inbox/InquiriesManager.tsx',
  'inbox/InquiriesView.tsx',
  'settings/InquirySettingsEditor.tsx',
  'settings/InquirySettingsView.tsx',
  'index.tsx',
];

describe('Phase 2c: inquiries 已迁入 package', () => {
  it('询盘列表与设置 UI 真身位于 package/ui/screens/inquiries', () => {
    for (const file of UI_FILES) {
      expect(existsSync(join(SRC, 'package/ui/screens/inquiries', file)), file).toBe(true);
    }
  });

  it('业务类型、adapter 与 entity 已就位', () => {
    expect(existsSync(join(SRC, 'package/types/inquiry.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/inquiry.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/inquiry.entity.ts'))).toBe(true);
  });

  it('旧 feature 入口从 package 暴露 UI，旧 ui 目录无真身', () => {
    const body = readFileSync(join(SRC, 'features/inquiries/index.ts'), 'utf8');
    expect(body).toContain(
      "export { InquiriesManager, InquirySettingsEditor } from '@/package/ui/screens/inquiries';",
    );
    expect(existsSync(join(SRC, 'features/inquiries/ui'))).toBe(false);
  });
});
