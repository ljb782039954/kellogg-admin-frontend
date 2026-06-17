import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createAppQueryClient } from '@/app/queryClient';
import { useFooterEditor } from './useFooterEditor';

const { getFooterMock, updateFooterMock } = vi.hoisted(() => ({
  getFooterMock: vi.fn(),
  updateFooterMock: vi.fn(),
}));

vi.mock('../api/footer.api', () => ({
  getFooter: getFooterMock,
  updateFooter: updateFooterMock,
}));

vi.mock('@/features/navigation/api/pagesIndex.api', () => ({
  getPagesIndex: vi.fn().mockResolvedValue([]),
}));

function createWrapper() {
  const client = createAppQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useFooterEditor', () => {
  beforeEach(() => {
    getFooterMock.mockReset();
    updateFooterMock.mockReset();
  });

  it('loads footer and exposes update helpers', async () => {
    getFooterMock.mockResolvedValueOnce({
      linkGroups: [],
      newsletterPlaceholder: { zh: '输入邮箱', en: 'Email' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    });

    const { result } = renderHook(() => useFooterEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.addLinkGroup());
    expect(result.current.footer.linkGroups).toHaveLength(1);

    act(() => result.current.addLinkToGroup(0));
    expect(result.current.footer.linkGroups[0].links).toHaveLength(1);
  });

  it('saves footer', async () => {
    getFooterMock.mockResolvedValueOnce({
      linkGroups: [],
      newsletterPlaceholder: { zh: '输入邮箱', en: 'Email' },
      newsletterButton: { zh: '订阅', en: 'Subscribe' },
    });
    updateFooterMock.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useFooterEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.updateFooter({ newsletterButton: { zh: '立即订阅', en: 'Subscribe Now' } }));

    await act(async () => {
      await result.current.save();
    });

    expect(updateFooterMock).toHaveBeenCalledTimes(1);
    expect(updateFooterMock.mock.calls[0][0].newsletterButton.zh).toBe('立即订阅');
    expect(result.current.saved).toBe(true);
  });
});
