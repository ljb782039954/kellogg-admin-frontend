import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createAppQueryClient } from '@/core/app/queryClient';
import { useNavigationEditor } from './useNavigationEditor';

const { getHeaderMock, updateHeaderMock, getPagesIndexMock } = vi.hoisted(() => ({
  getHeaderMock: vi.fn(),
  updateHeaderMock: vi.fn(),
  getPagesIndexMock: vi.fn(),
}));

vi.mock('../api/navigation.api', () => ({
  getHeader: getHeaderMock,
  updateHeader: updateHeaderMock,
}));

vi.mock('../api/pagesIndex.api', () => ({
  getPagesIndex: getPagesIndexMock,
}));

function createWrapper() {
  const client = createAppQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useNavigationEditor', () => {
  beforeEach(() => {
    getHeaderMock.mockReset();
    updateHeaderMock.mockReset();
    getPagesIndexMock.mockReset();
  });

  it('loads header and pages', async () => {
    getHeaderMock.mockResolvedValueOnce({
      logoText: { zh: 'Logo', en: 'Logo' },
      navItems: [{ id: 'n1', name: { zh: '首页', en: 'Home' }, linkType: 'internal', href: '/' }],
    });
    getPagesIndexMock.mockResolvedValueOnce([
      { id: 'home', path: '/', title: { zh: '首页', en: 'Home' }, isFixed: true, blocks: [] },
    ]);

    const { result } = renderHook(() => useNavigationEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.header.navItems).toHaveLength(1);
    expect(result.current.hasDeletedPages).toBe(false);
  });

  it('detects deleted pages', async () => {
    getHeaderMock.mockResolvedValueOnce({
      logoText: { zh: '', en: '' },
      navItems: [{ id: 'n1', name: { zh: '菜单', en: 'Menu' }, linkType: 'internal', href: '/missing' }],
    });
    getPagesIndexMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useNavigationEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasDeletedPages).toBe(true);
  });

  it('saves trimmed nav items', async () => {
    const navItems = Array.from({ length: 6 }, (_, i) => ({
      id: `n${i}`,
      name: { zh: `菜单${i}`, en: `Menu${i}` },
      linkType: 'internal' as const,
      href: '/',
    }));

    getHeaderMock.mockResolvedValueOnce({
      logoText: { zh: '', en: '' },
      navItems,
    });
    getPagesIndexMock.mockResolvedValueOnce([]);
    updateHeaderMock.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useNavigationEditor(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.save();
    });

    expect(updateHeaderMock).toHaveBeenCalledTimes(1);
    const saved = updateHeaderMock.mock.calls[0][0];
    expect(saved.navItems).toHaveLength(5);
    expect(result.current.saved).toBe(true);
  });
});
