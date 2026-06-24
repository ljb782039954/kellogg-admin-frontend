import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CustomPage } from '@/types';

const { getPageByIdMock, usePageListMock } = vi.hoisted(() => ({
  getPageByIdMock: vi.fn(),
  usePageListMock: vi.fn(),
}));

vi.mock('../api/pages.api', () => ({
  getPageById: getPageByIdMock,
}));

vi.mock('./usePageList', () => ({ usePageList: usePageListMock }));

import { useResolvedPage } from './useResolvedPage';

function page(overrides: Partial<CustomPage> = {}): CustomPage {
  return {
    id: 'page_1',
    path: '/one',
    title: { zh: '页面', en: 'Page' },
    isFixed: false,
    type: 'dynamic-block',
    blocks: [],
    ...overrides,
  };
}

function indexEntry(overrides: Partial<CustomPage> = {}) {
  const currentPage = page(overrides);
  const { blocks, seo, ...rest } = currentPage;
  void seo;
  return { ...rest, blockCount: blocks?.length ?? 0 };
}

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return {
    client,
    Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      );
    },
  };
}

describe('useResolvedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePageListMock.mockReturnValue({ pages: [], isLoading: false });
  });

  it('merges index metadata with page detail', async () => {
    usePageListMock.mockReturnValue({
      pages: [indexEntry()],
      isLoading: false,
    });
    getPageByIdMock.mockResolvedValueOnce(
      page({
        blocks: [
          {
            id: 'b1',
            type: 'textSection',
            content: { text: 'A' },
            isVisible: true,
          },
        ],
        seo: {
          title: { zh: 'SEO', en: 'SEO' },
          description: { zh: '描述', en: 'Description' },
        },
      }),
    );

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useResolvedPage('page_1'), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.page?.id).toBe('page_1');
    expect(result.current.page?.path).toBe('/one');
    expect(result.current.page?.title.zh).toBe('页面');
    expect(result.current.page?.blocks).toHaveLength(1);
    expect(result.current.page?.seo?.title.zh).toBe('SEO');
  });

  it('does not fetch detail when pageId is empty', async () => {
    usePageListMock.mockReturnValue({
      pages: [indexEntry()],
      isLoading: false,
    });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useResolvedPage(undefined), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.page).toBeUndefined();
    expect(getPageByIdMock).not.toHaveBeenCalled();
  });

  it('returns undefined when page is not found in index', async () => {
    usePageListMock.mockReturnValue({ pages: [], isLoading: false });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useResolvedPage('nonexistent'), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.page).toBeUndefined();
  });
});
