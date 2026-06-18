import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/api/errors';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock('@/shared/api/client', () => ({
  apiClient: { request: requestMock },
}));

import {
  deletePageDetail,
  getPageById,
  getPagesIndex,
  savePageDetail,
  savePagesIndex,
} from './pages.api';
import { pageKeys } from './pages.keys';

const page = {
  id: 'page_1',
  path: '/one',
  title: { zh: '页面', en: 'Page' },
  isFixed: false,
  blocks: [],
};

describe('pages api', () => {
  beforeEach(() => requestMock.mockReset());

  it('defines stable list and detail keys', () => {
    expect(pageKeys.list()).toEqual(['pages', 'list']);
    expect(pageKeys.detail('page_1')).toEqual(['pages', 'detail', 'page_1']);
  });

  it('loads the page index and treats 404 as an empty list', async () => {
    requestMock.mockResolvedValueOnce([page]);
    await expect(getPagesIndex()).resolves.toEqual([page]);
    expect(requestMock).toHaveBeenCalledWith('/api/config/pages_index');

    requestMock.mockRejectedValueOnce(new ApiError('Not found', 404));
    await expect(getPagesIndex()).resolves.toEqual([]);
  });

  it('saves the page index', async () => {
    requestMock.mockResolvedValueOnce({ success: true });
    await savePagesIndex([page]);
    expect(requestMock).toHaveBeenCalledWith('/api/config', {
      method: 'POST',
      body: JSON.stringify({ key: 'pages_index', value: [page] }),
    });
  });

  it('loads, saves, and deletes a page detail', async () => {
    requestMock.mockResolvedValue({ success: true });

    await getPageById('page 1');
    expect(requestMock).toHaveBeenLastCalledWith('/api/config/pages/page 1');

    await savePageDetail('page 1', page);
    expect(requestMock).toHaveBeenLastCalledWith('/api/config', {
      method: 'POST',
      body: JSON.stringify({ key: 'page:page 1', value: page }),
    });

    await deletePageDetail('page 1');
    expect(requestMock).toHaveBeenLastCalledWith('/api/config/page%3Apage%201', {
      method: 'DELETE',
    });
  });
});
