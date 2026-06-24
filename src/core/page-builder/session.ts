export type PageBuilderPanel =
  | { type: 'page-settings' }
  | { type: 'seo-settings' }
  | { type: 'block'; blockId: string };

export type PageBuilderSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface PageBuilderSessionState<
  Draft,
  Panel = PageBuilderPanel,
> {
  draft: Draft;
  baseline: Draft;
  selectedPanel: Panel | null;
  saveStatus: PageBuilderSaveStatus;
  error: string | null;
}

export type PageBuilderSessionAction<
  Draft,
  Panel = PageBuilderPanel,
> =
  | { type: 'select-panel'; panel: Panel | null }
  | { type: 'save-started' }
  | { type: 'save-succeeded'; page: Draft }
  | { type: 'save-failed'; message: string }
  | { type: 'clear-save-feedback' }
  | { type: 'replace-from-server'; page: Draft };

export function createPageBuilderSessionState<
  Draft,
  Panel = PageBuilderPanel,
>(
  draft: Draft,
): PageBuilderSessionState<Draft, Panel> {
  return {
    draft: structuredClone(draft),
    baseline: structuredClone(draft),
    selectedPanel: null,
    saveStatus: 'idle',
    error: null,
  };
}

export function reducePageBuilderSession<
  Draft,
  Panel = PageBuilderPanel,
>(
  state: PageBuilderSessionState<Draft, Panel>,
  action: PageBuilderSessionAction<Draft, Panel>,
): PageBuilderSessionState<Draft, Panel> {
  switch (action.type) {
    case 'select-panel':
      return { ...state, selectedPanel: action.panel, error: null };

    case 'save-started':
      return { ...state, saveStatus: 'saving', error: null };

    case 'save-succeeded':
      return {
        ...state,
        draft: structuredClone(action.page),
        baseline: structuredClone(action.page),
        saveStatus: 'saved',
        error: null,
      };

    case 'save-failed':
      return { ...state, saveStatus: 'error', error: action.message };

    case 'clear-save-feedback':
      return { ...state, saveStatus: 'idle' };

    case 'replace-from-server':
      if (isPageBuilderSessionDirty(state)) return state;
      if (JSON.stringify(action.page) === JSON.stringify(state.baseline)) {
        return state;
      }
      return {
        ...state,
        draft: structuredClone(action.page),
        baseline: structuredClone(action.page),
      };
  }
}

export function isPageBuilderSessionDirty<Draft, Panel>(
  state: PageBuilderSessionState<Draft, Panel>,
): boolean {
  return JSON.stringify(state.draft) !== JSON.stringify(state.baseline);
}
