import { describe, expect, it, vi } from 'vitest';
import type { PageBuilderSessionAction } from './session';
import { runPageBuilderSave } from './saveWorkflow';

interface TestDraft {
  id: string;
  title: string;
}

describe('core/page-builder save workflow', () => {
  it('serializes, persists and reports a successful save', async () => {
    const draft: TestDraft = { id: 'page_1', title: 'Draft' };
    const actions: PageBuilderSessionAction<TestDraft>[] = [];
    const serialize = vi.fn((value: TestDraft) => ({
      key: value.id,
      label: value.title,
    }));
    const persist = vi.fn().mockResolvedValue(undefined);

    const saved = await runPageBuilderSave({
      draft,
      serialize,
      persist,
      dispatch: (action) => actions.push(action),
    });

    expect(saved).toBe(true);
    expect(serialize).toHaveBeenCalledWith(draft);
    expect(persist).toHaveBeenCalledWith({
      key: 'page_1',
      label: 'Draft',
    });
    expect(actions).toEqual([
      { type: 'save-started' },
      { type: 'save-succeeded', page: draft },
    ]);
  });

  it('reports Error messages without marking the save successful', async () => {
    const draft: TestDraft = { id: 'page_1', title: 'Draft' };
    const actions: PageBuilderSessionAction<TestDraft>[] = [];

    const saved = await runPageBuilderSave({
      draft,
      serialize: (value) => value,
      persist: async () => {
        throw new Error('network failed');
      },
      dispatch: (action) => actions.push(action),
    });

    expect(saved).toBe(false);
    expect(actions).toEqual([
      { type: 'save-started' },
      { type: 'save-failed', message: 'network failed' },
    ]);
  });

  it('uses the injected fallback for non-Error failures', async () => {
    const actions: PageBuilderSessionAction<TestDraft>[] = [];

    await runPageBuilderSave({
      draft: { id: 'page_1', title: 'Draft' },
      serialize: (value) => value,
      persist: async () => {
        throw 'failed';
      },
      dispatch: (action) => actions.push(action),
      fallbackErrorMessage: '无法保存页面',
    });

    expect(actions.at(-1)).toEqual({
      type: 'save-failed',
      message: '无法保存页面',
    });
  });
});
