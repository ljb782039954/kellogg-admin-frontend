import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppQueryClient } from '@/app/queryClient';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期测试沿用 feature model 默认值。
import { blankCompanyInfo } from '@/features/company-info/model/companyInfo.defaults';

const { getCompanyInfoMock, saveCompanyInfoMock } = vi.hoisted(() => ({
  getCompanyInfoMock: vi.fn(),
  saveCompanyInfoMock: vi.fn(),
}));

vi.mock('@/features/company-info/api/companyInfo.api', () => ({
  getCompanyInfo: getCompanyInfoMock,
  saveCompanyInfo: saveCompanyInfoMock,
}));

vi.mock('@/package/ui/media/ImageInput', () => ({
  default: ({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) => (
    <button type="button" onClick={() => onChange('/logo.png')}>
      {label}: {value}
    </button>
  ),
}));

import { CompanyInfoEditor } from './CompanyInfoEditor';

function renderEditor() {
  const client = createAppQueryClient();

  return render(
    <QueryClientProvider client={client}>
      <CompanyInfoEditor />
    </QueryClientProvider>,
  );
}

describe('CompanyInfoEditor', () => {
  beforeEach(() => {
    getCompanyInfoMock.mockReset();
    saveCompanyInfoMock.mockReset();
  });

  it('renders loaded company info and saves edited values without ContentContext', async () => {
    const user = userEvent.setup();
    getCompanyInfoMock.mockResolvedValueOnce({
      ...blankCompanyInfo,
      name: { zh: '旧公司', en: 'Old Company' },
    });
    saveCompanyInfoMock.mockResolvedValueOnce(undefined);

    renderEditor();

    await waitFor(() => expect(screen.getByPlaceholderText('公司中文名称')).toHaveValue('旧公司'));

    await user.clear(screen.getByPlaceholderText('Company English Name'));
    await user.type(screen.getByPlaceholderText('Company English Name'), 'New Company');
    await user.click(screen.getByRole('button', { name: /保存更改/ }));

    await waitFor(() =>
      expect(saveCompanyInfoMock.mock.calls[0]?.[0]).toEqual(
        expect.objectContaining({
          name: { zh: '旧公司', en: 'New Company' },
        }),
      ),
    );
    expect(screen.getByText('保存成功！')).toBeInTheDocument();
  });
});
