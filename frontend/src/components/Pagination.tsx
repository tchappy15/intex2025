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
    return (
      <div className="flex item-center justify-center mt-4">
        <button disabled={pageNum === 1} onClick={() => onPageChange(pageNum - 1)}>
          Previous
        </button>
  
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            disabled={pageNum === i + 1}
          >
            {i + 1}
          </button>
        ))}
  
        <button
          disabled={pageNum === totalPages}
          onClick={() => onPageChange(pageNum + 1)}
        >
          Next
        </button>
  
        <br />
        {/* getting pagination into our page */}
        <label>
          Results per page:
          {/* using inline function below */}
          <select
            value={pageSize}
            onChange={(p) => {
              onPageSizeChange(Number(p.target.value));
              onPageChange(1); //resetting pagenum back to one
            }}
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
  