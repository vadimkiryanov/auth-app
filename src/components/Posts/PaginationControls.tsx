interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onNext,
  onPrev
}: PaginationControlsProps) {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Show limited number of page buttons (e.g., current page ± 2)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Назад
        </button>

        {/* Page numbers with ellipsis */}
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={`${page}-${index}`} className="px-2 py-2">
              {page}
            </span>
          )
        ))}

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Вперед
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Страница {currentPage} из {totalPages} • Всего постов: {totalItems}
      </div>
    </div>
  );
}

export default PaginationControls;