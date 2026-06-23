import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { InquiriesViewModel, InquiriesActions, Inquiry } from '@/package/types';
import { InquiriesView } from './InquiriesView';

const sampleInquiry: Inquiry = {
  id: 1, name: 'Alice', email: 'a@a.com', phone: '+1', country: 'US', company: 'Acme',
  productType: 'Hoodie', quantity: '100', message: 'Hi there', status: 'pending',
  createdAt: '2026-06-01T00:00:00Z', updatedAt: null,
};

const baseViewModel: InquiriesViewModel = {
  inquiries: [sampleInquiry],
  selectedInquiry: null,
  pendingCount: 1,
  page: 1, pageSize: 20, total: 1, totalPages: 1,
  search: '', status: 'all',
  isLoading: false, isFetching: false, error: null,
};

const baseActions: InquiriesActions = {
  changeSearch: vi.fn(), changeStatus: vi.fn(), changePage: vi.fn(),
  selectInquiry: vi.fn(), updateStatus: vi.fn(), removeInquiry: vi.fn(),
  exportInquiry: vi.fn(), exportCurrentPage: vi.fn(), retry: vi.fn(),
};

describe('InquiriesView', () => {
  it('renders inquiry list', () => {
    render(<InquiriesView viewModel={baseViewModel} actions={baseActions} onDelete={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('calls changeSearch on input', async () => {
    const actions = { ...baseActions, changeSearch: vi.fn() };
    render(<InquiriesView viewModel={baseViewModel} actions={actions} onDelete={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText('搜索姓名、邮箱、公司...'), 'Bob');
    expect(actions.changeSearch).toHaveBeenCalled();
  });

  it('calls changeStatus when filter button is clicked', async () => {
    const actions = { ...baseActions, changeStatus: vi.fn() };
    render(<InquiriesView viewModel={baseViewModel} actions={actions} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByText('待处理'));
    expect(actions.changeStatus).toHaveBeenCalledWith('pending');
  });

  it('calls selectInquiry when list item is clicked', async () => {
    const actions = { ...baseActions, selectInquiry: vi.fn() };
    render(<InquiriesView viewModel={baseViewModel} actions={actions} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByText('Alice'));
    expect(actions.selectInquiry).toHaveBeenCalledWith(1);
  });

  it('shows loading state', () => {
    const vm = { ...baseViewModel, isLoading: true, inquiries: [] };
    render(<InquiriesView viewModel={vm} actions={baseActions} onDelete={vi.fn()} />);
    expect(screen.getByText('加载询盘中...')).toBeTruthy();
  });

  it('shows error with retry button', () => {
    const vm = { ...baseViewModel, error: 'Network error' };
    render(<InquiriesView viewModel={vm} actions={baseActions} onDelete={vi.fn()} />);
    expect(screen.getByText('Network error')).toBeTruthy();
    expect(screen.getByText('重试')).toBeTruthy();
  });

  it('shows empty state', () => {
    const vm = { ...baseViewModel, inquiries: [], pendingCount: 0 };
    render(<InquiriesView viewModel={vm} actions={baseActions} onDelete={vi.fn()} />);
    expect(screen.getByText('暂无匹配的询盘数据')).toBeTruthy();
  });

  it('calls updateStatus on detail status button', async () => {
    const actions = { ...baseActions, updateStatus: vi.fn() };
    const vm = { ...baseViewModel, selectedInquiry: sampleInquiry };
    render(<InquiriesView viewModel={vm} actions={actions} onDelete={vi.fn()} />);
    const buttons = screen.getAllByText('标记为已处理');
    await userEvent.click(buttons[0]);
    expect(actions.updateStatus).toHaveBeenCalledWith(1, 'processed');
  });
});
