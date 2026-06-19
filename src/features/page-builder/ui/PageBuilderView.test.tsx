import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/context/LanguageContext';
import type { PageBuilderViewModel, PageBuilderActions } from '../model/pageBuilder.types';
import { createDefaultSeo } from '../model/pageBuilder.defaults';
import { PageBuilderView } from './PageBuilderView';

function WithLang({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

const baseViewModel: PageBuilderViewModel = {
  page: {
    id: 'page_1',
    path: '/test',
    title: { zh: '测试页面', en: 'Test Page' },
    isFixed: false,
    type: 'dynamic-block',
    blocks: [
      { id: 'b1', type: 'textSection', content: {}, isVisible: true },
    ],
    seo: createDefaultSeo(),
  },
  selectedPanel: null,
  selectedBlock: undefined,
  availableBlocks: [],
  isFixedLayout: false,
  isDirty: false,
  canSave: false,
  isSaving: false,
  saveStatus: 'idle',
  error: null,
};

const baseActions: PageBuilderActions = {
  selectPanel: vi.fn(),
  addBlock: vi.fn(),
  removeBlock: vi.fn(),
  moveBlock: vi.fn(),
  toggleBlock: vi.fn(),
  updateBlock: vi.fn(),
  updateMeta: vi.fn(),
  updateSeo: vi.fn(),
  save: vi.fn(),
  requestExit: vi.fn(),
};

describe('PageBuilderView', () => {
  it('renders the page title and path', () => {
    render(
      <WithLang><PageBuilderView viewModel={baseViewModel} actions={baseActions} onBack={vi.fn()} /></WithLang>,
    );
    expect(screen.getByText('测试页面')).toBeTruthy();
  });

  it('calls selectPanel with page-settings when settings button is clicked', async () => {
    const actions = { ...baseActions, selectPanel: vi.fn() };
    render(<WithLang><PageBuilderView viewModel={baseViewModel} actions={actions} onBack={vi.fn()} /></WithLang>);
    await userEvent.click(screen.getByText('设置'));
    expect(actions.selectPanel).toHaveBeenCalledWith({ type: 'page-settings' });
  });

  it('calls selectPanel with seo-settings when SEO button is clicked', async () => {
    const actions = { ...baseActions, selectPanel: vi.fn() };
    render(<WithLang><PageBuilderView viewModel={baseViewModel} actions={actions} onBack={vi.fn()} /></WithLang>);
    await userEvent.click(screen.getByText('SEO'));
    expect(actions.selectPanel).toHaveBeenCalledWith({ type: 'seo-settings' });
  });

  it('disables save button when canSave is false', () => {
    render(<WithLang><PageBuilderView viewModel={baseViewModel} actions={baseActions} onBack={vi.fn()} /></WithLang>);
    const saveBtn = screen.getByText('保存').closest('button');
    expect(saveBtn?.hasAttribute('disabled')).toBe(true);
  });

  it('enables save button when canSave is true', () => {
    const vm = { ...baseViewModel, canSave: true, isDirty: true };
    render(<WithLang><PageBuilderView viewModel={vm} actions={baseActions} onBack={vi.fn()} /></WithLang>);
    const saveBtn = screen.getByText('保存').closest('button');
    expect(saveBtn?.hasAttribute('disabled')).toBe(false);
  });

  it('shows saved indicator when saveStatus is saved', () => {
    const vm = { ...baseViewModel, saveStatus: 'saved' as const };
    render(<WithLang><PageBuilderView viewModel={vm} actions={baseActions} onBack={vi.fn()} /></WithLang>);
    expect(screen.getByText('已保存')).toBeTruthy();
  });

  it('shows error message when present', () => {
    const vm = { ...baseViewModel, error: '保存失败' };
    render(<WithLang><PageBuilderView viewModel={vm} actions={baseActions} onBack={vi.fn()} /></WithLang>);
    expect(screen.getByText('保存失败')).toBeTruthy();
  });
});
