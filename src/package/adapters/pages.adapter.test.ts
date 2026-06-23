import { describe, expect, it } from 'vitest';
import { pagesAdapter } from './pages.adapter';
import type { PageIndexEntry } from '@/package/types';

const pages: PageIndexEntry[] = [
  {
    id: 'home',
    path: '/',
    title: { zh: '首页', en: 'Home' },
    isFixed: true,
    type: 'fixed-block',
    blockCount: 3,
  },
];

describe('pagesAdapter', () => {
  it('页面索引 DTO 与模型结构一致', () => {
    expect(pagesAdapter.fromDto(pages)).toBe(pages);
    expect(pagesAdapter.toInput(pages)).toBe(pages);
  });

  it('将页面索引包装为 pages_index 配置请求', () => {
    expect(pagesAdapter.toRequest(pages)).toEqual({
      key: 'pages_index',
      value: pages,
    });
  });
});
