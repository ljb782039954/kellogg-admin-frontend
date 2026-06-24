import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useEntityMutationController } from './useEntityMutationController';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return {
    client,
    Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      );
    },
  };
}

describe('useEntityMutationController', () => {
  it('executes a mutation, caches its model and invalidates lists', async () => {
    const { Wrapper, client } = createWrapper();
    const execute = vi.fn(async (model: { id: string; name: string }) => model);
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    const { result } = renderHook(
      () =>
        useEntityMutationController({
          keys: {
            lists: () => ['entities', 'list'],
            detail: (id: string) => ['entities', 'detail', id],
          },
          execute,
          resolveId: (model) => model.id,
          selectModel: (model) => model,
        }),
      { wrapper: Wrapper },
    );

    const model = { id: 'one', name: 'One' };
    await act(async () => result.current.mutate(model));

    expect(client.getQueryData(['entities', 'detail', 'one'])).toEqual(model);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['entities', 'list'],
    });
  });

  it('exposes execution errors', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(
      () =>
        useEntityMutationController({
          keys: {
            lists: () => ['entities', 'list'],
            detail: (id: string) => ['entities', 'detail', id],
          },
          execute: async () => {
            throw new Error('save failed');
          },
          resolveId: () => 'one',
        }),
      { wrapper: Wrapper },
    );

    await act(async () => {
      await expect(result.current.mutate(undefined)).rejects.toThrow(
        'save failed',
      );
    });
    await waitFor(() =>
      expect(result.current.error?.message).toBe('save failed'),
    );
  });
});
