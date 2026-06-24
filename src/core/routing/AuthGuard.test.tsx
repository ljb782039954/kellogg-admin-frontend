import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthGuard } from './AuthGuard';

const ErrorPage = ({ error }: { error?: unknown }) => (
  <div>error: {(error as Error).message}</div>
);

describe('AuthGuard', () => {
  it('renders children when authentication is not configured', () => {
    render(
      <AuthGuard
        LoginPage={() => <div>login</div>}
        ErrorPage={ErrorPage}
      >
        <div>protected</div>
      </AuthGuard>,
    );

    expect(screen.getByText('protected')).toBeInTheDocument();
  });

  it('renders LoginPage for anonymous users and refreshes after login', async () => {
    const isAuthenticated = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    render(
      <AuthGuard
        auth={{ isAuthenticated }}
        LoginPage={({ onAuthenticated }) => (
          <button onClick={onAuthenticated}>sign in</button>
        )}
        ErrorPage={ErrorPage}
      >
        <div>protected</div>
      </AuthGuard>,
    );

    await userEvent.click(await screen.findByText('sign in'));
    await waitFor(() =>
      expect(screen.getByText('protected')).toBeInTheDocument(),
    );
    expect(isAuthenticated).toHaveBeenCalledTimes(2);
  });

  it('delegates authentication failures to the project ErrorPage', async () => {
    render(
      <AuthGuard
        auth={{
          isAuthenticated: async () => {
            throw new Error('auth failed');
          },
        }}
        LoginPage={() => <div>login</div>}
        ErrorPage={ErrorPage}
      >
        <div>protected</div>
      </AuthGuard>,
    );

    expect(await screen.findByText('error: auth failed')).toBeInTheDocument();
  });
});
