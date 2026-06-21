import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});

