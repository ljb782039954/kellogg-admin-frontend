import { useEffect, useState } from 'react';
import { api } from '@/core/lib/api';
import type { CustomPage } from '@/site-package/kellogg/types/blocks';
import {
  DEFAULT_INQUIRY_CONFIG,
  type InquiryConfig,
} from './inquiryEditorConfig';

interface InquiryEditorNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface InquiryEditorMessages {
  saveSuccess: string;
  saveFailure: string;
}

export interface UseInquiryEditorOptions {
  findPage: (id: string) => CustomPage | undefined;
  messages?: Partial<InquiryEditorMessages>;
  notify?: InquiryEditorNotifier;
  pageId?: string;
  updatePage: (pageId: string, pageData: Partial<CustomPage>) => Promise<void>;
}

const DEFAULT_MESSAGES: InquiryEditorMessages = {
  saveSuccess: '询盘页面配置已保存',
  saveFailure: '保存失败',
};

export function useInquiryEditor({
  findPage,
  messages: customMessages,
  notify,
  pageId = 'system-inquiry',
  updatePage,
}: UseInquiryEditorOptions) {
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };
  const [config, setConfig] = useState<InquiryConfig>(DEFAULT_INQUIRY_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchConfig = async () => {
      setIsLoading(true);

      try {
        const page = findPage(pageId);
        if (page?.content) {
          if (!cancelled) setConfig(page.content as InquiryConfig);
          return;
        }

        const pageData = await api.getPageById(pageId);
        if (pageData?.content && !cancelled) {
          setConfig(pageData.content as InquiryConfig);
        }
      } catch (error) {
        console.error('Failed to load inquiry config from page:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchConfig();

    return () => {
      cancelled = true;
    };
  }, [findPage, pageId]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updatePage(pageId, { content: config } as Partial<CustomPage>);
      notify?.success?.(messages.saveSuccess);
    } catch {
      notify?.error?.(messages.saveFailure);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config,
    isLoading,
    isSaving,
    handleSave,
    setConfig,
  };
}
