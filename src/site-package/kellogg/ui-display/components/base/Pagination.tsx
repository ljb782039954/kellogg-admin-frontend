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
          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {pageItems.map((item, index) => item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="w-6 text-center text-gray-400" aria-hidden="true">...</span>
        ) : (
          <button
            key={item}
            onClick={() => handlePageChange(item)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              currentPage === item
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {item}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {totalCount !== undefined && (
        <div className="text-center mt-6 text-sm text-gray-500">
          {totalText || `${totalCount}`}
        </div>
      )}
    </div>
  );
}
