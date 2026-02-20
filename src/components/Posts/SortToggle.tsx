interface SortToggleProps {
  sortOrder: 'ASC' | 'DESC';
  onToggle: () => void;
}

function SortToggle({ sortOrder, onToggle }: SortToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-gray-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
      title={sortOrder === 'ASC' ? 'По возрастанию' : 'По убыванию'}
    >
      <span className="text-sm font-medium">
        {sortOrder === 'ASC' ? 'По возрастанию' : 'По убыванию'}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 transition-transform ${sortOrder === 'ASC' ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
}

export default SortToggle;
