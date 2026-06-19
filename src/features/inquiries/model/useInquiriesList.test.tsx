import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getInquiriesMock, updateInquiryStatusMock, deleteInquiryMock } = vi.hoisted(() => ({
  getInquiriesMock: vi.fn(),
  updateInquiryStatusMock: vi.fn(),
  deleteInquiryMock: vi.fn(),
}));

vi.mock('../api/inquiries.api', () => ({
  getInquiries: getInquiriesMock,
  updateInquiryStatus: updateInquiryStatusMock,
  deleteInquiry: deleteInquiryMock,
}));

import { useInquiriesList } from './useInquiriesList';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return {
    client,
    Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    },
  };
}

const mockPage = (page: number, totalPages: number) => ({
  data: [
    { id: 1, name: 'Alice', email: 'a@a.com', phone: null, country: 'US', company: 'Acme', product_type: 'Hoodie', quantity: '100', message: 'Hi', status: 'pending', created_at: '2026-06-01T00:00:00Z' },
    { id: 2, name: 'Bob', email: 'b@b.com', phone: null, country: null, company: null, product_type: null, quantity: null, message: null, status: 'processed', created_at: '2026-06-02T00:00:00Z' },
  ],
  pagination: { page, pageSize: 20, total: totalPages * 2, totalPages },
});

describe('useInquiriesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getInquiriesMock.mockResolvedValue(mockPage(1, 1));
  });

  it('loads first page with default filters', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInquiriesList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.viewModel.isLoading).toBe(false));
    expect(result.current.viewModel.inquiries).toHaveLength(2);
    expect(result.current.viewModel.page).toBe(1);
    expect(result.current.viewModel.search).toBe('');
    expect(result.current.viewModel.status).toBe('all');
  });

  it('selectedInquiry derives from current data', async () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInquiriesList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.viewModel.isLoading).toBe(false));
    act(() => result.current.actions.selectInquiry(1));
    expect(result.current.viewModel.selectedInquiry?.id).toBe(1);
    expect(result.current.viewModel.selectedInquiry?.name).toBe('Alice');
  });

  it('changeStatus resets page and clears selection', async () => {
    getInquiriesMock.mockResolvedValue(mockPage(2, 3));
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInquiriesList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.viewModel.isLoading).toBe(false));
    act(() => result.current.actions.selectInquiry(1));
    act(() => result.current.actions.changeStatus('pending'));
    expect(result.current.viewModel.page).toBe(1);
    expect(result.current.viewModel.selectedInquiry).toBeNull();
  });

  it('updates status and updates cache', async () => {
    updateInquiryStatusMock.mockResolvedValue({ message: 'OK' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInquiriesList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.viewModel.isLoading).toBe(false));

    act(() => result.current.actions.selectInquiry(1));
    await act(async () => result.current.actions.updateStatus(1, 'processed'));
    expect(updateInquiryStatusMock).toHaveBeenCalledWith(1, 'processed');
    await waitFor(() => expect(result.current.viewModel.selectedInquiry?.status).toBe('processed'));
  });

  it('removes inquiry and updates cache', async () => {
    deleteInquiryMock.mockResolvedValue({ message: 'OK' });
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useInquiriesList(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.viewModel.isLoading).toBe(false));
    expect(result.current.viewModel.inquiries).toHaveLength(2);

    act(() => result.current.actions.selectInquiry(1));
    await act(async () => result.current.actions.removeInquiry(1));
    await waitFor(() => expect(result.current.viewModel.inquiries).toHaveLength(1));
    expect(result.current.viewModel.selectedInquiry).toBeNull();
  });
});
