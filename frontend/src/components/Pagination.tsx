interface PaginationProps {
  pageNum: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  pageNum,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const totalNumbers = 5;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return [...Array(totalPages).keys()].map((n) => n + 1);
    }

    const pages: (number | string)[] = [];
    const left = Math.max(2, pageNum - 1);
    const right = Math.min(totalPages - 1, pageNum + 1);

    pages.push(1); // first page always

    if (left > 2) pages.push('...');

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push('...');

    pages.push(totalPages); // last page always

    return pages;
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        <button
          disabled={pageNum === 1}
          onClick={() => onPageChange(pageNum - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {getPageNumbers().map((page, i) =>
          typeof page === 'string' ? (
            <span key={i} className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded ${
                page === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          disabled={pageNum === totalPages}
          onClick={() => onPageChange(pageNum + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <label className="text-sm">
        Results per page:&nbsp;
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // reset to page 1
          }}
          className="border px-2 py-1 rounded"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </div>
  );
};

export default Pagination;
