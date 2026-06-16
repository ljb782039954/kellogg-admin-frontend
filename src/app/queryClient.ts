import { QueryClient } from '@tanstack/react-query';
import { isAppError } from '@/shared/api/errors';

function shouldRetryQuery(failureCount: number, error: Error): boolean {
  if (isAppError(error) && error.status !== undefined && error.status < 500) {
    return false;
  }

  return failureCount < 1;
}

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryClient = createAppQueryClient();
