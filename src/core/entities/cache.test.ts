import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import {
  invalidateEntityDetail,
  invalidateEntityLists,
  setEntityDetail,
  updateEntityDetail,
} from './cache';
import { createEntityQueryKeys } from './queryKeys';

describe('entity cache helpers', () => {
  const keys = createEntityQueryKeys<'widgets', number>('widgets');

  it('invalidates list and detail key families', async () => {
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');

    await invalidateEntityLists(client, keys);
    await invalidateEntityDetail(client, keys, 7);

    expect(invalidate).toHaveBeenNthCalledWith(1, {
      queryKey: ['widgets', 'list'],
    });
    expect(invalidate).toHaveBeenNthCalledWith(2, {
      queryKey: ['widgets', 'detail', 7],
    });
  });

  it('sets and updates one cached detail', () => {
    const client = new QueryClient();

    setEntityDetail(client, keys, 7, { id: 7, name: 'Before' });
    updateEntityDetail<{ id: number; name: string }, number>(
      client,
      keys,
      7,
      (current) => current ? { ...current, name: 'After' } : current,
    );

    expect(client.getQueryData(keys.detail(7))).toEqual({
      id: 7,
      name: 'After',
    });
  });
});
