import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CustomPage } from '@/types';

const { useResolvedPageMock, useSavePageMock } = vi.hoisted(() => ({
  useResolvedPageMock: vi.fn(),
  useSavePageMock: vi.fn(),
}));

vi.mock('@/features/pages', () => ({
  useResolvedPage: useResolvedPageMock,
  useSavePage: useSavePageMock,
}));

import { useInquirySettings } from './useInquirySettings';

function page(overrides: Partial<CustomPage> = {}): CustomPage {
  return {
    id: 'system-inquiry',
    path: '/inquiry',
    title: { zh: '询盘', en: 'Inquiry' },
    isFixed: true,
    type: 'dynamic-block',
    blocks: [],
    content: {
      title: { zh: '联系我们要样品', en: 'Contact Us For Samples' },
      description: { zh: '描述', en: 'Description' },
    },
    seo: { title: { zh: '', en: '' }, description: { zh: '', en: '' } },
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

describe('useInquirySettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes form from page content', async () => {
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInquirySettings(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    if (result.current.status !== 'ready') return;
    await waitFor(() => expect(result.current.form.getValues('title.zh')).toBe('联系我们要样品'));
  });

  it('uses defaults when content is missing', async () => {
    useResolvedPageMock.mockReturnValue({ page: page({ content: undefined }), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInquirySettings(), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    if (result.current.status !== 'ready') return;
    await waitFor(() => expect(result.current.form.getValues('title.zh')).toBe('联系我们要样品'));
  });

  it('saves page and preserves other fields', async () => {
    const savePage = vi.fn().mockResolvedValue(undefined);
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage, isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInquirySettings(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.status).toBe('ready'));
    if (result.current.status !== 'ready') return;

    act(() => result.current.form.setValue('title.zh', '新标题'));
    await act(async () => result.current.submit());

    expect(savePage).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'system-inquiry',
        content: { title: { zh: '新标题', en: 'Contact Us For Samples' }, description: { zh: '描述', en: 'Description' } },
      }),
    );
  });
});
