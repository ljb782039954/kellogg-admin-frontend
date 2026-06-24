import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { useResolvedPageMock, useSavePageMock } = vi.hoisted(() => ({
  useResolvedPageMock: vi.fn(),
  useSavePageMock: vi.fn(),
}));

vi.mock('@/features/pages', () => ({
  useResolvedPage: useResolvedPageMock,
  useSavePage: useSavePageMock,
}));

import type { CustomPage } from '@/package/types';
import { usePageBuilderController } from './usePageBuilderController';

type PageBuilderController = ReturnType<typeof usePageBuilderController>;
type ReadyPageBuilderController = Extract<PageBuilderController, { status: 'ready' }>;

function ready(controller: PageBuilderController): ReadyPageBuilderController {
  expect(controller.status).toBe('ready');
  if (controller.status !== 'ready') {
    throw new Error('Expected page builder controller to be ready');
  }

  return controller;
}

function page(overrides: Partial<CustomPage> = {}): CustomPage {
  return {
    id: 'page_1',
    path: '/one',
    title: { zh: '网页', en: 'Page' },
    isFixed: false,
    type: 'dynamic-block',
    blocks: [
      { id: 'b1', type: 'carousel', content: { autoPlay: true }, isVisible: true },
      { id: 'b2', type: 'textSection', content: { text: 'Hello' }, isVisible: true },
    ],
    seo: {
      title: { zh: 'SEO', en: 'SEO' },
      description: { zh: '描述', en: 'Description' },
      keywords: { zh: '', en: '' },
      targetCountry: '',
    },
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

describe('usePageBuilderController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading when page is loading', () => {
    useResolvedPageMock.mockReturnValue({ page: undefined, isLoading: true, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    expect(result.current.status).toBe('loading');
  });

  it('returns error when page query errors', () => {
    useResolvedPageMock.mockReturnValue({ page: undefined, isLoading: false, error: new Error('网络错误') });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    expect(result.current.status).toBe('error');
    if (result.current.status === 'error') {
      expect(result.current.error).toBeTruthy();
    }
  });

  it('returns not-found when page is undefined without error', () => {
    useResolvedPageMock.mockReturnValue({ page: undefined, isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    expect(result.current.status).toBe('not-found');
  });

  it('returns ready with viewModel and actions when page loads', async () => {
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    const r0 = ready(result.current);
    expect(r0.viewModel.page.id).toBe('page_1');
    expect(r0.viewModel.selectedPanel).toBeNull();
    expect(r0.viewModel.isDirty).toBe(false);
    expect(r0.viewModel.canSave).toBe(false);
    expect(r0.actions.selectPanel).toBeInstanceOf(Function);
    expect(r0.actions.save).toBeInstanceOf(Function);
  });

  it('marks fixed-layout pages', async () => {
    useResolvedPageMock.mockReturnValue({ page: page({ type: 'fixed-layout' }), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    const ctrl1 = ready(result.current);
    expect(ctrl1.viewModel.isFixedLayout).toBe(true);
    expect(ctrl1.viewModel.canSave).toBe(false);
  });

  it('adds block and auto-selects it', async () => {
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));

    let ctrl = ready(result.current);
    act(() => ctrl.actions.addBlock('gallery'));
    ctrl = ready(result.current);
    expect(ctrl.viewModel.isDirty).toBe(true);
    expect(ctrl.viewModel.canSave).toBe(true);
    expect(ctrl.viewModel.selectedBlock?.type).toBe('gallery');
    expect(ctrl.viewModel.page.blocks).toHaveLength(3);
  });

  it('undoes and redoes draft changes', async () => {
    useResolvedPageMock.mockReturnValue({
      page: page(),
      isLoading: false,
      error: null,
    });
    useSavePageMock.mockReturnValue({
      savePage: vi.fn(),
      isSaving: false,
      error: null,
    });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(
      () => usePageBuilderController('page_1'),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe('ready'));
    let controller = ready(result.current);
    act(() => controller.actions.addBlock('gallery'));
    controller = ready(result.current);
    expect(controller.viewModel.canUndo).toBe(true);
    expect(controller.viewModel.page.blocks).toHaveLength(3);

    act(() => controller.actions.undo());
    controller = ready(result.current);
    expect(controller.viewModel.page.blocks).toHaveLength(2);
    expect(controller.viewModel.canRedo).toBe(true);

    act(() => controller.actions.redo());
    controller = ready(result.current);
    expect(controller.viewModel.page.blocks).toHaveLength(3);
  });

  it('shows availableBlocks with singleton state', async () => {
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    const r2 = ready(result.current);
    const carousel = r2.viewModel.availableBlocks.find((a) => a.type === 'carousel');
    expect(carousel?.canAdd).toBe(false);
    expect(carousel?.disabledReason).toBe('singleton-exists');

    const textSection = r2.viewModel.availableBlocks.find((a) => a.type === 'textSection');
    expect(textSection?.canAdd).toBe(true);
  });

  it('selects a panel and derives selectedBlock', async () => {
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    let r3 = ready(result.current);
    act(() => r3.actions.selectPanel({ type: 'block', blockId: 'b1' }));
    r3 = ready(result.current);
    expect(r3.viewModel.selectedPanel).toEqual({ type: 'block', blockId: 'b1' });
    expect(r3.viewModel.selectedBlock?.type).toBe('carousel');

    act(() => r3.actions.selectPanel({ type: 'page-settings' }));
    r3 = ready(result.current);
    expect(r3.viewModel.selectedBlock).toBeUndefined();
  });

  it('saves and resets baseline on success', async () => {
    const savePage = vi.fn().mockResolvedValue(undefined);
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage, isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    let r4 = ready(result.current);
    act(() => r4.actions.addBlock('gallery'));
    r4 = ready(result.current);
    expect(r4.viewModel.isDirty).toBe(true);

    await act(async () => r4.actions.save());
    r4 = ready(result.current);
    expect(savePage).toHaveBeenCalled();
    expect(r4.viewModel.isDirty).toBe(false);
    expect(r4.viewModel.saveStatus).toBe('saved');
  });

  it('keeps dirty draft on save failure', async () => {
    const savePage = vi.fn().mockRejectedValue(new Error('保存失败'));
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage, isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    let r5 = ready(result.current);
    act(() => r5.actions.addBlock('gallery'));
    r5 = ready(result.current);

    await act(async () => r5.actions.save());
    r5 = ready(result.current);
    expect(r5.viewModel.isDirty).toBe(true);
    expect(r5.viewModel.saveStatus).toBe('error');
  });

  it('updates metadata and SEO', async () => {
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    let r6 = ready(result.current);
    act(() => r6.actions.updateMeta({ path: '/updated' }));
    r6 = ready(result.current);
    expect(r6.viewModel.page.path).toBe('/updated');
    expect(r6.viewModel.isDirty).toBe(true);

    const newSeo = { title: { zh: '新SEO', en: 'New' }, description: { zh: '', en: '' }, keywords: { zh: '', en: '' }, targetCountry: '' };
    act(() => r6.actions.updateSeo(newSeo));
    r6 = ready(result.current);
    expect(r6.viewModel.page.seo.title.zh).toBe('新SEO');
  });

  it('requestExit calls onConfirmed when page is clean', async () => {
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    const r = ready(result.current);
    const onConfirmed = vi.fn();
    r.actions.requestExit(onConfirmed);
    expect(onConfirmed).toHaveBeenCalled();
  });

  it('requestExit shows confirm when page is dirty and calls onConfirmed on accept', async () => {
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(true);
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    const r = ready(result.current);
    act(() => r.actions.addBlock('gallery'));

    const onConfirmed = vi.fn();
    r.actions.requestExit(onConfirmed);
    expect(confirmMock).toHaveBeenCalled();
    expect(onConfirmed).toHaveBeenCalled();
    confirmMock.mockRestore();
  });

  it('requestExit does not call onConfirmed when user cancels', async () => {
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false);
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    const r = ready(result.current);
    act(() => r.actions.addBlock('gallery'));

    const onConfirmed = vi.fn();
    r.actions.requestExit(onConfirmed);
    expect(confirmMock).toHaveBeenCalled();
    expect(onConfirmed).not.toHaveBeenCalled();
    confirmMock.mockRestore();
  });

  it('moves, toggles, and removes blocks', async () => {
    useResolvedPageMock.mockReturnValue({ page: page(), isLoading: false, error: null });
    useSavePageMock.mockReturnValue({ savePage: vi.fn(), isSaving: false, error: null });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => usePageBuilderController('page_1'), { wrapper: Wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    let r7 = ready(result.current);
    act(() => r7.actions.moveBlock('b2', 0));
    r7 = ready(result.current);
    expect(r7.viewModel.page.blocks[0].type).toBe('textSection');

    act(() => r7.actions.toggleBlock('b1'));
    r7 = ready(result.current);
    expect(r7.viewModel.page.blocks.find((b) => b.id === 'b1')?.isVisible).toBe(false);

    act(() => r7.actions.removeBlock('b1'));
    r7 = ready(result.current);
    expect(r7.viewModel.page.blocks).toHaveLength(1);
  });
});
