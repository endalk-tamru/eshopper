const Pagination = ({ pageNum, setPageNum, hasNextPage }) => {
  const adjustPage = (num) => {
    setPageNum((prev) => prev + num);
  };

  return (
    <div className="col-12 pb-1">
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center mb-3">
          {pageNum > 1 && (
            <li className="page-item">
              <button
                className="page-link"
                aria-label="Previous"
                onClick={() => adjustPage(-1)}
              >
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </button>
            </li>
          )}

          {pageNum > 2 && (
            <li className="page-item">
              <button className="page-link" onClick={() => adjustPage(-2)}>
                {pageNum - 2}
              </button>
            </li>
          )}

          {pageNum > 1 && (
            <li className="page-item">
              <button className="page-link" onClick={() => adjustPage(-1)}>
                {pageNum - 1}
              </button>
            </li>
          )}

          {/* current page */}
          <li className="page-item active">
            <button className="page-link">{pageNum}</button>
          </li>

          {hasNextPage > 0 && (
            <li className="page-item">
              <button className="page-link" onClick={() => adjustPage(1)}>
                {pageNum + 1}
              </button>
            </li>
          )}

          {hasNextPage > 0 && (
            <li className="page-item">
              <button
                className="page-link"
                aria-label="Next"
                onClick={() => adjustPage(1)}
              >
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
