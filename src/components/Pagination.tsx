import React, { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPage?: boolean;
  showPageInfo?: boolean;
  showPageJump?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  showItemsPerPage = true,
  showPageInfo = true,
  showPageJump = true,
}) => {
  const [jumpPage, setJumpPage] = useState('');

  const handlePageChange = (page: number) => {
    onPageChange(Math.max(1, Math.min(page, totalPages)));
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      setJumpPage('');
    }
  };

  const handleJumpPageKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    onItemsPerPageChange(newItemsPerPage);
    onPageChange(1); // Reset to first page when changing items per page
  };

  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div style={{ 
      marginTop: 16, 
      display: "flex", 
      flexDirection: "column",
      gap: 12
    }}>
      {/* Items per page selector */}
      {showItemsPerPage && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label htmlFor="itemsPerPage" style={{ fontSize: "14px", marginRight: 4 }}>
            每頁顯示:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{ 
              padding: "4px 8px", 
              borderRadius: 4, 
              border: "1px solid #ccc",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span style={{ fontSize: "14px", color: "#666", marginLeft: 4 }}>
            筆 (共 {totalItems} 筆)
          </span>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: 8, 
          flexWrap: "wrap" 
        }}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              backgroundColor: currentPage === 1 ? "#f0f0f0" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            第一頁
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              backgroundColor: currentPage === 1 ? "#f0f0f0" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            上一頁
          </button>
          
          {showPageInfo && (
            <span style={{ 
              padding: "6px 12px",
              fontSize: "14px",
              fontWeight: 500
            }}>
              第 {currentPage} / {totalPages} 頁
            </span>
          )}

          {showPageJump && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 4 
            }}>
              <label htmlFor="jumpPage" style={{ fontSize: "14px" }}>
                跳至:
              </label>
              <input
                id="jumpPage"
                type="number"
                min="1"
                max={totalPages}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyPress={handleJumpPageKeyPress}
                placeholder={currentPage.toString()}
                style={{
                  width: "60px",
                  padding: "4px 6px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  textAlign: "center"
                }}
              />
              <button
                onClick={handleJumpToPage}
                disabled={!jumpPage || isNaN(parseInt(jumpPage)) || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages}
                style={{
                  padding: "4px 12px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  backgroundColor: "#007bff",
                  color: "white",
                  cursor: (!jumpPage || isNaN(parseInt(jumpPage)) || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages) ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  opacity: (!jumpPage || isNaN(parseInt(jumpPage)) || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages) ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (jumpPage && !isNaN(parseInt(jumpPage)) && parseInt(jumpPage) >= 1 && parseInt(jumpPage) <= totalPages) {
                    e.currentTarget.style.backgroundColor = "#0056b3";
                  }
                }}
                onMouseLeave={(e) => {
                  if (jumpPage && !isNaN(parseInt(jumpPage)) && parseInt(jumpPage) >= 1 && parseInt(jumpPage) <= totalPages) {
                    e.currentTarget.style.backgroundColor = "#007bff";
                  }
                }}
              >
                前往
              </button>
            </div>
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              backgroundColor: currentPage === totalPages ? "#f0f0f0" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            下一頁
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              backgroundColor: currentPage === totalPages ? "#f0f0f0" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            最後一頁
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;

