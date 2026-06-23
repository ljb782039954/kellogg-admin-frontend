import { toast } from 'sonner';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import { useInquiriesList } from '@/features/inquiries/model/useInquiriesList';
import { InquiriesView } from './InquiriesView';

export function InquiriesManager() {
  const { viewModel, actions } = useInquiriesList();

  const handleDelete = async (inquiry: { id: number; name: string }) => {
    if (!window.confirm('确定要删除这条询盘吗？此操作不可撤销。')) return;
    try {
      await actions.removeInquiry(inquiry.id);
      toast.success('已删除询盘');
    } catch {
      toast.error('删除失败');
    }
  };

  return (
    <InquiriesView
      viewModel={viewModel}
      actions={actions}
      onDelete={handleDelete}
    />
  );
}
