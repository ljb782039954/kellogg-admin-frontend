import { Component, type ComponentType, type ReactNode } from 'react';

interface RouteErrorBoundaryProps {
  ErrorPage: ComponentType<{ error?: unknown }>;
  children: ReactNode;
}

interface RouteErrorBoundaryState {
  error: unknown;
}

export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): RouteErrorBoundaryState {
    return { error };
  }

  override render() {
    if (this.state.error) {
      const { ErrorPage } = this.props;
      return <ErrorPage error={this.state.error} />;
    }
    return this.props.children;
  }
}
