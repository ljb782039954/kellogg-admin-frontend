import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createEntityQueryKeys } from './queryKeys';
import { usePaginatedEntityListController } from './usePaginatedEntityListController';

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

describe('usePaginatedEntityListController', () => {
  it('loads and selects generic paginated data', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const filters = { page: 2, search: 'shirt' };
    interface Response {
      rows: Array<{ id: number; name: string }>;
      meta: { page: number; total: number };
    }
    const load = vi.fn<() => Promise<Response>>().mockResolvedValue({
      rows: [{ id: 1, name: 'One' }],
      meta: { page: 2, total: 11 },
    });

    const { result } = renderHook(
      () => usePaginatedEntityListController<
        { id: number; name: string },
        typeof filters,
        Response,
        Response['meta']
      >({
        keys: createEntityQueryKeys<
          'widgets',
          number,
          typeof filters
        >('widgets'),
        filters,
        load,
        select: (response) => ({
          items: response.rows,
          pagination: response.meta,
        }),
      }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(load).toHaveBeenCalledWith(filters);
    expect(result.current.pagination).toEqual({ page: 2, total: 11 });
  });

  it('runs configured mutations and invalidates the list family', async () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const update = vi.fn().mockResolvedValue({ ok: true });
    const remove = vi.fn().mockResolvedValue({ ok: true });
    const filters = { page: 1 };

    const { result } = renderHook(
      () => usePaginatedEntityListController<
        { id: number },
        typeof filters,
        { rows: Array<{ id: number }>; total: number },
        { total: number },
        { id: number; active: boolean },
        number
      >({
        keys: createEntityQueryKeys<'widgets', number, typeof filters>(
          'widgets',
        ),
        filters,
        load: async () => ({ rows: [], total: 0 }),
        select: (response) => ({
          items: response.rows,
          pagination: { total: response.total },
        }),
        mutations: {
          update: { execute: update },
          remove: { execute: remove },
        },
      }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.update({ id: 1, active: true });
      await result.current.remove(1);
    });

    expect(update).toHaveBeenCalledWith({ id: 1, active: true });
    expect(remove).toHaveBeenCalledWith(1);
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['widgets', 'list'],
    });
  });
});
