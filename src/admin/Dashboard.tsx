import { useEffect } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
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
      <aside className="w-64 bg-white shadow-lg flex flex-col overflow-y-auto">
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

        {/* Language Switcher */}
        <div className="p-4 border-t border-gray-100">
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
