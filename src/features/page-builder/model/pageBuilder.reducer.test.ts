import { describe, expect, it } from 'vitest';
import type { PageBuilderDraft, PageBuilderState } from './pageBuilder.types';
import { createDefaultSeo } from './pageBuilder.defaults';
import { createPageBuilderState, pageBuilderReducer, isPageBuilderDirty } from './pageBuilder.reducer';

const baseDraft: PageBuilderDraft = {
  id: 'page_1',
  path: '/test',
  title: { zh: '测试', en: 'Test' },
  isFixed: false,
  type: 'dynamic-block',
  blocks: [
    { id: 'b1', type: 'carousel', content: {}, isVisible: true },
    { id: 'b2', type: 'textSection', content: { text: 'A' }, isVisible: true },
  ],
  seo: createDefaultSeo(),
};

function createInitialState(): PageBuilderState {
  return createPageBuilderState(baseDraft);
}

describe('createPageBuilderState', () => {
  it('sets draft and baseline to the same page', () => {
    const state = createInitialState();
    expect(state.draft.id).toBe('page_1');
    expect(state.baseline.id).toBe('page_1');
    expect(state.selectedPanel).toBeNull();
    expect(state.saveStatus).toBe('idle');
    expect(state.error).toBeNull();
  });
});

describe('pageBuilderReducer', () => {
  describe('select-panel', () => {
    it('sets the selected panel', () => {
      const state = createInitialState();
      const next = pageBuilderReducer(state, { type: 'select-panel', panel: { type: 'page-settings' } });
      expect(next.selectedPanel).toEqual({ type: 'page-settings' });
    });

    it('sets panel to null', () => {
      const state = { ...createInitialState(), selectedPanel: { type: 'page-settings' as const } };
      const next = pageBuilderReducer(state, { type: 'select-panel', panel: null });
      expect(next.selectedPanel).toBeNull();
    });
  });

  describe('add-block', () => {
    it('adds a block and selects it', () => {
      const state = createInitialState();
      const next = pageBuilderReducer(state, { type: 'add-block', blockType: 'gallery' });
      expect(next.draft.blocks).toHaveLength(3);
      expect(next.selectedPanel).toEqual({ type: 'block', blockId: next.draft.blocks[2].id });
    });

    it('returns error for unknown block type', () => {
      const state = createInitialState();
      const next = pageBuilderReducer(state, { type: 'add-block', blockType: 'unknown' as never });
      expect(next.error).toBeTruthy();
      expect(next.draft.blocks).toHaveLength(2);
    });

    it('returns error for duplicate singleton', () => {
      const state = createInitialState();
      const next = pageBuilderReducer(state, { type: 'add-block', blockType: 'carousel' });
      expect(next.error).toBeTruthy();
      expect(next.draft.blocks).toHaveLength(2);
    });
  });

  describe('remove-block', () => {
    it('removes block and clears selection if it was selected', () => {
      const state = { ...createInitialState(), selectedPanel: { type: 'block' as const, blockId: 'b1' } };
      const next = pageBuilderReducer(state, { type: 'remove-block', blockId: 'b1' });
      expect(next.draft.blocks).toHaveLength(1);
      expect(next.selectedPanel).toBeNull();
    });

    it('keeps selection if a different block is selected', () => {
      const state = { ...createInitialState(), selectedPanel: { type: 'block' as const, blockId: 'b2' } };
      const next = pageBuilderReducer(state, { type: 'remove-block', blockId: 'b1' });
      expect(next.draft.blocks).toHaveLength(1);
      expect(next.selectedPanel).toEqual({ type: 'block', blockId: 'b2' });
    });
  });

  describe('move-block', () => {
    it('moves block to target index', () => {
      const state = createInitialState();
      const next = pageBuilderReducer(state, { type: 'move-block', blockId: 'b2', targetIndex: 0 });
      expect(next.draft.blocks[0].id).toBe('b2');
    });

    it('preserves panel selection after move', () => {
      const state = { ...createInitialState(), selectedPanel: { type: 'block' as const, blockId: 'b2' } };
      const next = pageBuilderReducer(state, { type: 'move-block', blockId: 'b2', targetIndex: 0 });
      expect(next.selectedPanel).toEqual({ type: 'block', blockId: 'b2' });
    });
  });

  describe('toggle-block', () => {
    it('toggles block visibility', () => {
      const state = createInitialState();
      const next = pageBuilderReducer(state, { type: 'toggle-block', blockId: 'b1' });
      expect(next.draft.blocks[0].isVisible).toBe(false);
    });
  });

  describe('update-block', () => {
    it('updates block content', () => {
      const state = createInitialState();
      const next = pageBuilderReducer(state, { type: 'update-block', blockId: 'b2', content: { text: 'Updated' } });
      expect(next.draft.blocks[1].content).toEqual({ text: 'Updated' });
    });
  });

  describe('update-meta', () => {
    it('updates page metadata', () => {
      const state = createInitialState();
      const next = pageBuilderReducer(state, { type: 'update-meta', changes: { title: { zh: '新标题', en: 'New' } } });
      expect(next.draft.title.zh).toBe('新标题');
    });
  });

  describe('update-seo', () => {
    it('updates SEO', () => {
      const state = createInitialState();
      const newSeo = { title: { zh: '新SEO', en: 'New' }, description: { zh: '', en: '' }, keywords: { zh: '', en: '' }, targetCountry: '' };
      const next = pageBuilderReducer(state, { type: 'update-seo', seo: newSeo });
      expect(next.draft.seo.title.zh).toBe('新SEO');
    });
  });

  describe('save lifecycle', () => {
    it('transitions through save-started, save-succeeded, and resets baseline', () => {
      let state = createInitialState();

      state = pageBuilderReducer(state, { type: 'add-block', blockType: 'gallery' });
      expect(state.saveStatus).toBe('idle');

      state = pageBuilderReducer(state, { type: 'save-started' });
      expect(state.saveStatus).toBe('saving');

      state = pageBuilderReducer(state, { type: 'save-succeeded', page: state.draft });
      expect(state.saveStatus).toBe('saved');
      expect(state.baseline).toEqual(state.draft);
    });

    it('transitions through save-started and save-failed', () => {
      let state = createInitialState();
      state = pageBuilderReducer(state, { type: 'add-block', blockType: 'gallery' });

      state = pageBuilderReducer(state, { type: 'save-started' });
      state = pageBuilderReducer(state, { type: 'save-failed', message: '网络错误' });
      expect(state.saveStatus).toBe('error');
      expect(state.error).toBe('网络错误');
    });

    it('clears save feedback', () => {
      const state = { ...createInitialState(), saveStatus: 'saved' as const };
      const next = pageBuilderReducer(state, { type: 'clear-save-feedback' });
      expect(next.saveStatus).toBe('idle');
    });
  });

  describe('isDirty', () => {
    it('is false after initialization', () => {
      const state = createInitialState();
      expect(isPageBuilderDirty(state)).toBe(false);
    });

    it('is true after a modification', () => {
      let state = createInitialState();
      state = pageBuilderReducer(state, { type: 'add-block', blockType: 'gallery' });
      expect(isPageBuilderDirty(state)).toBe(true);
    });

    it('is false after save-succeeded', () => {
      let state = createInitialState();
      state = pageBuilderReducer(state, { type: 'add-block', blockType: 'gallery' });
      state = pageBuilderReducer(state, { type: 'save-started' });
      state = pageBuilderReducer(state, { type: 'save-succeeded', page: state.draft });
      expect(isPageBuilderDirty(state)).toBe(false);
    });
  });

  describe('replace-from-server', () => {
    it('replaces clean draft with server data', () => {
      const state = createInitialState();
      const updated: PageBuilderDraft = {
        ...baseDraft,
        title: { zh: '服务器更新', en: 'Server Update' },
      };
      const next = pageBuilderReducer(state, { type: 'replace-from-server', page: updated });
      expect(next.draft.title.zh).toBe('服务器更新');
      expect(next.baseline.title.zh).toBe('服务器更新');
    });

    it('does not replace dirty draft', () => {
      let state = createInitialState();
      state = pageBuilderReducer(state, { type: 'add-block', blockType: 'gallery' });
      const updated: PageBuilderDraft = {
        ...baseDraft,
        title: { zh: '服务器更新', en: 'Server Update' },
      };
      const next = pageBuilderReducer(state, { type: 'replace-from-server', page: updated });
      expect(next.draft.title.zh).toBe('测试');
    });
  });
});
