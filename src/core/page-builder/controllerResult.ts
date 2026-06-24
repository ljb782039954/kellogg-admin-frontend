export type PageBuilderLoadResult<Source, Session> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'not-found' }
  | { status: 'ready'; source: Source; session: Session };

export interface ResolvePageBuilderLoadOptions<Source, Session> {
  source: Source | undefined;
  session: Session | null;
  isLoading: boolean;
  error: Error | string | null;
}

export function resolvePageBuilderLoadResult<Source, Session>({
  source,
  session,
  isLoading,
  error,
}: ResolvePageBuilderLoadOptions<Source, Session>): PageBuilderLoadResult<
  Source,
  Session
> {
  if (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : error,
    };
  }
  if (isLoading || (source !== undefined && session === null)) {
    return { status: 'loading' };
  }
  if (source === undefined) {
    return { status: 'not-found' };
  }
  return { status: 'ready', source, session: session as Session };
}
