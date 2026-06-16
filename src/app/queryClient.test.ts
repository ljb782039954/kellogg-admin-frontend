import { describe, expect, it } from 'vitest';
import { AppError } from '@/shared/api/errors';
import { createAppQueryClient } from './queryClient';

describe('createAppQueryClient', () => {
  it('uses conservative server-state defaults', () => {
    const client = createAppQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.queries?.staleTime).toBe(30_000);
    expect(defaults.queries?.gcTime).toBe(5 * 60_000);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.mutations?.retry).toBe(0);
  });

  it('does not retry client-side HTTP errors', () => {
    const client = createAppQueryClient();
    const retry = client.getDefaultOptions().queries?.retry;
    const error = new AppError({
      code: 'HTTP_ERROR',
      message: 'Bad request',
      status: 400,
    });

    expect(typeof retry).toBe('function');
    expect((retry as (failureCount: number, error: Error) => boolean)(0, error)).toBe(false);
  });
});
