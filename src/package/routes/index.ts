import type {
  AdminMenuGroupDefinition,
  AdminRouteDefinition,
} from '@/core/contracts';

export const menuGroups: AdminMenuGroupDefinition[] = [
  { id: 'overview', title: { zh: '概览', en: 'Overview' }, order: 1 },
  { id: 'site', title: { zh: '网站设置', en: 'Site' }, order: 2 },
  { id: 'blog', title: { zh: '博客管理', en: 'Blog' }, order: 3, icon: 'BookOpen' },
  { id: 'product', title: { zh: '产品管理', en: 'Products' }, order: 4, icon: 'ShoppingBag' },
  { id: 'inquiry', title: { zh: '询盘管理', en: 'Inquiries' }, order: 5, icon: 'Inbox' },
  { id: 'misc', title: { zh: '其它', en: 'More' }, order: 6 },
];

export const routes: AdminRouteDefinition[] = [
  { id: 'dashboard', path: 'dashboard', title: { zh: '概览', en: 'Dashboard' }, icon: 'LayoutDashboard', menu: { group: 'overview', order: 1 }, screenId: 'dashboard' },
  { id: 'company', path: 'company', title: { zh: '公司信息', en: 'Company' }, icon: 'Building2', menu: { group: 'site', order: 1 }, screenId: 'company' },
  { id: 'header', path: 'header', title: { zh: 'Header', en: 'Header' }, icon: 'PanelTop', menu: { group: 'site', order: 2 }, screenId: 'header' },
  { id: 'footer', path: 'footer', title: { zh: 'Footer', en: 'Footer' }, icon: 'PanelBottom', menu: { group: 'site', order: 3 }, screenId: 'footer' },
  { id: 'components', path: 'components', title: { zh: '预定义组件', en: 'Components' }, icon: 'Layers', menu: { group: 'site', order: 4 }, screenId: 'components' },
  { id: 'pages', path: 'pages', title: { zh: '页面管理', en: 'Pages' }, icon: 'FileText', menu: { group: 'site', order: 5 }, screenId: 'pages' },
  { id: 'media', path: 'media', title: { zh: '图片管理', en: 'Media' }, icon: 'Image', menu: { group: 'site', order: 6 }, screenId: 'media' },
  { id: 'page-builder', path: 'pages/:pageId/edit', title: { zh: '页面编辑', en: 'Page Editor' }, screenId: 'page-builder' },
  { id: 'blog-list', path: 'blog', title: { zh: '文章列表', en: 'Posts' }, menu: { group: 'blog', order: 1 }, screenId: 'blog-list' },
  { id: 'blog-new', path: 'blog/new', title: { zh: '写新文章', en: 'New Post' }, menu: { group: 'blog', order: 2 }, screenId: 'blog-new' },
  { id: 'blog-edit', path: 'blog/:id/edit', title: { zh: '编辑文章', en: 'Edit Post' }, screenId: 'blog-edit' },
  { id: 'blog-categories', path: 'blog-categories', title: { zh: '分类管理', en: 'Categories' }, menu: { group: 'blog', order: 3 }, screenId: 'blog-categories' },
  { id: 'products', path: 'products', title: { zh: '产品编辑', en: 'Products' }, menu: { group: 'product', order: 1 }, screenId: 'products' },
  { id: 'categories', path: 'categories', title: { zh: '产品分类', en: 'Product Categories' }, menu: { group: 'product', order: 2 }, screenId: 'categories' },
  { id: 'inquiries', path: 'inquiries', title: { zh: '询盘列表', en: 'Inquiries' }, menu: { group: 'inquiry', order: 1 }, screenId: 'inquiries' },
  { id: 'inquiry-settings', path: 'inquiry-editor', title: { zh: '页面编辑', en: 'Inquiry Page' }, menu: { group: 'inquiry', order: 2 }, screenId: 'inquiry-settings' },
  { id: 'reviews', path: 'reviews', title: { zh: '客户评价', en: 'Reviews' }, icon: 'Star', menu: { group: 'misc', order: 1 }, screenId: 'reviews' },
  { id: 'page-layout-redirect', path: 'page-layout', title: { zh: '旧路由跳转', en: 'Redirect' }, screenId: 'page-layout-redirect' },
];
