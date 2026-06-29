import { useEffect, useMemo, useState } from 'react';
import { api } from '@/core/lib/api';
import {
  createInquiriesCsvExport,
  createInquiriesCsvFilename,
  createInquiryTextExport,
  createInquiryTextFilename,
  downloadTextFile,
} from './inquiryExport';
import { countPendingInquiries, filterInquiries } from './inquiryFilter';
import type { Inquiry, InquiryStatus, InquiryStatusFilter } from './inquiryTypes';

interface InquiryManagementNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface InquiryManagementMessages {
  loadFailure: string;
  markProcessedSuccess: string;
  markPendingSuccess: string;
  updateFailure: string;
  deleteConfirm: string;
  deleteSuccess: string;
  deleteFailure: string;
  exportSuccess: string;
}

export interface UseInquiryManagementOptions {
  confirmDelete?: (message: string) => boolean;
  messages?: Partial<InquiryManagementMessages>;
  notify?: InquiryManagementNotifier;
}

const DEFAULT_MESSAGES: InquiryManagementMessages = {
  loadFailure: '无法获取询盘数据',
  markProcessedSuccess: '已标记为已处理',
  markPendingSuccess: '已还原为待处理',
  updateFailure: '更新状态失败',
  deleteConfirm: '确定要删除这条询盘吗？此操作不可撤销。',
  deleteSuccess: '已删除询盘',
  deleteFailure: '删除失败',
  exportSuccess: '导出成功',
};

export function useInquiryManagement(options: UseInquiryManagementOptions = {}) {
  const {
    confirmDelete,
    messages: customMessages,
    notify,
  } = options;
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatusFilter>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const filteredInquiries = useMemo(
    () => filterInquiries(inquiries, searchTerm, statusFilter),
    [inquiries, searchTerm, statusFilter]
  );
  const pendingCount = useMemo(() => countPendingInquiries(inquiries), [inquiries]);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await api.getInquiries();
      setInquiries((response.data || []) as Inquiry[]);
    } catch {
      notify?.error?.(messages.loadFailure);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id: number, status: InquiryStatus) => {
    try {
      await api.patchInquiry(id, { status });
      setInquiries(previous => previous.map(inquiry => (
        inquiry.id === id ? { ...inquiry, status } : inquiry
      )));
      setSelectedInquiry(previous => (
        previous?.id === id ? { ...previous, status } : previous
      ));
      notify?.success?.(
        status === 'processed' ? messages.markProcessedSuccess : messages.markPendingSuccess
      );
    } catch {
      notify?.error?.(messages.updateFailure);
    }
  };

  const deleteInquiry = async (id: number) => {
    if (confirmDelete && !confirmDelete(messages.deleteConfirm)) return;

    try {
      await api.deleteInquiry(id);
      setInquiries(previous => previous.filter(inquiry => inquiry.id !== id));
      setSelectedInquiry(previous => previous?.id === id ? null : previous);
      notify?.success?.(messages.deleteSuccess);
    } catch {
      notify?.error?.(messages.deleteFailure);
    }
  };

  const exportToTxt = (inquiry: Inquiry) => {
    downloadTextFile(
      createInquiryTextExport(inquiry),
      createInquiryTextFilename(inquiry),
      'text/plain;charset=utf-8'
    );
  };

  const exportAllToCsv = () => {
    downloadTextFile(
      createInquiriesCsvExport(filteredInquiries),
      createInquiriesCsvFilename(),
      'text/csv;charset=utf-8'
    );
    notify?.success?.(messages.exportSuccess);
  };

  return {
    filteredInquiries,
    inquiries,
    isLoading,
    pendingCount,
    searchTerm,
    selectedInquiry,
    statusFilter,
    deleteInquiry,
    exportAllToCsv,
    exportToTxt,
    fetchInquiries,
    setSearchTerm,
    setSelectedInquiry,
    setStatusFilter,
    updateStatus,
  };
}
