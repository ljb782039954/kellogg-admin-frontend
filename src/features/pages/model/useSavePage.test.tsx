import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CustomPage } from '@/package/types';
import { pageKeys } from '../api/pages.keys';

const { savePageDetailMock, savePagesIndexMock } = vi.hoisted(() => ({
  savePageDetailMock: vi.fn(),
  savePagesIndexMock: vi.fn(),
}));

vi.mock('../api/pages.api', () => ({
  savePageDetail: savePageDetailMock,
  savePagesIndex: savePagesIndexMock,
}));

import { useSavePage } from './useSavePage';

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

describe('useSavePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    savePageDetailMock.mockResolvedValue({ success: true });
    savePagesIndexMock.mockResolvedValue({ success: true });
  });

  it('saves page detail and syncs index', async () => {
    const { Wrapper, client } = createWrapper();
    client.setQueryData(pageKeys.list(), [
      page(),
      { id: 'other', path: '/other', title: { zh: '其他', en: 'Other' }, isFixed: false },
    ]);
    const setDataSpy = vi.spyOn(client, 'setQueryData');
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(() => useSavePage(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSaving).toBe(false));

    const p = page({ blocks: [{ id: 'b1', type: 'textSection', content: {}, isVisible: true }] });
    const saved = await act(async () => result.current.savePage(p));

    expect(saved).toBe(p);
    expect(savePageDetailMock).toHaveBeenCalledWith('page_1', p);
    expect(savePagesIndexMock).toHaveBeenCalled();
    expect(setDataSpy).toHaveBeenCalledWith(
      ['pages', 'detail', 'page_1'],
      expect.objectContaining({ id: 'page_1' }),
    );
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pages', 'list'] });
  });

  it('rejects when save fails', async () => {
    const { Wrapper } = createWrapper();
    savePageDetailMock.mockRejectedValueOnce(new Error('save failed'));
    const { result } = renderHook(() => useSavePage(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.isSaving).toBe(false));

    const p = page();
    await act(async () => {
      await expect(result.current.savePage(p)).rejects.toThrow('save failed');
    });
    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
