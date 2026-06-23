import { useCallback, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  InquiriesActions,
  InquiriesViewModel,
  Inquiry,
  InquiryListFilters,
  InquiryStatus,
} from '@/package/types';
import { getInquiries, updateInquiryStatus, deleteInquiry } from '../api/inquiries.api';
import { inquiryKeys } from '../api/inquiries.keys';
import { toPaginatedInquiries } from './inquiry.mapper';
import { buildInquiryText, buildInquiriesCsv, buildInquiryTextFilename, buildInquiriesCsvFilename, downloadTextFile } from './inquiry.exports';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 400;

export function useInquiriesList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | InquiryStatus>('all');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const filters: InquiryListFilters = {
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    status: status === 'all' ? undefined : status,
  };

  const {
    data: rawData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: inquiryKeys.list(filters),
    queryFn: () => getInquiries(filters),
    placeholderData: (prev) => prev,
  });

  const paginated = useMemo(
    () => (rawData ? toPaginatedInquiries(rawData) : undefined),
    [rawData],
  );
  const inquiries = useMemo(() => paginated?.data ?? [], [paginated?.data]);
  const pagination = paginated?.pagination;
  const pendingCount = inquiries.filter((i) => i.status === 'pending').length;

  const selectedInquiry = selectedId !== null
    ? inquiries.find((i) => i.id === selectedId) ?? null
    : null;

  const debouncedSetSearch = useCallback((value: string) => {
    setSearch(value);
    setSelectedId(null);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(1);
    }, DEBOUNCE_MS);
  }, []);

  const viewModel: InquiriesViewModel = {
    inquiries,
    selectedInquiry,
    pendingCount,
    page,
    pageSize: PAGE_SIZE,
    total: pagination?.total ?? 0,
    totalPages: pagination?.totalPages ?? 0,
    search,
    status,
    isLoading,
    isFetching,
    error: error?.message ?? null,
  };

  const actions: InquiriesActions = {
    changeSearch: debouncedSetSearch,
    changeStatus: useCallback((value: 'all' | InquiryStatus) => {
      setStatus(value);
      setPage(1);
      setSelectedId(null);
    }, []),
    changePage: useCallback((newPage: number) => {
      setPage(newPage);
      setSelectedId(null);
    }, []),
    selectInquiry: useCallback((id: number | null) => {
      setSelectedId(id);
    }, []),
    updateStatus: useCallback(async (id: number, newStatus: InquiryStatus) => {
      await updateInquiryStatus(id, newStatus);
      queryClient.setQueriesData<ReturnType<typeof toPaginatedInquiries>>(
        { queryKey: inquiryKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((i) =>
              i.id === id ? { ...i, status: newStatus } : i,
            ),
          };
        },
      );
    }, [queryClient]),
    removeInquiry: useCallback(async (id: number) => {
      await deleteInquiry(id);
      queryClient.setQueriesData<ReturnType<typeof toPaginatedInquiries>>(
        { queryKey: inquiryKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((i) => i.id !== id),
            pagination: {
              ...old.pagination,
              total: Math.max(0, old.pagination.total - 1),
            },
          };
        },
      );
      if (selectedId === id) setSelectedId(null);
      if (inquiries.length <= 1 && page > 1) {
        setPage(page - 1);
      }
    }, [queryClient, selectedId, inquiries.length, page]),
    exportInquiry: useCallback((inquiry: Inquiry) => {
      const content = buildInquiryText(inquiry);
      const filename = buildInquiryTextFilename(inquiry);
      downloadTextFile(content, filename, 'text/plain');
    }, []),
    exportCurrentPage: useCallback(() => {
      const content = buildInquiriesCsv(inquiries);
      const filename = buildInquiriesCsvFilename();
      downloadTextFile(content, filename, 'text/csv');
    }, [inquiries]),
    retry: useCallback(() => {
      refetch();
    }, [refetch]),
  };

  return { viewModel, actions };
}
