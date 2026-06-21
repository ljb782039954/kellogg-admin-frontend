import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryProvider } from '@/core/app/QueryProvider';
import { AdminLayout } from './AdminLayout';
import type { AdminMenuGroup, ProjectIdentity } from '@/core/contracts';

const identity: ProjectIdentity = {
  key: 'kellogg',
  name: { zh: '凯乐格', en: 'KELLOGG' },
  logo: '/logo/logo.jpg',
  languages: ['zh', 'en'],
  defaultLanguage: 'zh',
};

const menu: AdminMenuGroup[] = [
  { id: 'overview', title: { zh: '概览', en: 'Overview' }, order: 1, items: [{ routeId: 'dashboard', path: '/dashboard', title: { zh: '概览', en: 'Dashboard' }, order: 1 }] },
  { id: 'blog', title: { zh: '博客管理', en: 'Blog' }, order: 3, items: [
    { routeId: 'blog-list', path: '/blog', title: { zh: '文章列表', en: 'Posts' }, order: 1 },
    { routeId: 'blog-categories', path: '/blog-categories', title: { zh: '分类管理', en: 'Categories' }, order: 3 },
  ] },
];

function renderLayout(language: 'zh' | 'en' = 'zh', onLang = vi.fn()) {
  return render(
    <QueryProvider>
      <MemoryRouter>
        <AdminLayout identity={identity} menu={menu} language={language} onLanguageChange={onLang}>
          <div>页面内容</div>
        </AdminLayout>
      </MemoryRouter>
    </QueryProvider>,
  );
}

describe('AdminLayout', () => {
  it('渲染品牌名与子内容', () => {
    renderLayout('zh');
    expect(screen.getByText('凯乐格')).toBeInTheDocument();
    expect(screen.getByText('页面内容')).toBeInTheDocument();
  });

  it('单项分组渲染为直达链接', () => {
    renderLayout('zh');
    const link = screen.getByRole('link', { name: /概览/ });
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('多项分组展开后显示子项链接', () => {
    renderLayout('zh');
    fireEvent.click(screen.getByText('博客管理'));
    expect(screen.getByRole('link', { name: /文章列表/ })).toHaveAttribute('href', '/blog');
  });

  it('点击语言按钮回调 onLanguageChange', () => {
    const onLang = vi.fn();
    renderLayout('zh', onLang);
    fireEvent.click(screen.getByRole('button', { name: /中文|EN/ }));
    expect(onLang).toHaveBeenCalledWith('en');
  });
});
