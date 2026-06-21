import type { ReactElement } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { ProjectPackage } from '@/core/contracts';

/** 根据项目包定义构建后台路由树：shell.Layout 包裹 Outlet，按 screenId 渲染 screen。 */
export function createAdminRouteElements(pkg: ProjectPackage): ReactElement {
  const { shell, screens } = pkg.ui;
  const Layout = shell.Layout;
  const firstPath = pkg.routes[0]?.path;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Outlet />
          </Layout>
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
              element={<Screen routeId={route.id} />}
            />
          );
        })}
      </Route>
    </Routes>
  );
}
