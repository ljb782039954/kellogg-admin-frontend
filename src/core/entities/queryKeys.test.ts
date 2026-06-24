import { describe, expect, it } from 'vitest';
import { createEntityQueryKeys } from './queryKeys';

describe('createEntityQueryKeys', () => {
  const keys = createEntityQueryKeys<
    'widgets',
    number,
    { page: number; status?: string }
  >('widgets');

  it('creates stable list key families', () => {
    expect(keys.all).toEqual(['widgets']);
    expect(keys.lists()).toEqual(['widgets', 'list']);
    expect(keys.list({ page: 2, status: 'active' })).toEqual([
      'widgets',
      'list',
      { page: 2, status: 'active' },
    ]);
  });

  it('creates stable detail key families', () => {
    expect(keys.details()).toEqual(['widgets', 'detail']);
    expect(keys.detail(42)).toEqual(['widgets', 'detail', 42]);
  });
});
