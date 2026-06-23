import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const { refetchMock, useProductsSummaryMock } = vi.hoisted(() => ({
  refetchMock: vi.fn(),
  useProductsSummaryMock: vi.fn(),
}));

vi.mock('@/features/products', () => ({
  useProductsSummary: useProductsSummaryMock,
}));

import Overview from './Overview';

describe('Overview', () => {
  it('展示产品总数与主要快捷入口', () => {
    useProductsSummaryMock.mockReturnValue({
      total: 12,
      isLoading: false,
      error: null,
      refetch: refetchMock,
    });

    render(
      <MemoryRouter>
        <Overview />
      </MemoryRouter>,
    );

    expect(screen.getByText('概览')).toBeInTheDocument();
    expect(screen.getByText('共 12 件产品')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /页面管理/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /预定义组件/ })).toBeInTheDocument();
  });

  it('点击刷新时重新请求概览数据', async () => {
    useProductsSummaryMock.mockReturnValue({
      total: 0,
      isLoading: false,
      error: null,
      refetch: refetchMock,
    });

    render(
      <MemoryRouter>
        <Overview />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole('button', { name: '刷新' }));
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });
});
