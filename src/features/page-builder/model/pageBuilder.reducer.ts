import { nanoid } from 'nanoid';
import type { BlockType } from '@/types';
import type {
  PageBuilderDraft,
  PageBuilderPanel,
  PageBuilderState,
  PageSeo,
  PageMetaChanges,
} from './pageBuilder.types';
import {
  createBlock,
  addBlock,
  removeBlock,
  moveBlock,
  toggleBlockVisibility,
  updateBlockContent,
  updatePageMeta,
  updateSeo,
} from './blockCommands';
import {
  createPageBuilderSessionState,
  isPageBuilderSessionDirty,
  reducePageBuilderSession,
} from '@/core/page-builder';
import type { PageBuilderSessionAction } from '@/core/page-builder';

export type PageBuilderAction =
  | PageBuilderSessionAction<PageBuilderDraft, PageBuilderPanel>
  | { type: 'add-block'; blockType: BlockType }
  | { type: 'remove-block'; blockId: string }
  | { type: 'move-block'; blockId: string; targetIndex: number }
  | { type: 'toggle-block'; blockId: string }
  | { type: 'update-block'; blockId: string; content: unknown }
  | { type: 'update-meta'; changes: PageMetaChanges }
  | { type: 'update-seo'; seo: PageSeo };

export function createPageBuilderState(page: PageBuilderDraft): PageBuilderState {
  return createPageBuilderSessionState(page);
}

export function pageBuilderReducer(
  state: PageBuilderState,
  action: PageBuilderAction,
): PageBuilderState {
  switch (action.type) {
    case 'select-panel':
    case 'save-started':
    case 'save-succeeded':
    case 'save-failed':
    case 'clear-save-feedback':
    case 'replace-from-server':
      return reducePageBuilderSession(state, action);

    case 'add-block': {
      const created = createBlock(action.blockType, () => `block_${nanoid(8)}`);
      if (created.ok === false) {
        const errorMap: Record<string, string> = {
          UNKNOWN_BLOCK_TYPE: `未知积木类型: ${action.blockType}`,
          DUPLICATE_SINGLETON: '该类型积木只能添加一个',
        };
        return { ...state, error: errorMap[created.error] ?? '添加积木失败' };
      }
      const added = addBlock(state.draft, created.value);
      if (added.ok === false) {
        return { ...state, error: '添加积木失败' };
      }
      return {
        ...state,
        draft: added.value,
        selectedPanel: { type: 'block', blockId: created.value.id },
        error: null,
      };
    }

    case 'remove-block': {
      const removed = removeBlock(state.draft, action.blockId);
      if (!removed.ok) return { ...state, error: '积木不存在' };
      const panel = state.selectedPanel?.type === 'block' && state.selectedPanel.blockId === action.blockId
        ? null
        : state.selectedPanel;
      return { ...state, draft: removed.value, selectedPanel: panel, error: null };
    }

    case 'move-block': {
      const moved = moveBlock(state.draft, action.blockId, action.targetIndex);
      if (!moved.ok) return { ...state, error: '移动积木失败' };
      return { ...state, draft: moved.value, error: null };
    }

    case 'toggle-block': {
      const toggled = toggleBlockVisibility(state.draft, action.blockId);
      if (!toggled.ok) return { ...state, error: '积木不存在' };
      return { ...state, draft: toggled.value, error: null };
    }

    case 'update-block': {
      const updated = updateBlockContent(state.draft, action.blockId, action.content);
      if (!updated.ok) return { ...state, error: '积木不存在' };
      return { ...state, draft: updated.value, error: null };
    }

    case 'update-meta': {
      const updated = updatePageMeta(state.draft, action.changes);
      if (!updated.ok) return state;
      return { ...state, draft: updated.value, error: null };
    }

    case 'update-seo': {
      const updated = updateSeo(state.draft, action.seo);
      if (!updated.ok) return state;
      return { ...state, draft: updated.value, error: null };
    }

    default:
      return state;
  }
}

export function isPageBuilderDirty(state: PageBuilderState): boolean {
  return isPageBuilderSessionDirty(state);
}
