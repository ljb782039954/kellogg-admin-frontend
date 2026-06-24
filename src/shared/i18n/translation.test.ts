import { describe, it, expect } from 'vitest';
import type { Translation } from '@/shared/i18n/translation';

describe('shared/i18n translation', () => {
  it('Translation 表示双语文案结构', () => {
    const translation: Translation = { zh: '你好', en: 'Hello' };
    expect(translation).toEqual({ zh: '你好', en: 'Hello' });
  });
});
