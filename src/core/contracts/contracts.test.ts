import { describe, it, expect } from 'vitest';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';

describe('core/contracts', () => {
  it('fixture 包满足 ProjectPackage 契约', () => {
    expect(fakeProjectPackage.identity.key).toBe('fake');
    expect(fakeProjectPackage.routes).toHaveLength(1);
    expect(fakeProjectPackage.ui.screens.dashboard).toBeTypeOf('function');
    expect(fakeProjectPackage.pageBuilder?.blocks[0]?.type).toBe('hero');
  });
});
