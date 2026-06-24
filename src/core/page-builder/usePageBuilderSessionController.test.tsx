import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  reducePageBuilderSession,
  type PageBuilderSessionAction,
  type PageBuilderSessionState,
} from './session';
import { usePageBuilderSessionController } from './usePageBuilderSessionController';

interface Source {
  id: string;
  title: string;
}

type Draft = Source;
type Action =
  | PageBuilderSessionAction<Draft, string>
  | { type: 'rename'; title: string };

function reduce(
  state: PageBuilderSessionState<Draft, string>,
  action: Action,
) {
  if (action.type === 'rename') {
    return { ...state, draft: { ...state.draft, title: action.title } };
  }
  return reducePageBuilderSession(state, action);
}

const toDraft = (source: Source) => ({ ...source });
const originalSource: Source = { id: 'one', title: 'Original' };

describe('usePageBuilderSessionController', () => {
  it('initializes and replaces only a clean session from the same source', async () => {
    const { result, rerender } = renderHook(
      ({ source }) =>
        usePageBuilderSessionController({
          sourceKey: source.id,
          source,
          toDraft,
          reduce,
        }),
      { initialProps: { source: { id: 'one', title: 'Original' } } },
    );

    await waitFor(() => expect(result.current.state).not.toBeNull());
    rerender({ source: { id: 'one', title: 'Server' } });
    await waitFor(() =>
      expect(result.current.state?.draft.title).toBe('Server'),
    );

    act(() => result.current.dispatch({ type: 'rename', title: 'Local' }));
    rerender({ source: { id: 'one', title: 'New server value' } });
    expect(result.current.state?.draft.title).toBe('Local');
  });

  it('creates a new session when the source key changes', async () => {
    const { result, rerender } = renderHook(
      ({ source }) =>
        usePageBuilderSessionController({
          sourceKey: source.id,
          source,
          toDraft,
          reduce,
        }),
      { initialProps: { source: { id: 'one', title: 'One' } } },
    );

    await waitFor(() => expect(result.current.state).not.toBeNull());
    act(() => result.current.dispatch({ type: 'rename', title: 'Local' }));
    rerender({ source: { id: 'two', title: 'Two' } });

    await waitFor(() => expect(result.current.state?.draft.id).toBe('two'));
    expect(result.current.isDirty).toBe(false);
  });

  it('records draft changes and supports undo and redo', async () => {
    const { result } = renderHook(() =>
      usePageBuilderSessionController({
        sourceKey: 'one',
        source: originalSource,
        toDraft,
        reduce,
      }),
    );

    await waitFor(() => expect(result.current.state).not.toBeNull());
    act(() => result.current.dispatch({ type: 'rename', title: 'Changed' }));
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => result.current.undo());
    expect(result.current.state?.draft.title).toBe('Original');
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.redo());
    expect(result.current.state?.draft.title).toBe('Changed');
  });

  it('does not record selection-only session changes', async () => {
    const { result } = renderHook(() =>
      usePageBuilderSessionController({
        sourceKey: 'one',
        source: originalSource,
        toDraft,
        reduce,
      }),
    );

    await waitFor(() => expect(result.current.state).not.toBeNull());
    act(() =>
      result.current.dispatch({ type: 'select-panel', panel: 'settings' }),
    );

    expect(result.current.state?.selectedPanel).toBe('settings');
    expect(result.current.canUndo).toBe(false);
  });

  it('guards dirty browser and in-app exits', async () => {
    const confirmExit = vi.fn().mockReturnValue(false);
    const onConfirmed = vi.fn();
    const { result } = renderHook(() =>
      usePageBuilderSessionController({
        sourceKey: 'one',
        source: originalSource,
        toDraft,
        reduce,
        confirmExit,
      }),
    );

    await waitFor(() => expect(result.current.state).not.toBeNull());
    act(() => result.current.dispatch({ type: 'rename', title: 'Local' }));

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);

    result.current.requestExit(onConfirmed);
    expect(confirmExit).toHaveBeenCalled();
    expect(onConfirmed).not.toHaveBeenCalled();

    confirmExit.mockReturnValue(true);
    result.current.requestExit(onConfirmed);
    expect(onConfirmed).toHaveBeenCalledOnce();
  });

  it('clears saved feedback after the configured duration', async () => {
    const { result } = renderHook(() =>
      usePageBuilderSessionController({
        sourceKey: 'one',
        source: originalSource,
        toDraft,
        reduce,
        savedFeedbackDuration: 1,
      }),
    );

    await waitFor(() => expect(result.current.state).not.toBeNull());
    act(() =>
      result.current.dispatch({
        type: 'save-succeeded',
        page: { id: 'one', title: 'Original' },
      }),
    );
    expect(result.current.state?.saveStatus).toBe('saved');

    await waitFor(() => expect(result.current.state?.saveStatus).toBe('idle'));
  });
});
