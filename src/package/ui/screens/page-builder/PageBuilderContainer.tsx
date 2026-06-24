import { type ComponentType } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/package/ui/primitives/button';
import { usePageBuilderController } from '@/features/page-builder/model/usePageBuilderController';
import { PageBuilderView } from './PageBuilderView';
import type { PropertyEditorResources } from '@/features/page-builder/model/pageBuilder.types';

export interface PageBuilderContainerProps {
  // Legacy editors use different content props until the P5 compatibility layer is removed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editors: Record<string, ComponentType<any>>;
  resources: PropertyEditorResources;
}

export function PageBuilderContainer({ editors, resources }: PageBuilderContainerProps) {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const result = usePageBuilderController(pageId);

  if (result.status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">加载中...</span>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{result.error}</p>
        <Button variant="outline" onClick={() => navigate('/pages')}>返回页面列表</Button>
      </div>
    );
  }

  if (result.status === 'not-found') {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">页面不存在</p>
        <Button variant="outline" onClick={() => navigate('/pages')}>返回页面列表</Button>
      </div>
    );
  }

  if (result.viewModel.isFixedLayout) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">此页面类型不支持编辑积木</p>
        <Button variant="outline" onClick={() => navigate('/pages')}>返回页面列表</Button>
      </div>
    );
  }

  return (
    <PageBuilderView
      viewModel={result.viewModel}
      actions={result.actions}
      editors={editors}
      resources={resources}
      onBack={() => result.actions.requestExit(() => navigate('/pages'))}
    />
  );
}
