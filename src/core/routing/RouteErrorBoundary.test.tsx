import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RouteErrorBoundary } from './RouteErrorBoundary';

function BrokenScreen(): never {
  throw new Error('screen failed');
}

describe('RouteErrorBoundary', () => {
  it('renders the project error page for screen failures', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(
      <RouteErrorBoundary
        ErrorPage={({ error }) => (
          <div>project error: {(error as Error).message}</div>
        )}
      >
        <BrokenScreen />
      </RouteErrorBoundary>,
    );

    expect(screen.getByText('project error: screen failed')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
