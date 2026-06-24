import { useCallback, useRef, useState } from 'react';
import type {
  InquiriesActions,
  InquiriesViewModel,
  Inquiry,
  InquiryListFilters,
  PaginatedInquiriesDto,
  InquiryStatus,
} from '@/package/types';
import { getInquiries, updateInquiryStatus, deleteInquiry } from '../api/inquiries.api';
import { inquiryKeys } from '../api/inquiries.keys';
import { toPaginatedInquiries } from './inquiry.mapper';
import { buildInquiryText, buildInquiriesCsv, buildInquiryTextFilename, buildInquiriesCsvFilename, downloadTextFile } from './inquiry.exports';
import { usePaginatedEntityListController } from '@/core/entities';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 400;

export function useInquiriesList() {
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

  const listController = usePaginatedEntityListController<
    Inquiry,
    InquiryListFilters,
    PaginatedInquiriesDto,
    PaginatedInquiriesDto['pagination'],
    { id: number; status: InquiryStatus },
    number
  >({
    keys: inquiryKeys,
    filters,
    load: getInquiries,
    preservePreviousData: true,
    select: (response) => {
      const mapped = toPaginatedInquiries(response);
      return {
        items: mapped.data,
        pagination: mapped.pagination,
      };
    },
    mutations: {
      update: {
        execute: ({ id, status: nextStatus }) =>
          updateInquiryStatus(id, nextStatus),
        updateCachedLists: (current, _result, command) => {
          if (!current) return current;
          return {
            ...current,
            data: current.data.map((item) =>
              item.id === command.id
                ? { ...item, status: command.status }
                : item,
            ),
          };
        },
        invalidateLists: false,
      },
      remove: {
        execute: deleteInquiry,
        updateCachedLists: (current, _result, deletedId) => {
          if (!current) return current;
          return {
            ...current,
            data: current.data.filter((item) => item.id !== deletedId),
            pagination: {
              ...current.pagination,
              total: Math.max(0, current.pagination.total - 1),
            },
          };
        },
        invalidateLists: false,
      },
    },
  });

  const inquiries = listController.items;
  const pagination = listController.pagination;
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
    isLoading: listController.isLoading,
    isFetching: listController.isFetching,
    error:
      listController.mutationError?.message ??
      listController.error?.message ??
      null,
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
      await listController.update({ id, status: newStatus });
    }, [listController]),
    removeInquiry: useCallback(async (id: number) => {
      await listController.remove(id);
      if (selectedId === id) setSelectedId(null);
      if (inquiries.length <= 1 && page > 1) {
        setPage(page - 1);
      }
    }, [listController, selectedId, inquiries.length, page]),
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
      void listController.retry();
    }, [listController]),
  };

  return { viewModel, actions };
}
