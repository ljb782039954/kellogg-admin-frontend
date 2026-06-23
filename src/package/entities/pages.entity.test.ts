import { describe, expect, it } from 'vitest';
import { pagesAdapter } from '@/package/adapters/pages.adapter';
import { pagesEntity } from './pages.entity';

describe('pagesEntity', () => {
  it('以配置集合接入页面列表与 page-builder', () => {
    expect(pagesEntity.key).toBe('pages');
    expect(pagesEntity.endpoint).toBe('/api/config/pages_index');
    expect(pagesEntity.capabilities).toEqual({
      list: true,
      create: true,
      update: true,
      delete: true,
    });
    expect(pagesEntity.screens).toEqual({ list: 'pages', editor: 'page-builder' });
    expect(pagesEntity.adapter).toBe(pagesAdapter);
  });
});
