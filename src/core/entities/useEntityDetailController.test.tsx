import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useEntityDetailController } from './useEntityDetailController';

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

describe('useEntityDetailController', () => {
  it('loads an enabled entity detail', async () => {
    const { Wrapper } = createWrapper();
    const load = vi.fn().mockResolvedValue({ id: 'one', name: 'One' });
    const { result } = renderHook(
      () =>
        useEntityDetailController({
          id: 'one',
          enabled: true,
          keys: { detail: (id: string) => ['entities', 'detail', id] },
          load,
        }),
      { wrapper: Wrapper },
    );

    await waitFor(() =>
      expect(result.current.model).toEqual({ id: 'one', name: 'One' }),
    );
    expect(load).toHaveBeenCalledWith('one');
  });

  it('does not load a disabled detail', () => {
    const { Wrapper } = createWrapper();
    const load = vi.fn();
    const { result } = renderHook(
      () =>
        useEntityDetailController({
          id: undefined,
          enabled: false,
          keys: { detail: (id: string) => ['entities', 'detail', id] },
          load,
        }),
      { wrapper: Wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(load).not.toHaveBeenCalled();
  });
});
