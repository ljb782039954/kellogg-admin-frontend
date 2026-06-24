import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

describe('Phase 2c: dashboard 已迁入 package', () => {
  it('概览 UI 真身位于 package/ui/screens/dashboard', () => {
    expect(existsSync(join(SRC, 'package/ui/screens/dashboard/Overview.tsx'))).toBe(true);
    expect(existsSync(join(SRC, 'package/ui/screens/dashboard/index.tsx'))).toBe(true);
  });

  it('dashboard screen 不再委托 admin 旧路径', () => {
    const body = readFileSync(join(SRC, 'package/ui/screens/index.tsx'), 'utf8');
    expect(body).toContain('dashboard: DashboardScreen');
    expect(body).not.toContain("from '@/admin/Overview'");
    expect(existsSync(join(SRC, 'admin/Overview.tsx'))).toBe(false);
  });

  it('P3 负责的 components 与 page-builder 均已进入 package/ui screen', () => {
    const body = readFileSync(join(SRC, 'package/ui/screens/index.tsx'), 'utf8');
    expect(body).toContain('components: ComponentsPreviewScreen');
    expect(body).not.toContain('@/admin/BlocksPreview');
    expect(body).toContain("'page-builder': PageBuilderScreen");
    expect(body).not.toContain('@/app/adapters/page-builder');
  });
});
