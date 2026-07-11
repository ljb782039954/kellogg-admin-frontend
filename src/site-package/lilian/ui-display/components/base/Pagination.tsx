import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
  totalText?: string;
}

function getPageItems(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPages) pages.add(page);
  }

  return [...pages]
    .sort((a, b) => a - b)
    .reduce<Array<number | "ellipsis">>((items, page, index, sortedPages) => {
      if (index > 0 && page - sortedPages[index - 1] > 1) items.push("ellipsis");
      items.push(page);
      return items;
    }, []);
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalCount,
  totalText,
}: PaginationProps) {
  const pageItems = getPageItems(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-10 w-10 items-center justify-center border border-border bg-surface text-ink-strong transition-colors hover:border-ink-strong disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageItems.map((item, index) => item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="w-6 text-center text-sm text-subtle" aria-hidden="true">...</span>
        ) : (
          <button
            key={item}
            onClick={() => handlePageChange(item)}
            className={`flex h-10 w-10 items-center justify-center border text-xs font-medium transition-colors ${
              currentPage === item
                ? 'border-ink-strong bg-ink-strong text-on-dark'
                : 'border-border bg-surface text-body hover:border-ink-strong hover:text-ink-strong'
            }`}
          >
            {item}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 items-center justify-center border border-border bg-surface text-ink-strong transition-colors hover:border-ink-strong disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {totalCount !== undefined && (
        <div className="mt-5 text-center text-[11px] uppercase tracking-[0.14em] text-subtle">
          {totalText || `${totalCount}`}
        </div>
      )}
    </div>
  );
}
