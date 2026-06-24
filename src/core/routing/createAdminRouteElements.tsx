import type { ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { ProjectPackage } from '@/core/contracts';
import { ShellHost } from '@/core/app/ShellHost';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { RouteLifecycle } from './RouteLifecycle';
import { AuthGuard } from './AuthGuard';

/** 据项目包构建后台路由树：ShellHost 提供 Shell 布局，按 screenId 渲染 screen。 */
export function createAdminRouteElements(pkg: ProjectPackage): ReactElement {
  const { screens } = pkg.ui;
  const ErrorPage = pkg.ui.shell.ErrorPage;
  const LoginPage = pkg.ui.shell.LoginPage;
  const firstPath = pkg.routes[0]?.path;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGuard
            auth={pkg.auth}
            LoginPage={LoginPage}
            ErrorPage={ErrorPage}
          >
            <ShellHost projectPackage={pkg} />
          </AuthGuard>
        }
      >
        {firstPath && (
          <Route index element={<Navigate to={firstPath} replace />} />
        )}
        {pkg.routes.map((route) => {
          const Screen = screens[route.screenId];
          return (
            <Route
              key={route.id}
              path={route.path}
              element={
                <RouteErrorBoundary ErrorPage={pkg.ui.shell.ErrorPage}>
                  <RouteLifecycle
                    identity={pkg.identity}
                    title={route.title}
                  >
                    <Screen routeId={route.id} />
                  </RouteLifecycle>
                </RouteErrorBoundary>
              }
            />
          );
        })}
        <Route
          path="*"
          element={<ErrorPage error={new Error('页面不存在')} />}
        />
      </Route>
    </Routes>
  );
}
