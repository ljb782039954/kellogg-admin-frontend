import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquirySettingsSchema, type InquirySettingsFormValues } from '../../model/inquiry.schema';
import { InquirySettingsView } from './InquirySettingsView';

function TestWrapper() {
  const form = useForm<InquirySettingsFormValues>({
    resolver: zodResolver(inquirySettingsSchema),
    defaultValues: {
      title: { zh: '标题', en: 'Title' },
      description: { zh: '描述', en: 'Description' },
    },
  });
  return <InquirySettingsView form={form} isSaving={false} error={null} onSubmit={vi.fn()} />;
}

describe('InquirySettingsView', () => {
  it('renders title and description fields', () => {
    render(<TestWrapper />);
    expect(screen.getByDisplayValue('标题')).toBeTruthy();
    expect(screen.getByDisplayValue('描述')).toBeTruthy();
  });

  it('calls onSubmit when save button is clicked', async () => {
    const onSubmit = vi.fn();
    function SaveTest() {
      const form = useForm<InquirySettingsFormValues>({
        defaultValues: { title: { zh: 'T', en: 'T' }, description: { zh: 'D', en: 'D' } },
      });
      return <InquirySettingsView form={form} isSaving={false} error={null} onSubmit={onSubmit} />;
    }
    render(<SaveTest />);
    await userEvent.click(screen.getByText('保存配置'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('disables save button when saving', () => {
    function SavingTest() {
      const form = useForm<InquirySettingsFormValues>({
        defaultValues: { title: { zh: 'T', en: 'T' }, description: { zh: 'D', en: 'D' } },
      });
      return <InquirySettingsView form={form} isSaving={true} error={null} onSubmit={vi.fn()} />;
    }
    render(<SavingTest />);
    const btn = screen.getByText('保存配置').closest('button');
    expect(btn?.hasAttribute('disabled')).toBe(true);
  });

  it('shows error message', () => {
    function ErrorTest() {
      const form = useForm<InquirySettingsFormValues>({
        defaultValues: { title: { zh: 'T', en: 'T' }, description: { zh: 'D', en: 'D' } },
      });
      return <InquirySettingsView form={form} isSaving={false} error="保存失败" onSubmit={vi.fn()} />;
    }
    render(<ErrorTest />);
    expect(screen.getByText('保存失败')).toBeTruthy();
  });
});
