import { describe, expect, it } from 'vitest';
import {
  createPageBuilderSessionState,
  isPageBuilderSessionDirty,
  reducePageBuilderSession,
} from './session';

interface TestDraft {
  id: string;
  title: string;
}

const draft: TestDraft = { id: 'page_1', title: 'Original' };

describe('core/page-builder session', () => {
  it('clones the initial draft and baseline', () => {
    const state = createPageBuilderSessionState(draft);

    expect(state.draft).toEqual(draft);
    expect(state.draft).not.toBe(draft);
    expect(state.baseline).not.toBe(state.draft);
    expect(isPageBuilderSessionDirty(state)).toBe(false);
  });

  it('tracks panel selection and save lifecycle', () => {
    let state = createPageBuilderSessionState(draft);
    state = reducePageBuilderSession(state, {
      type: 'select-panel',
      panel: { type: 'page-settings' },
    });
    expect(state.selectedPanel).toEqual({ type: 'page-settings' });

    state = reducePageBuilderSession(state, { type: 'save-started' });
    expect(state.saveStatus).toBe('saving');

    state = reducePageBuilderSession(state, {
      type: 'save-failed',
      message: 'network',
    });
    expect(state).toMatchObject({ saveStatus: 'error', error: 'network' });
  });

  it('resets baseline after save succeeds', () => {
    const state = reducePageBuilderSession(
      createPageBuilderSessionState(draft),
      {
        type: 'save-succeeded',
        page: { ...draft, title: 'Saved' },
      },
    );

    expect(state.saveStatus).toBe('saved');
    expect(state.draft).toEqual(state.baseline);
    expect(isPageBuilderSessionDirty(state)).toBe(false);
  });

  it('replaces only a clean draft with server state', () => {
    const clean = createPageBuilderSessionState(draft);
    expect(
      reducePageBuilderSession(clean, {
        type: 'replace-from-server',
        page: { ...draft },
      }),
    ).toBe(clean);

    const replaced = reducePageBuilderSession(clean, {
      type: 'replace-from-server',
      page: { ...draft, title: 'Server' },
    });
    expect(replaced.draft.title).toBe('Server');

    const dirty = {
      ...clean,
      draft: { ...clean.draft, title: 'Local' },
    };
    expect(reducePageBuilderSession(dirty, {
      type: 'replace-from-server',
      page: { ...draft, title: 'Server' },
    })).toBe(dirty);
  });
});
