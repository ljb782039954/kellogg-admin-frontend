import { describe, expect, it, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import { getInquiries, updateInquiryStatus, deleteInquiry } from './inquiries.api';

describe('getInquiries', () => {
  it('encodes page, pageSize, search, and status', async () => {
    requestMock.mockResolvedValueOnce({ data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } });
    await getInquiries({ page: 2, pageSize: 20, search: 'Acme', status: 'pending' });
    expect(requestMock).toHaveBeenCalledWith(
      '/api/inquiries?page=2&pageSize=20&search=Acme&status=pending',
    );
  });

  it('omits search when empty', async () => {
    requestMock.mockResolvedValueOnce({ data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } });
    await getInquiries({ page: 1, pageSize: 20, search: '' });
    expect(requestMock).toHaveBeenCalledWith('/api/inquiries?page=1&pageSize=20');
  });

  it('omits status when not provided', async () => {
    requestMock.mockResolvedValueOnce({ data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } });
    await getInquiries({ page: 1, pageSize: 20 });
    expect(requestMock).toHaveBeenCalledWith('/api/inquiries?page=1&pageSize=20');
  });
});

describe('updateInquiryStatus', () => {
  it('sends PATCH with status body', async () => {
    requestMock.mockResolvedValueOnce({ message: 'OK' });
    await updateInquiryStatus(5, 'processed');
    expect(requestMock).toHaveBeenCalledWith('/api/inquiries/5', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'processed' }),
    });
  });
});

describe('deleteInquiry', () => {
  it('sends DELETE', async () => {
    requestMock.mockResolvedValueOnce({ message: 'OK' });
    await deleteInquiry(7);
    expect(requestMock).toHaveBeenCalledWith('/api/inquiries/7', {
      method: 'DELETE',
    });
  });
});
