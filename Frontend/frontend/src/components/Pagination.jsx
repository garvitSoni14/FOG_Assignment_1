import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  pagination, 
  onPageChange, 
  onPageSizeChange, 
  pageSizeOptions = [],
  loading = false 
}) => {
  if (!pagination) return null;

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    pageNumbers,
    nextPage,
    prevPage,
    showing
  } = pagination;

  const handlePageClick = (page) => {
    if (page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value);
    if (newPageSize !== itemsPerPage && !loading) {
      onPageSizeChange(newPageSize);
    }
  };

  const handlePrevClick = () => {
    if (hasPrevPage && !loading) {
      onPageChange(prevPage);
    }
  };

  const handleNextClick = () => {
    if (hasNextPage && !loading) {
      onPageChange(nextPage);
    }
  };

  // Don't render if there's only one page or no items
  if (totalPages <= 1) {
    return (
      <div className="pagination-container">
        <div className="pagination-info">
          <span className="showing-text">{showing}</span>
          {pageSizeOptions.length > 0 && (
            <div className="page-size-selector">
              <label htmlFor="page-size">Show:</label>
              <select 
                id="page-size"
                value={itemsPerPage} 
                onChange={handlePageSizeChange}
                disabled={loading}
                className="page-size-select"
              >
                {pageSizeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="showing-text">{showing}</span>
        {pageSizeOptions.length > 0 && (
          <div className="page-size-selector">
            <label htmlFor="page-size">Show:</label>
            <select 
              id="page-size"
              value={itemsPerPage} 
              onChange={handlePageSizeChange}
              disabled={loading}
              className="page-size-select"
            >
              {pageSizeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className={`pagination-btn prev-btn ${!hasPrevPage ? 'disabled' : ''}`}
          onClick={handlePrevClick}
          disabled={!hasPrevPage || loading}
          aria-label="Previous page"
        >
          <span className="btn-text">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="page-numbers">
          {/* First page if not in visible range */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                className="pagination-btn page-btn"
                onClick={() => handlePageClick(1)}
                disabled={loading}
                aria-label="Go to page 1"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="pagination-ellipsis">...</span>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {pageNumbers.map(pageNum => (
            <button
              key={pageNum}
              className={`pagination-btn page-btn ${pageNum === currentPage ? 'active' : ''}`}
              onClick={() => handlePageClick(pageNum)}
              disabled={loading}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}

          {/* Last page if not in visible range */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button
                className="pagination-btn page-btn"
                onClick={() => handlePageClick(totalPages)}
                disabled={loading}
                aria-label={`Go to page ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          className={`pagination-btn next-btn ${!hasNextPage ? 'disabled' : ''}`}
          onClick={handleNextClick}
          disabled={!hasNextPage || loading}
          aria-label="Next page"
        >
          <span className="btn-text">Next</span>
        </button>
      </div>

      {/* Page Info */}
      <div className="pagination-summary">
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default Pagination;
