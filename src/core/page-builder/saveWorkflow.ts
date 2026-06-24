import type { PageBuilderSessionAction } from './session';

export interface PageBuilderSaveWorkflowOptions<Draft, Payload> {
  draft: Draft;
  serialize(draft: Draft): Payload;
  persist(payload: Payload): Promise<unknown>;
  dispatch(action: PageBuilderSessionAction<Draft>): void;
  fallbackErrorMessage?: string;
}

export async function runPageBuilderSave<Draft, Payload>({
  draft,
  serialize,
  persist,
  dispatch,
  fallbackErrorMessage = '保存失败',
}: PageBuilderSaveWorkflowOptions<Draft, Payload>): Promise<boolean> {
  dispatch({ type: 'save-started' });

  try {
    await persist(serialize(draft));
    dispatch({ type: 'save-succeeded', page: draft });
    return true;
  } catch (error) {
    dispatch({
      type: 'save-failed',
      message: error instanceof Error ? error.message : fallbackErrorMessage,
    });
    return false;
  }
}
