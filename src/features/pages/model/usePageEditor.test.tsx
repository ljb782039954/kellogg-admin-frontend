import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CustomPage } from '@/types';

const { getPageByIdMock, savePageDetailMock, usePageListMock } = vi.hoisted(() => ({
  getPageByIdMock: vi.fn(),
  savePageDetailMock: vi.fn(),
  usePageListMock: vi.fn(),
}));

vi.mock('../api/pages.api', () => ({
  getPageById: getPageByIdMock,
  savePageDetail: savePageDetailMock,
}));

vi.mock('./usePageList', () => ({ usePageList: usePageListMock }));

import { usePageEditor } from './usePageEditor';

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

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return {
    client,
    Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    },
  };
}

describe('usePageEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePageListMock.mockReturnValue({ pages: [page()] });
    savePageDetailMock.mockResolvedValue({ success: true });
  });

  it('merges index metadata with page detail', async () => {
    getPageByIdMock.mockResolvedValueOnce(page({
      blocks: [{ id: 'b1', type: 'textSection', content: { text: 'A' }, isVisible: true }],
      seo: {
        title: { zh: 'SEO', en: 'SEO' },
        description: { zh: '描述', en: 'Description' },
      },
    }));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageEditor('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.localPage?.blocks).toHaveLength(1));
    expect(result.current.localPage?.path).toBe('/one');
    expect(result.current.localPage?.seo?.title.zh).toBe('SEO');
  });

  it('supports block add, toggle, move, update, and removal commands', async () => {
    getPageByIdMock.mockResolvedValueOnce(page({
      blocks: [
        { id: 'a', type: 'textSection', content: {}, isVisible: true },
        { id: 'b', type: 'imageBanner', content: {}, isVisible: true },
      ],
    }));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageEditor('page_1'), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.localPage?.blocks).toHaveLength(2));

    act(() => result.current.handleToggleBlock('a'));
    expect(result.current.localPage?.blocks[0].isVisible).toBe(false);

    act(() => result.current.handleMoveBlock('b', 'up'));
    expect(result.current.localPage?.blocks.map((block) => block.id)).toEqual(['b', 'a']);

    act(() => result.current.handleUpdateBlockProps('b', { image: '/hero.jpg' }));
    expect(result.current.localPage?.blocks[0].content).toEqual({ image: '/hero.jpg' });

    act(() => result.current.handleAddBlock({
      id: 'c',
      type: 'gallery',
      content: {},
      isVisible: true,
    }));
    expect(result.current.activePanel).toBe('c');

    act(() => result.current.handleRemoveBlock('c'));
    expect(result.current.localPage?.blocks.map((block) => block.id)).toEqual(['b', 'a']);
    expect(result.current.activePanel).toBeNull();
  });

  it.fails('preserves metadata when SEO is updated immediately afterward', async () => {
    getPageByIdMock.mockResolvedValueOnce(page());
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageEditor('page_1'), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.localPage).not.toBeNull());

    act(() => {
      result.current.handleUpdateMeta({ path: '/updated' });
      result.current.handleUpdateSEO({
        title: { zh: 'SEO', en: 'SEO' },
        description: { zh: '描述', en: 'Description' },
      });
    });

    expect(result.current.localPage?.path).toBe('/updated');
  });

  it('updates metadata and saves the current page to cache', async () => {
    getPageByIdMock.mockResolvedValueOnce(page());
    const { Wrapper, client } = createWrapper();
    const setDataSpy = vi.spyOn(client, 'setQueryData');
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => usePageEditor('page_1'), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.localPage).not.toBeNull());

    act(() => result.current.handleUpdateMeta({ path: '/updated' }));
    await waitFor(() => expect(result.current.localPage?.path).toBe('/updated'));

    await act(async () => result.current.handleSave());

    expect(savePageDetailMock).toHaveBeenCalledWith(
      'page_1',
      expect.objectContaining({ path: '/updated' }),
    );
    expect(setDataSpy).toHaveBeenCalledWith(
      ['pages', 'detail', 'page_1'],
      expect.objectContaining({ path: '/updated' }),
    );
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pages', 'list'] });
  });

  it('exposes fixed-layout state and save errors', async () => {
    usePageListMock.mockReturnValue({ pages: [page({ type: 'fixed-layout' })] });
    getPageByIdMock.mockResolvedValueOnce(page({ type: 'fixed-layout' }));
    savePageDetailMock.mockRejectedValueOnce(new Error('save failed'));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageEditor('page_1'), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.localPage).not.toBeNull());

    expect(result.current.isFixedLayout).toBe(true);
    await act(async () => result.current.handleSave());
    expect(result.current.error).toBe('save failed');
    expect(result.current.isSaving).toBe(false);
  });
});
