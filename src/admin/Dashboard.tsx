import { useEffect, useState } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  // LogOut,
  ChevronRight,
  ShoppingBag,
  // Settings,
  FileText,
  Building2,
  PanelTop,
  PanelBottom,
  Layers,
  Inbox,
  Image as ImageIcon,
  CloudLightning,
  BookOpen,
  Star,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import siteSettings from '../config/siteSettings.json';

interface MenuItem {
  path?: string;
  name: string;
  icon: React.ElementType;
  children?: { path: string; name: string }[];
}

const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    name: '概览',
    icon: LayoutDashboard,
  },
  {
    path: '/company',
    name: '公司信息管理',
    icon: Building2,
  },
  {
    path: '/header',
    name: 'Header 组件管理',
    icon: PanelTop,
  },
  {
    path: '/footer',
    name: 'Footer 组件管理',
    icon: PanelBottom,
  },
  {
    path: '/components',
    name: '预定义组件',
    icon: Layers,
  },
  {
    path: '/pages',
    name: '页面管理',
    icon: FileText,
  },
  {
    path: '/media',
    name: '图片管理',
    icon: ImageIcon,
  },
  {
    name: '博客管理',
    icon: BookOpen,
    children: [
      { path: '/blog', name: '文章列表' },
      { path: '/blog/new', name: '写新文章' },
      { path: '/blog-categories', name: '分类管理' },
    ],
  },
  {
    name: '产品管理',
    icon: ShoppingBag,
    children: [
      { path: '/products', name: '产品编辑' },
      { path: '/categories', name: '产品分类' },
    ],
  },
  {
    name: '询盘管理',
    icon: Inbox,
    children: [
      { path: '/inquiries', name: '询盘列表' },
      { path: '/inquiry-editor', name: '页面编辑' },
    ],
  },
  {
    path: '/reviews',
    name: '客户评价',
    icon: Star,
  },
  // {
  //   path: '/account',
  //   name: '账户设置',
  //   icon: Settings,
  // },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const { buildStatus, triggerBuild } = useContent();
  const [isBuilding, setIsBuilding] = useState(false);

  const handleBuild = async () => {
    setIsBuilding(true);
    await triggerBuild();
    setIsBuilding(false);
  };

  useEffect(() => {
    // TODO: 登录验证，已注释
    // const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    // if (!isLoggedIn) {
    //   navigate('/login');
    // }
  }, [navigate]);

  // const handleLogout = () => {
  //   sessionStorage.removeItem('admin_logged_in');
  //   navigate('/login');
  // };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            {siteSettings.brand.logo && (
              <img src={siteSettings.brand.logo} alt="Logo" className="w-8 h-8 object-contain" />
            )}
            <h1 className="text-xl font-bold text-gray-800">{siteSettings.brand.name.zh}</h1>
          </div>
          <p className="text-sm text-gray-500">后台管理系统</p>
        </div>

        {/* Build Panel */}
        <div className="p-4 border-t border-gray-300 bg-gray-50/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">发布构建</span>
              {buildStatus?.hasChanges ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              )}
            </div>
            
            {/* {buildStatus?.hasChanges ? ( */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  如果内容有改动，请点击重新部署。
                </p>
              </div>
            {/* ) : (
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-2.5">
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  内容已同步至最新，无需构建。
                </p>
              </div>
            )} */}

            <button
              onClick={handleBuild}
              disabled={isBuilding}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
                buildStatus?.hasChanges
                  ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-amber-100'
                  : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <CloudLightning className={`w-4 h-4 ${isBuilding ? 'animate-bounce' : ''}`} />
              <span>{isBuilding ? '部署中...' : buildStatus?.hasChanges ? '立即部署更新' : '重新构建网站'}</span>
            </button>
            
            {buildStatus?.lastBuildTime && (
              <p className="text-[12px] text-gray-600 text-center">
                上次部署: {new Date(buildStatus.lastBuildTime).toLocaleString('zh-CN', {
                  hour12: false,
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>

                {/* Language Switcher */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center gap-3 px-4 py-3">
            <Globe className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">预览语言</span>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                {language === 'zh' ? '中文' : 'EN'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.path || item.name}>
              <NavLink
                to={item.path || '#'}
                onClick={(e) => !item.path && e.preventDefault()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${(item.path && isActive) || item.children?.some((c) => location.pathname.startsWith(c.path))
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.name}</span>
                {item.children && <ChevronRight className="w-4 h-4" />}
              </NavLink>

              {/* Submenu */}
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${isActive
                          ? 'bg-gray-100 text-gray-800 font-medium'
                          : 'text-gray-500 hover:bg-gray-50'
                        }`
                      }
                    >
                      <span className="flex-1">{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>




        {/* Logout */}
        {/* <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
