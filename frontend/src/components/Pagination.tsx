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
    <div className="flex flex-col items-center mt-6 w-full max-w-4xl px-4 mx-auto">
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        <button
          disabled={pageNum === 1}
          onClick={() => onPageChange(pageNum - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 transition"

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
              className={`px-4 py-2 border rounded-md transition ${
                page === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100'
              }`}
              
            >
              {page}
            </button>
          )
        )}

        <button
          disabled={pageNum === totalPages}
          onClick={() => onPageChange(pageNum + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      <div className="flex justify-center w-full mt-4">
        <div className="inline-flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">Results per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:outline-none"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>


    </div>
  );
};

export default Pagination;
