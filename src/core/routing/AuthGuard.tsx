import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type {
  AdminAuthDefinition,
  AdminLoginPageProps,
} from '@/core/contracts';
import type { ComponentType } from 'react';

type AuthState =
  | { status: 'checking' }
  | { status: 'authenticated' }
  | { status: 'anonymous' }
  | { status: 'error'; error: unknown };

export interface AuthGuardProps {
  auth?: AdminAuthDefinition;
  LoginPage: ComponentType<AdminLoginPageProps>;
  ErrorPage: ComponentType<{ error?: unknown }>;
  children: ReactNode;
}

export function AuthGuard({
  auth,
  LoginPage,
  ErrorPage,
  children,
}: AuthGuardProps) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<AuthState>({ status: 'checking' });

  useEffect(() => {
    if (!auth) return;

    let active = true;
    Promise.resolve(auth.isAuthenticated()).then(
      (authenticated) => {
        if (!active) return;
        setState({
          status: authenticated ? 'authenticated' : 'anonymous',
        });
      },
      (error: unknown) => {
        if (!active) return;
        setState({ status: 'error', error });
      },
    );
    return () => {
      active = false;
    };
  }, [auth, revision]);

  const refresh = useCallback(() => {
    setRevision((current) => current + 1);
  }, []);

  if (!auth) return children;
  if (state.status === 'checking') return null;
  if (state.status === 'error') return <ErrorPage error={state.error} />;
  if (state.status === 'anonymous') {
    return <LoginPage onAuthenticated={refresh} />;
  }
  return children;
}
