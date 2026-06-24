import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createAdminRouteElements } from './createAdminRouteElements';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';
import { LanguageProvider } from '@/core/app/LanguageContext';

describe('createAdminRouteElements', () => {
  it('按 path 渲染对应 screen，并被 shell.Layout 包裹', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          {createAdminRouteElements(fakeProjectPackage)}
        </MemoryRouter>
      </LanguageProvider>,
    );
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('screen')).toBeInTheDocument();
  });

  it('根路径重定向到首个 route', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/']}>
          {createAdminRouteElements(fakeProjectPackage)}
        </MemoryRouter>
      </LanguageProvider>,
    );
    expect(screen.getByText('screen')).toBeInTheDocument();
  });

  it('Shell 收到 core 构建的菜单分组', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          {createAdminRouteElements(fakeProjectPackage)}
        </MemoryRouter>
      </LanguageProvider>,
    );
    expect(screen.getByTestId('layout').getAttribute('data-groups')).toBe('1');
  });

  it('设置当前 route 的页面标题', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          {createAdminRouteElements(fakeProjectPackage)}
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() =>
      expect(document.title).toBe('概览 - 测试'),
    );
  });

  it('使用 package ErrorPage 渲染 404', () => {
    const ErrorPage = vi.fn(({ error }: { error?: unknown }) => (
      <div>{(error as Error).message}</div>
    ));
    const projectPackage = {
      ...fakeProjectPackage,
      ui: {
        ...fakeProjectPackage.ui,
        shell: { ...fakeProjectPackage.ui.shell, ErrorPage },
      },
    };

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/missing']}>
          {createAdminRouteElements(projectPackage)}
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByText('页面不存在')).toBeInTheDocument();
    expect(ErrorPage).toHaveBeenCalled();
  });

  it('使用 package ErrorPage 捕获 screen 渲染错误', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const ErrorPage = ({ error }: { error?: unknown }) => (
      <div>{(error as Error).message}</div>
    );
    const BrokenScreen = () => {
      throw new Error('screen crashed');
    };
    const projectPackage = {
      ...fakeProjectPackage,
      ui: {
        ...fakeProjectPackage.ui,
        shell: { ...fakeProjectPackage.ui.shell, ErrorPage },
        screens: {
          ...fakeProjectPackage.ui.screens,
          dashboard: BrokenScreen,
        },
      },
    };

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          {createAdminRouteElements(projectPackage)}
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByText('screen crashed')).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it('鉴权未通过时使用 package LoginPage', async () => {
    const LoginPage = vi.fn(() => <div>project login</div>);
    const projectPackage = {
      ...fakeProjectPackage,
      auth: { isAuthenticated: async () => false },
      ui: {
        ...fakeProjectPackage.ui,
        shell: { ...fakeProjectPackage.ui.shell, LoginPage },
      },
    };

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          {createAdminRouteElements(projectPackage)}
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(await screen.findByText('project login')).toBeInTheDocument();
    expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
  });
});
