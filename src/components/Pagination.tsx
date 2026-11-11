import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page: number) => {
    if (page === currentPage) return;
    onPageChange(page);
    const element = document.getElementById('collection-header');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav 
      aria-label="Product Pagination" 
      className="py-12 flex flex-col items-center justify-center gap-4"
    >
      <div className="inline-flex items-center gap-1 sm:gap-2 text-base font-medium">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2 text-neutral-500 hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {pages.map((page, index) => (
          <React.Fragment key={page}>
            {index > 0 && (
              <span className="text-neutral-300 font-light select-none px-1">|</span>
            )}
            <button
              onClick={() => handlePageClick(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`w-9 h-9 flex items-center justify-center text-sm font-semibold transition-all ${
                currentPage === page
                  ? 'bg-black text-white'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        ))}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2 text-neutral-500 hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-neutral-400 tabular-nums">
        {currentPage === 1 && 'Showing items 1 – 30 of 89'}
        {currentPage === 2 && 'Showing items 31 – 60 of 89'}
        {currentPage === 3 && 'Showing items 61 – 89 of 89'}
      </p>
    </nav>
  );
};
