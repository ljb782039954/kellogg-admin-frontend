import { render, screen } from '@testing-library/react';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { createAppQueryClient } from '../queryClient';
import { QueryProvider } from './QueryProvider';

function QueryClientProbe({ expectedClient }: { expectedClient: QueryClient }) {
  const client = useQueryClient();
  return (
    <span>
      {client === expectedClient ? 'query-ready' : 'query-mismatch'}
    </span>
  );
}

describe('QueryProvider', () => {
  it('makes the supplied QueryClient available to descendants', () => {
    const client = createAppQueryClient();

    render(
      <QueryProvider client={client}>
        <QueryClientProbe expectedClient={client} />
      </QueryProvider>,
    );

    expect(screen.getByText('query-ready')).toBeInTheDocument();
  });
});
