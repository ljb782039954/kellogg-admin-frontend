import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResolvedPage, useSavePage } from '@/features/pages';
import { inquirySettingsSchema, type InquirySettingsFormValues } from './inquiry.schema';
import { toInquirySettings } from './inquiry.mapper';

export function useInquirySettings() {
  const { page, isLoading, error: pageError } = useResolvedPage('system-inquiry');
  const { savePage, isSaving, error: saveError } = useSavePage();

  const form = useForm<InquirySettingsFormValues>({
    resolver: zodResolver(inquirySettingsSchema),
    defaultValues: { title: { zh: '', en: '' }, description: { zh: '', en: '' } },
  });

  useEffect(() => {
    if (!page) return;
    const settings = toInquirySettings(page.content);
    form.reset(settings);
  }, [page]);

  const submit = async () => {
    const values = form.getValues();
    if (!page) return;
    await savePage({
      ...page,
      content: {
        title: values.title,
        description: values.description,
      },
    });
    form.reset(values);
  };

  if (isLoading) return { status: 'loading' as const };
  if (pageError) return { status: 'error' as const, error: pageError.message };
  if (!page) return { status: 'not-found' as const };

  return {
    status: 'ready' as const,
    form,
    isSaving,
    error: saveError?.message ?? null,
    submit,
  };
}
