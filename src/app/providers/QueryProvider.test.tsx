import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { createAppQueryClient } from '../queryClient';
import { QueryProvider } from './QueryProvider';

function QueryClientProbe() {
  const client = useQueryClient();
  return <span>{client ? 'query-ready' : 'query-missing'}</span>;
}

describe('QueryProvider', () => {
  it('makes the supplied QueryClient available to descendants', () => {
    const client = createAppQueryClient();

    render(
      <QueryProvider client={client}>
        <QueryClientProbe />
      </QueryProvider>,
    );

    expect(screen.getByText('query-ready')).toBeInTheDocument();
  });
});
