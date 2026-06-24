export interface PageBuilderHistoryState<Draft> {
  past: Draft[];
  future: Draft[];
}

export interface PageBuilderHistoryStep<Draft> {
  draft: Draft;
  history: PageBuilderHistoryState<Draft>;
}

export function createPageBuilderHistory<Draft>(): PageBuilderHistoryState<Draft> {
  return { past: [], future: [] };
}

export function recordPageBuilderHistory<Draft>(
  history: PageBuilderHistoryState<Draft>,
  previousDraft: Draft,
  limit = 50,
): PageBuilderHistoryState<Draft> {
  return {
    past: [...history.past, structuredClone(previousDraft)].slice(-limit),
    future: [],
  };
}

export function undoPageBuilderHistory<Draft>(
  currentDraft: Draft,
  history: PageBuilderHistoryState<Draft>,
): PageBuilderHistoryStep<Draft> | null {
  const previous = history.past.at(-1);
  if (previous === undefined) return null;

  return {
    draft: structuredClone(previous),
    history: {
      past: history.past.slice(0, -1),
      future: [structuredClone(currentDraft), ...history.future],
    },
  };
}

export function redoPageBuilderHistory<Draft>(
  currentDraft: Draft,
  history: PageBuilderHistoryState<Draft>,
): PageBuilderHistoryStep<Draft> | null {
  const next = history.future[0];
  if (next === undefined) return null;

  return {
    draft: structuredClone(next),
    history: {
      past: [...history.past, structuredClone(currentDraft)],
      future: history.future.slice(1),
    },
  };
}
