import { toast } from 'sonner';
import { useInquiriesList } from '../../model/useInquiriesList';
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
