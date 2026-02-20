import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-neutral-700 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            currentPage === 1
              ? 'bg-neutral-800 text-gray-500 cursor-not-allowed'
              : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
          } rounded-xl`}
        >
          Предыдущая
        </button>
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium ${
            currentPage === totalPages
              ? 'bg-neutral-800 text-gray-500 cursor-not-allowed'
              : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
          } rounded-xl`}
        >
          Следующая
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Страница <span className="font-medium">{currentPage}</span> из <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
            <button
              onClick={handlePrevClick}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-500 ring-1 ring-inset ${
                currentPage === 1
                  ? 'ring-neutral-700 bg-neutral-800 cursor-not-allowed'
                  : 'ring-neutral-600 hover:bg-neutral-700 focus:z-20 focus:outline-offset-0'
              }`}
            >
              <span className="sr-only">Предыдущая</span>
              &larr;
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? 'z-10 bg-neutral-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600'
                    : 'text-gray-300 ring-1 ring-inset ring-neutral-600 hover:bg-neutral-700 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNextClick}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-500 ring-1 ring-inset ${
                currentPage === totalPages
                  ? 'ring-neutral-700 bg-neutral-800 cursor-not-allowed'
                  : 'ring-neutral-600 hover:bg-neutral-700 focus:z-20 focus:outline-offset-0'
              }`}
            >
              <span className="sr-only">Следующая</span>
              &rarr;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;