import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createEntityQueryKeys } from './queryKeys';
import { useEntityEditorController } from './useEntityEditorController';

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

describe('useEntityEditorController', () => {
  it('loads and updates an existing entity', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const invalidate = vi.spyOn(client, 'invalidateQueries');
    const load = vi.fn().mockResolvedValue({ id: 7, name: 'Before' });
    const update = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useEntityEditorController<Widget, number, { name: string }>({
        id: 7,
        enabled: true,
        keys: createEntityQueryKeys<'widgets', number>('widgets'),
        operations: {
          load,
          create: vi.fn(),
          update,
        },
      }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.model?.name).toBe('Before'));
    await act(async () => {
      await result.current.save({ name: 'After' });
    });

    expect(update).toHaveBeenCalledWith(7, { name: 'After' });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['widgets', 'list'],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['widgets', 'detail', 7],
    });
  });

  it('creates without loading when editing is disabled', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const load = vi.fn();
    const create = vi.fn().mockResolvedValue(8);
    const onSaved = vi.fn();

    const { result } = renderHook(
      () => useEntityEditorController<Widget, number, { name: string }>({
        id: undefined,
        enabled: false,
        keys: createEntityQueryKeys<'widgets', number>('widgets'),
        operations: {
          load,
          create,
          update: vi.fn(),
        },
        onSaved,
      }),
      { wrapper: createWrapper(client) },
    );

    await act(async () => {
      await result.current.save({ name: 'New' });
    });

    expect(load).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith({ name: 'New' });
    expect(onSaved).toHaveBeenCalledWith(8, 8);
  });

  it('extracts id and writes a returned model to detail cache', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const keys = createEntityQueryKeys<'widgets', number>('widgets');
    const saved: Widget = { id: 9, name: 'Created' };

    const { result } = renderHook(
      () => useEntityEditorController<
        Widget,
        number,
        { name: string },
        Widget
      >({
        id: undefined,
        enabled: false,
        keys,
        operations: {
          load: vi.fn(),
          create: vi.fn().mockResolvedValue(saved),
          update: vi.fn(),
        },
        resolveSavedId: (model) => model.id,
        selectSavedModel: (model) => model,
      }),
      { wrapper: createWrapper(client) },
    );

    await act(async () => {
      await result.current.save({ name: 'Created' });
    });

    expect(client.getQueryData(keys.detail(9))).toEqual(saved);
  });
});
