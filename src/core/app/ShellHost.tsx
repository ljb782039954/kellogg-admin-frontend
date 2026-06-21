import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import type { ProjectPackage } from '@/core/contracts';
import { useLanguage } from './LanguageContext';
import { buildAdminMenu } from '@/core/routing/buildAdminMenu';

/** 路由层级宿主：计算菜单与当前语言，渲染项目包的 Shell Layout，内容由 <Outlet/> 提供。 */
export function ShellHost({
  projectPackage,
}: {
  projectPackage: ProjectPackage;
}): ReactElement {
  const { language, setLanguage } = useLanguage();
  const Layout = projectPackage.ui.shell.Layout;
  const menu = buildAdminMenu(
    projectPackage.routes,
    projectPackage.menuGroups ?? [],
  );
  return (
    <Layout
      identity={projectPackage.identity}
      menu={menu}
      language={language}
      onLanguageChange={setLanguage}
    >
      <Outlet />
    </Layout>
  );
}
