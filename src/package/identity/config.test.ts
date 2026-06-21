import { describe, it, expect } from 'vitest';
import { identity } from './config';

describe('package identity', () => {
  it('提供 Kellogg 品牌身份', () => {
    expect(identity.key).toBe('kellogg');
    expect(identity.name.en).toBe('KELLOGG');
    expect(identity.languages).toEqual(['zh', 'en']);
    expect(identity.defaultLanguage).toBe('zh');
  });
});
