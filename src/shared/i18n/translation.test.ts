import { describe, it, expect } from 'vitest';
import type { Translation } from '@/shared/i18n/translation';
import type { Translation as TranslationFromTypes } from '@/types';

describe('shared/i18n translation', () => {
  it('Translation 在 @/types 与 @/shared/i18n 之间结构一致（re-export 生效）', () => {
    const a: Translation = { zh: '你好', en: 'Hello' };
    const b: TranslationFromTypes = a; // 双向可赋值 → 同一类型
    expect(b).toEqual({ zh: '你好', en: 'Hello' });
  });
});
