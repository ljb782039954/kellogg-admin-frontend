import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createAdminRouteElements } from './createAdminRouteElements';
import { fakeProjectPackage } from '@/test/fixtures/fakeProjectPackage';

describe('createAdminRouteElements', () => {
  it('按 path 渲染对应 screen，并被 shell.Layout 包裹', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        {createAdminRouteElements(fakeProjectPackage)}
      </MemoryRouter>,
    );
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('screen')).toBeInTheDocument();
  });

  it('根路径重定向到首个 route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        {createAdminRouteElements(fakeProjectPackage)}
      </MemoryRouter>,
    );
    expect(screen.getByText('screen')).toBeInTheDocument();
  });
});
