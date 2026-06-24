import { useCallback } from 'react';
import { useResolvedPage, useSavePage } from '@/features/pages';
import { toPageBuilderDraft, toSavablePage } from './pageBuilder.mapper';
import { getAvailableBlocks } from './blockCatalog';
import { pageBuilderReducer } from './pageBuilder.reducer';
import type {
  PageBuilderActions,
  PageBuilderDraft,
  PageBuilderViewModel,
  PageBuilderPanel,
  PageBuilderState,
  PageSeo,
  PageMetaChanges,
} from './pageBuilder.types';
import type { BlockType } from '@/types';
import {
  resolvePageBuilderLoadResult,
  runPageBuilderSave,
  usePageBuilderSessionController,
} from '@/core/page-builder';

type ControllerResult =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'not-found' }
  | {
      status: 'ready';
      viewModel: PageBuilderViewModel;
      actions: PageBuilderActions;
    };

function restorePageBuilderDraft(
  state: PageBuilderState,
  draft: PageBuilderDraft,
): PageBuilderState {
  const currentPanel = state.selectedPanel;
  const selectedPanel =
    currentPanel?.type === 'block' &&
    !draft.blocks.some((block) => block.id === currentPanel.blockId)
      ? null
      : currentPanel;
  return { ...state, draft, selectedPanel, error: null };
}

export function usePageBuilderController(
  pageId: string | undefined,
): ControllerResult {
  const { page, isLoading, error: pageError } = useResolvedPage(pageId);
  const { savePage, isSaving, error: saveError } = useSavePage();

  const {
    state,
    stateRef,
    dispatch,
    isDirty: dirty,
    canUndo,
    canRedo,
    undo,
    redo,
    requestExit,
  } = usePageBuilderSessionController({
    sourceKey: pageId,
    source: page,
    toDraft: toPageBuilderDraft,
    reduce: pageBuilderReducer,
    restoreDraft: restorePageBuilderDraft,
  });

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

    await runPageBuilderSave({
      draft: current.draft,
      serialize: toSavablePage,
      persist: savePage,
      dispatch,
    });
  }, [savePage, dispatch, stateRef]);

  const loadResult = resolvePageBuilderLoadResult({
    source: page,
    session: state,
    isLoading,
    error: pageError,
  });
  if (loadResult.status !== 'ready') return loadResult;

  const readyPage = loadResult.source;
  const readyState = loadResult.session;
  const isFixedLayout = readyPage.type === 'fixed-layout';

  const selPanel = readyState.selectedPanel;
  const selectedBlock = selPanel?.type === 'block'
    ? readyState.draft.blocks.find((block) => block.id === selPanel.blockId)
    : undefined;

  const viewModel: PageBuilderViewModel = {
    page: readyState.draft,
    selectedPanel: readyState.selectedPanel,
    selectedBlock,
    availableBlocks: getAvailableBlocks(state.draft.blocks),
    isFixedLayout,
    isDirty: dirty,
    canSave: dirty && !isFixedLayout && !isSaving,
    canUndo,
    canRedo,
    isSaving,
    saveStatus: readyState.saveStatus,
    error: readyState.error ?? (saveError?.message ?? null),
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
    undo,
    redo,
    save,
    requestExit,
  };

  return { status: 'ready', viewModel, actions };
}
