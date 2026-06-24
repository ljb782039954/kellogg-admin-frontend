import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CustomPage } from '@/types';

const {
  getPagesIndexMock,
  savePagesIndexMock,
  savePageDetailMock,
  deletePageDetailMock,
  nanoidMock,
} = vi.hoisted(() => ({
  getPagesIndexMock: vi.fn(),
  savePagesIndexMock: vi.fn(),
  savePageDetailMock: vi.fn(),
  deletePageDetailMock: vi.fn(),
  nanoidMock: vi.fn(),
}));

vi.mock('../api/pages.api', () => ({
  getPagesIndex: getPagesIndexMock,
  savePagesIndex: savePagesIndexMock,
  savePageDetail: savePageDetailMock,
  deletePageDetail: deletePageDetailMock,
}));

vi.mock('nanoid', () => ({ nanoid: nanoidMock }));

import { usePageList } from './usePageList';

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
      return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      );
    },
  };
}

describe('usePageList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    savePagesIndexMock.mockResolvedValue({ success: true });
    savePageDetailMock.mockResolvedValue({ success: true });
    deletePageDetailMock.mockResolvedValue({ success: true });
  });

  it('loads the page index', async () => {
    getPagesIndexMock.mockResolvedValueOnce([page()]);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageList(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.pages).toHaveLength(1);
  });

  it('creates a page, saves its detail and index, and navigates to the editor', async () => {
    getPagesIndexMock.mockResolvedValueOnce([]);
    nanoidMock.mockReturnValueOnce('new12345');
    const navigate = vi.fn();
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addPage(
        { zh: '新页', en: 'New' },
        '/new',
        undefined,
        navigate,
      );
    });

    expect(savePageDetailMock).toHaveBeenCalledWith(
      'page_new12345',
      expect.objectContaining({ id: 'page_new12345', path: '/new' }),
    );
    expect(savePagesIndexMock).toHaveBeenCalled();
    const savedIndex = savePagesIndexMock.mock.calls[0][0];
    expect(savedIndex[0].blockCount).toBe(0);
    expect(savedIndex[0]).not.toHaveProperty('blocks');
    expect(navigate).toHaveBeenCalledWith('/pages/page_new12345/edit');
  });

  it('duplicates blocks with new IDs before saving the detail and index', async () => {
    getPagesIndexMock.mockResolvedValueOnce([]);
    nanoidMock.mockReturnValueOnce('copy1234').mockReturnValueOnce('block999');
    const source = page({
      blocks: [
        {
          id: 'old',
          type: 'textSection',
          content: { text: 'A' },
          isVisible: true,
        },
      ],
    });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addPage(
        { zh: '副本', en: 'Copy' },
        '/copy',
        source,
      );
    });

    expect(nanoidMock).toHaveBeenCalledTimes(2);
    expect(savePageDetailMock.mock.calls[0][1].blocks[0].id).toMatch(
      /^block_/,
    );
    expect(savePagesIndexMock.mock.calls[0][0][0].blockCount).toBe(1);
  });

  it('updates metadata and deletes detail before removing the index entry', async () => {
    getPagesIndexMock.mockResolvedValueOnce([page()]);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updatePageMeta('page_1', { path: '/updated' });
    });
    expect(savePagesIndexMock).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'page_1', path: '/updated' }),
      ]),
    );

    await act(async () => result.current.deletePage('page_1'));
    expect(deletePageDetailMock).toHaveBeenCalledWith('page_1');
    expect(savePagesIndexMock).toHaveBeenLastCalledWith(
      expect.arrayContaining([]),
    );
    expect(deletePageDetailMock.mock.invocationCallOrder[0]).toBeLessThan(
      savePagesIndexMock.mock.invocationCallOrder.at(-1)!,
    );
  });
});
