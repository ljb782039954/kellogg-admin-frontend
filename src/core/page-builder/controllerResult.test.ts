import { describe, expect, it } from 'vitest';
import { resolvePageBuilderLoadResult } from './controllerResult';

describe('resolvePageBuilderLoadResult', () => {
  it('prioritizes errors over loading state', () => {
    expect(
      resolvePageBuilderLoadResult({
        source: undefined,
        session: null,
        isLoading: true,
        error: new Error('load failed'),
      }),
    ).toEqual({ status: 'error', error: 'load failed' });
  });

  it('keeps loading until a source session is initialized', () => {
    expect(
      resolvePageBuilderLoadResult({
        source: { id: 'one' },
        session: null,
        isLoading: false,
        error: null,
      }),
    ).toEqual({ status: 'loading' });
  });

  it('distinguishes not-found and ready states', () => {
    expect(
      resolvePageBuilderLoadResult({
        source: undefined,
        session: null,
        isLoading: false,
        error: null,
      }),
    ).toEqual({ status: 'not-found' });

    expect(
      resolvePageBuilderLoadResult({
        source: { id: 'one' },
        session: { draft: 'ready' },
        isLoading: false,
        error: null,
      }),
    ).toEqual({
      status: 'ready',
      source: { id: 'one' },
      session: { draft: 'ready' },
    });
  });
});
