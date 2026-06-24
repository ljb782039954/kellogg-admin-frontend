import { describe, expect, it } from 'vitest';
import {
  createPageBuilderHistory,
  recordPageBuilderHistory,
  redoPageBuilderHistory,
  undoPageBuilderHistory,
} from './history';

interface Draft {
  title: string;
}

describe('core/page-builder history', () => {
  it('records past drafts and clears the redo stack', () => {
    const recorded = recordPageBuilderHistory(
      {
        past: [{ title: 'Earlier' }],
        future: [{ title: 'Future' }],
      },
      { title: 'Current' },
    );

    expect(recorded).toEqual({
      past: [{ title: 'Earlier' }, { title: 'Current' }],
      future: [],
    });
  });

  it('undoes and redoes draft changes', () => {
    const history = recordPageBuilderHistory(
      createPageBuilderHistory<Draft>(),
      { title: 'Original' },
    );
    const undone = undoPageBuilderHistory({ title: 'Changed' }, history);

    expect(undone?.draft.title).toBe('Original');
    expect(undone?.history.future).toEqual([{ title: 'Changed' }]);

    const redone = redoPageBuilderHistory(
      undone!.draft,
      undone!.history,
    );
    expect(redone?.draft.title).toBe('Changed');
    expect(redone?.history.future).toEqual([]);
  });

  it('enforces the configured history limit', () => {
    let history = createPageBuilderHistory<Draft>();
    history = recordPageBuilderHistory(history, { title: 'One' }, 2);
    history = recordPageBuilderHistory(history, { title: 'Two' }, 2);
    history = recordPageBuilderHistory(history, { title: 'Three' }, 2);

    expect(history.past).toEqual([{ title: 'Two' }, { title: 'Three' }]);
  });

  it('returns null when no undo or redo step exists', () => {
    const history = createPageBuilderHistory<Draft>();

    expect(undoPageBuilderHistory({ title: 'Current' }, history)).toBeNull();
    expect(redoPageBuilderHistory({ title: 'Current' }, history)).toBeNull();
  });
});
