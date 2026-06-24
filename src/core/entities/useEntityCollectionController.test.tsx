import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createEntityQueryKeys } from './queryKeys';
import { useEntityCollectionController } from './useEntityCollectionController';

interface Widget {
  id: number;
  name: string;
}

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

describe('useEntityCollectionController', () => {
  it('loads a generic entity collection', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const load = vi.fn().mockResolvedValue([{ id: 1, name: 'One' }]);

    const { result } = renderHook(
      () => useEntityCollectionController({
        keys: createEntityQueryKeys<'widgets', number>('widgets'),
        operations: {
          load,
          create: vi.fn(),
          update: vi.fn(),
          remove: vi.fn(),
        },
      }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('runs mutations and invalidates the list family', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const create = vi.fn().mockResolvedValue({ id: 2 });
    const update = vi.fn().mockResolvedValue(undefined);
    const remove = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useEntityCollectionController<
        Widget,
        number,
        { name: string },
        { id: number; name: string },
        number
      >({
        keys: createEntityQueryKeys<'widgets', number>('widgets'),
        operations: {
          load: vi.fn().mockResolvedValue([]),
          create,
          update,
          remove,
        },
      }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.create({ name: 'Two' });
      await result.current.update({ id: 2, name: 'Updated' });
      await result.current.remove(2);
    });

    expect(create).toHaveBeenCalledWith({ name: 'Two' });
    expect(update).toHaveBeenCalledWith({ id: 2, name: 'Updated' });
    expect(remove).toHaveBeenCalledWith(2);
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['widgets', 'list'],
    });
  });

  it('exposes the active delete command while deletion is pending', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    let resolveDelete!: () => void;
    const remove = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        }),
    );
    const { result } = renderHook(
      () =>
        useEntityCollectionController<
          Widget,
          number,
          Widget,
          Widget,
          number
        >({
          keys: createEntityQueryKeys<'widgets', number>('widgets'),
          operations: {
            load: vi.fn().mockResolvedValue([]),
            create: vi.fn(),
            update: vi.fn(),
            remove,
          },
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => {
      void result.current.remove(2);
    });
    await waitFor(() => expect(result.current.isDeleting).toBe(true));
    expect(result.current.deleteCommand).toBe(2);

    await act(async () => resolveDelete());
  });
});
