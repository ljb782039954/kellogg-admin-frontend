import { Loader2 } from 'lucide-react';
import { PageBuilderContainer } from './PageBuilderContainer';
import { usePageBuilderResources } from '@/package/page-builder';
import { legacyPropertyEditorRegistry } from '@/package/ui/editors/legacyRegistry';

export function PageBuilderScreen() {
  const resources = usePageBuilderResources();

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
      editors={legacyPropertyEditorRegistry}
      resources={resources}
    />
  );
}
