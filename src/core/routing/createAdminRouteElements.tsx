import type { ReactElement } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { ProjectPackage } from '@/core/contracts';
import { ShellHost } from '@/core/app/ShellHost';

/** 据项目包构建后台路由树：ShellHost 提供 Shell 布局，按 screenId 渲染 screen。 */
export function createAdminRouteElements(pkg: ProjectPackage): ReactElement {
  const { screens } = pkg.ui;
  const firstPath = pkg.routes[0]?.path;

  return (
    <Routes>
      <Route path="/" element={<ShellHost projectPackage={pkg} />}>
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
