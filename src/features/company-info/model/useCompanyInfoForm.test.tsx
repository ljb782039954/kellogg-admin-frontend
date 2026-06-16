import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppQueryClient } from '@/app/queryClient';
import { blankCompanyInfo } from './companyInfo.defaults';

const { getCompanyInfoMock, saveCompanyInfoMock } = vi.hoisted(() => ({
  getCompanyInfoMock: vi.fn(),
  saveCompanyInfoMock: vi.fn(),
}));

vi.mock('../api/companyInfo.api', () => ({
  getCompanyInfo: getCompanyInfoMock,
  saveCompanyInfo: saveCompanyInfoMock,
}));

import { useCompanyInfoForm } from './useCompanyInfoForm';

function createWrapper() {
  const client = createAppQueryClient();

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useCompanyInfoForm', () => {
  beforeEach(() => {
    getCompanyInfoMock.mockReset();
    saveCompanyInfoMock.mockReset();
  });

  it('loads company info and resets the form with server values', async () => {
    getCompanyInfoMock.mockResolvedValueOnce({
      ...blankCompanyInfo,
      name: { zh: '公司', en: 'Company' },
    });

    const { result } = renderHook(() => useCompanyInfoForm(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.form.getValues('name')).toEqual({ zh: '公司', en: 'Company' });
  });

  it('submits normalized payloads and marks the save as successful', async () => {
    getCompanyInfoMock.mockResolvedValueOnce(blankCompanyInfo);
    saveCompanyInfoMock.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useCompanyInfoForm(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.form.setValue('socialMedia.instagram', '  https://instagram.example  ');
      result.current.form.setValue('socialMedia.twitter', '   ');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(saveCompanyInfoMock.mock.calls[0]?.[0]).toEqual({
      ...blankCompanyInfo,
      socialMedia: {
        instagram: 'https://instagram.example',
        twitter: undefined,
      },
    });
    expect(result.current.saved).toBe(true);
  });
});
