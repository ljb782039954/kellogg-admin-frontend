import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

describe('Phase 2c-1: reviews 已迁入 package', () => {
  it('屏幕真身落在 package/ui/screens/reviews', () => {
    for (const f of ['ReviewsManager.tsx', 'ReviewsListView.tsx', 'ReviewFormDialog.tsx', 'ReviewFormView.tsx']) {
      expect(existsSync(join(SRC, 'package/ui/screens/reviews', f)), f).toBe(true);
    }
  });
  it('reviews 业务类型与契约工件就位', () => {
    expect(existsSync(join(SRC, 'package/types/review.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/adapters/review.adapter.ts'))).toBe(true);
    expect(existsSync(join(SRC, 'package/entities/review.entity.ts'))).toBe(true);
  });
  it('旧 features/reviews/index.ts 为 re-export shim', () => {
    const body = readFileSync(join(SRC, 'features/reviews/index.ts'), 'utf8').trim();
    expect(/^export \{[^}]*\} from '@\/package\/ui\/screens\/reviews';$/.test(body), body).toBe(true);
  });
});
