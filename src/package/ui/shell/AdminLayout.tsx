import { useState, type ComponentType } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Building2, BookOpen, ChevronRight, FileText, Globe, Image as ImageIcon,
  Inbox, Layers, LayoutDashboard, PanelBottom, PanelTop, ShoppingBag, Star,
  type LucideProps,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AdminShellProps, AdminMenuGroup } from '@/core/contracts';
import { useBuildManager, BuildTrigger } from '@/features/build';

const ICONS: Record<string, ComponentType<LucideProps>> = {
  LayoutDashboard, Building2, PanelTop, PanelBottom, Layers, FileText,
  Image: ImageIcon, BookOpen, ShoppingBag, Inbox, Star,
};

function GroupIcon({ name }: { name?: string }) {
  const Icon = name ? ICONS[name] : undefined;
  return Icon ? <Icon className="w-5 h-5" /> : <span className="w-5 h-5" />;
}

export function AdminLayout({
  identity, menu, language, onLanguageChange, children,
}: AdminShellProps) {
  const location = useLocation();
  const { buildStatus, isBuilding, triggerMutation } = useBuildManager();

  const isSingle = (g: AdminMenuGroup) => g.items.length === 1;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of menu) {
      if (!isSingle(g) && g.items.some((i) => location.pathname.startsWith(i.path))) {
        initial[g.id] = true;
      }
    }
    return initial;
  });

  const toggle = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleBuild = async () => {
    try {
      const res = await triggerMutation.mutateAsync();
      if (res.success && res.buildStatus) toast.success('构建部署已成功触发，正在后台生成中...');
      else toast.error('触发构建失败');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '触发构建出错');
    }
  };

  const t = (tr: { zh: string; en: string }) => (language === 'zh' ? tr.zh : tr.en);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            {identity.logo && <img src={identity.logo} alt="Logo" className="w-8 h-8 object-contain" />}
            <h1 className="text-xl font-bold text-gray-800">{t(identity.name)}</h1>
          </div>
          <p className="text-sm text-gray-500">后台管理系统</p>
        </div>

        <div className="p-4 border-t border-gray-300 bg-gray-50/50">
          <BuildTrigger
            hasChanges={buildStatus.hasChanges}
            isBuilding={isBuilding}
            lastBuildTime={buildStatus.lastBuildTime}
            onBuild={handleBuild}
          />
        </div>

        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center gap-3 px-4 py-3">
            <Globe className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">预览语言</span>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                {language === 'zh' ? '中文' : 'EN'}
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((group) => {
            if (isSingle(group)) {
              const item = group.items[0];
              return (
                <NavLink
                  key={group.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <GroupIcon name={item.icon ?? group.icon} />
                  <span className="flex-1">{t(item.title)}</span>
                </NavLink>
              );
            }
            const active = group.items.some((i) => location.pathname.startsWith(i.path));
            return (
              <div key={group.id}>
                <button
                  onClick={() => toggle(group.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <GroupIcon name={group.icon} />
                  <span className="flex-1 text-left">{t(group.title)}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${openGroups[group.id] ? 'rotate-90' : ''}`} />
                </button>
                {openGroups[group.id] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.routeId}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                            isActive ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-50'
                          }`
                        }
                      >
                        <span className="flex-1">{t(item.title)}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
