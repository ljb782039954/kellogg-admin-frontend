import { Loader2 } from 'lucide-react';
import { useInquirySettings } from '../../model/useInquirySettings';
import { InquirySettingsView } from './InquirySettingsView';

export function InquirySettingsEditor() {
  const result = useInquirySettings();

  if (result.status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  if (result.status === 'not-found') {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-500">询盘页面未找到</p>
      </div>
    );
  }

  return (
    <InquirySettingsView
      form={result.form}
      isSaving={result.isSaving}
      error={result.error}
      onSubmit={result.submit}
    />
  );
}
