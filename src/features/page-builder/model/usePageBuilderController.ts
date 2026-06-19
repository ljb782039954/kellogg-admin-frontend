import { useEffect, useRef, useState, useCallback } from 'react';
import { useResolvedPage, useSavePage } from '@/features/pages';
import { toPageBuilderDraft, toSavablePage } from './pageBuilder.mapper';
import { getAvailableBlocks } from './blockCatalog';
import {
  createPageBuilderState,
  pageBuilderReducer,
  isPageBuilderDirty,
} from './pageBuilder.reducer';
import type {
  PageBuilderActions,
  PageBuilderState,
  PageBuilderViewModel,
  PageBuilderPanel,
  PageSeo,
  PageMetaChanges,
} from './pageBuilder.types';
import type { BlockType } from '@/types';
import type { PageBuilderAction } from './pageBuilder.reducer';

type ControllerResult =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'not-found' }
  | {
      status: 'ready';
      viewModel: PageBuilderViewModel;
      actions: PageBuilderActions;
    };

export function usePageBuilderController(
  pageId: string | undefined,
): ControllerResult {
  const { page, isLoading, error: pageError } = useResolvedPage(pageId);
  const { savePage, isSaving, error: saveError } = useSavePage();

  const [state, setState] = useState<PageBuilderState | null>(null);
  const prevPageIdRef = useRef(pageId);
  const initializedRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!page) return;

    if (initializedRef.current && prevPageIdRef.current === pageId) {
      setState((prev) => {
        if (!prev || isPageBuilderDirty(prev)) return prev;
        return pageBuilderReducer(prev, {
          type: 'replace-from-server',
          page: toPageBuilderDraft(page),
        });
      });
      return;
    }

    initializedRef.current = true;
    prevPageIdRef.current = pageId;
    setState(createPageBuilderState(toPageBuilderDraft(page)));
  }, [page, pageId]);

  useEffect(() => {
    if (state?.saveStatus !== 'saved') return;
    const timer = setTimeout(() => {
      dispatch({ type: 'clear-save-feedback' });
    }, 2000);
    return () => clearTimeout(timer);
  }, [state?.saveStatus]);

  useEffect(() => {
    if (!state) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (isPageBuilderDirty(state)) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state]);

  const dispatch = useCallback((action: PageBuilderAction) => {
    setState((prev) => {
      if (!prev) return prev;
      return pageBuilderReducer(prev, action);
    });
  }, []);

  const selectPanel = useCallback(
    (panel: PageBuilderPanel | null) => dispatch({ type: 'select-panel', panel }),
    [dispatch],
  );

  const addBlock = useCallback(
    (blockType: BlockType) => dispatch({ type: 'add-block', blockType }),
    [dispatch],
  );

  const removeBlock = useCallback(
    (blockId: string) => dispatch({ type: 'remove-block', blockId }),
    [dispatch],
  );

  const moveBlock = useCallback(
    (blockId: string, targetIndex: number) =>
      dispatch({ type: 'move-block', blockId, targetIndex }),
    [dispatch],
  );

  const toggleBlock = useCallback(
    (blockId: string) => dispatch({ type: 'toggle-block', blockId }),
    [dispatch],
  );

  const updateBlock = useCallback(
    (blockId: string, content: unknown) =>
      dispatch({ type: 'update-block', blockId, content }),
    [dispatch],
  );

  const updateMeta = useCallback(
    (changes: PageMetaChanges) => dispatch({ type: 'update-meta', changes }),
    [dispatch],
  );

  const updateSeo = useCallback(
    (seo: PageSeo) => dispatch({ type: 'update-seo', seo }),
    [dispatch],
  );

  const save = useCallback(async () => {
    const current = stateRef.current;
    if (!current) return;
    dispatch({ type: 'save-started' });
    try {
      const savable = toSavablePage(current.draft);
      await savePage(savable);
      dispatch({ type: 'save-succeeded', page: current.draft });
    } catch (err) {
      dispatch({
        type: 'save-failed',
        message: err instanceof Error ? err.message : '保存失败',
      });
    }
  }, [savePage, dispatch]);

  const requestExit = useCallback(
    (onConfirmed: () => void) => {
      const current = stateRef.current;
      if (!current || !isPageBuilderDirty(current)) {
        onConfirmed();
        return;
      }
      if (window.confirm('有未保存的修改，确定要离开吗？')) {
        onConfirmed();
      }
    },
    [],
  );

  if (pageError) {
    return { status: 'error', error: pageError.message };
  }

  if (isLoading) {
    return { status: 'loading' };
  }

  if (!page) {
    return { status: 'not-found' };
  }

  if (!state) {
    return { status: 'loading' };
  }

  const isFixedLayout = page.type === 'fixed-layout';
  const dirty = isPageBuilderDirty(state);

  const selPanel = state.selectedPanel;
  const selectedBlock = selPanel?.type === 'block'
    ? state.draft.blocks.find((b) => b.id === selPanel.blockId)
    : undefined;

  const viewModel: PageBuilderViewModel = {
    page: state.draft,
    selectedPanel: state.selectedPanel,
    selectedBlock,
    availableBlocks: getAvailableBlocks(state.draft.blocks),
    isFixedLayout,
    isDirty: dirty,
    canSave: dirty && !isFixedLayout && !isSaving,
    isSaving,
    saveStatus: state.saveStatus,
    error: state.error ?? (saveError?.message ?? null),
  };

  const actions: PageBuilderActions = {
    selectPanel,
    addBlock,
    removeBlock,
    moveBlock,
    toggleBlock,
    updateBlock,
    updateMeta,
    updateSeo,
    save,
    requestExit,
  };

  return { status: 'ready', viewModel, actions };
}
