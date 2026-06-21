import { describe, it, expect } from 'vitest';
import { createAppQueryClient, queryClient } from './queryClient';

describe('core/app queryClient', () => {
  it('createAppQueryClient 返回带默认配置的 QueryClient', () => {
    const client = createAppQueryClient();
    expect(client.getDefaultOptions().queries?.staleTime).toBe(30_000);
  });

  it('导出单例 queryClient', () => {
    expect(queryClient).toBeDefined();
  });
});
