import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createPageBuilderSessionState,
  isPageBuilderSessionDirty,
  reducePageBuilderSession,
} from './session';
import type {
  PageBuilderSessionState,
  PageBuilderSaveStatus,
} from './session';
import {
  createPageBuilderHistory,
  recordPageBuilderHistory,
  redoPageBuilderHistory,
  undoPageBuilderHistory,
} from './history';
import type { PageBuilderHistoryState } from './history';

interface PageBuilderControllerState<Draft, Panel> {
  session: PageBuilderSessionState<Draft, Panel>;
  history: PageBuilderHistoryState<Draft>;
}

function restoreSessionDraft<Draft, Panel>(
  state: PageBuilderSessionState<Draft, Panel>,
  draft: Draft,
): PageBuilderSessionState<Draft, Panel> {
  return { ...state, draft };
}

export interface PageBuilderSessionControllerOptions<
  Source,
  Draft,
  Panel,
  Action,
> {
  sourceKey: unknown;
  source: Source | undefined;
  toDraft(source: Source): Draft;
  reduce(
    state: PageBuilderSessionState<Draft, Panel>,
    action: Action,
  ): PageBuilderSessionState<Draft, Panel>;
  savedFeedbackDuration?: number;
  exitConfirmationMessage?: string;
  confirmExit?(message: string): boolean;
  historyLimit?: number;
  restoreDraft?(
    state: PageBuilderSessionState<Draft, Panel>,
    draft: Draft,
  ): PageBuilderSessionState<Draft, Panel>;
}

export function usePageBuilderSessionController<
  Source,
  Draft,
  Panel,
  Action,
>({
  sourceKey,
  source,
  toDraft,
  reduce,
  savedFeedbackDuration = 2000,
  exitConfirmationMessage = '有未保存的修改，确定要离开吗？',
  confirmExit = (message) => window.confirm(message),
  historyLimit = 50,
  restoreDraft = restoreSessionDraft,
}: PageBuilderSessionControllerOptions<Source, Draft, Panel, Action>) {
  const [controllerState, setControllerState] =
    useState<PageBuilderControllerState<Draft, Panel> | null>(null);
  const state = controllerState?.session ?? null;
  const history = controllerState?.history ?? createPageBuilderHistory<Draft>();
  const previousSourceKeyRef = useRef(sourceKey);
  const initializedRef = useRef(false);
  const stateRef = useRef(state);

  const dispatch = useCallback(
    (action: Action) => {
      setControllerState((current) => {
        if (!current) return current;
        const nextSession = reduce(current.session, action);
        if (
          JSON.stringify(nextSession.draft) ===
          JSON.stringify(current.session.draft)
        ) {
          return nextSession === current.session
            ? current
            : { ...current, session: nextSession };
        }
        return {
          session: nextSession,
          history: recordPageBuilderHistory(
            current.history,
            current.session.draft,
            historyLimit,
          ),
        };
      });
    },
    [historyLimit, reduce],
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!source) return;

    const draft = toDraft(source);
    if (
      initializedRef.current &&
      previousSourceKeyRef.current === sourceKey
    ) {
      setControllerState((current) => {
        if (!current) return current;
        const session = reducePageBuilderSession(current.session, {
          type: 'replace-from-server',
          page: draft,
        });
        return session === current.session
          ? current
          : {
              session,
              history: createPageBuilderHistory(),
            };
      });
      return;
    }

    initializedRef.current = true;
    previousSourceKeyRef.current = sourceKey;
    setControllerState({
      session: createPageBuilderSessionState<Draft, Panel>(draft),
      history: createPageBuilderHistory(),
    });
  }, [source, sourceKey, toDraft]);

  const saveStatus: PageBuilderSaveStatus | undefined = state?.saveStatus;
  useEffect(() => {
    if (saveStatus !== 'saved') return;
    const timer = window.setTimeout(() => {
      setControllerState((current) =>
        current
          ? {
              ...current,
              session: reducePageBuilderSession(current.session, {
                type: 'clear-save-feedback',
              }),
            }
          : current,
      );
    }, savedFeedbackDuration);
    return () => window.clearTimeout(timer);
  }, [saveStatus, savedFeedbackDuration]);

  const dirty = state ? isPageBuilderSessionDirty(state) : false;
  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  const requestExit = useCallback(
    (onConfirmed: () => void) => {
      const current = stateRef.current;
      if (!current || !isPageBuilderSessionDirty(current)) {
        onConfirmed();
        return;
      }
      if (confirmExit(exitConfirmationMessage)) {
        onConfirmed();
      }
    },
    [confirmExit, exitConfirmationMessage],
  );

  const undo = useCallback(() => {
    setControllerState((current) => {
      if (!current) return current;
      const step = undoPageBuilderHistory(
        current.session.draft,
        current.history,
      );
      if (!step) return current;
      return {
        session: restoreDraft(current.session, step.draft),
        history: step.history,
      };
    });
  }, [restoreDraft]);

  const redo = useCallback(() => {
    setControllerState((current) => {
      if (!current) return current;
      const step = redoPageBuilderHistory(
        current.session.draft,
        current.history,
      );
      if (!step) return current;
      return {
        session: restoreDraft(current.session, step.draft),
        history: step.history,
      };
    });
  }, [restoreDraft]);

  return {
    state,
    stateRef,
    dispatch,
    isDirty: dirty,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undo,
    redo,
    requestExit,
  };
}
