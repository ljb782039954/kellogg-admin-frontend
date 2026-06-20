import { usePropertyEditorResources } from './usePropertyEditorResources';
import { PageBuilderContainer } from '@/features/page-builder';
import { defaultPropertyEditorRegistry } from '@/ui/themes/default/page-builder';
import { Loader2 } from 'lucide-react';

export default function DefaultPageBuilderRoute() {
  const resources = usePropertyEditorResources();

  if (resources.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">加载资源中...</span>
      </div>
    );
  }

  return (
    <PageBuilderContainer
      editors={defaultPropertyEditorRegistry}
      resources={resources}
    />
  );
}
