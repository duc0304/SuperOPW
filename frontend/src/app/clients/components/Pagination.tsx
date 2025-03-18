interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  isLoading = false
}: PaginationProps) {
  // Đảm bảo totalPages luôn ít nhất là 1
  const actualTotalPages = Math.max(1, totalPages);
  
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Log để debug
  console.log('Pagination render:', { currentPage, totalPages: actualTotalPages, totalItems, itemsPerPage });
  
  // Tạo mảng các trang cần hiển thị
  const getPageNumbers = () => {
    // Sử dụng actualTotalPages thay vì totalPages
    const maxPagesToShow = 5;
    
    if (actualTotalPages <= maxPagesToShow) {
      return Array.from({ length: actualTotalPages }, (_, i) => i + 1);
    }
    
    // Tính toán các trang cần hiển thị khi có nhiều trang
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > actualTotalPages) {
      endPage = actualTotalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    
    // Thêm dấu ... nếu cần
    if (startPage > 1) {
      pages.unshift(1);
      if (startPage > 2) pages.splice(1, 0, -1); // -1 đại diện cho dấu "..."
    }
    
    if (endPage < actualTotalPages) {
      if (endPage < actualTotalPages - 1) pages.push(-2); // -2 đại diện cho dấu "..." thứ hai
      pages.push(actualTotalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
        Showing {startItem} to {endItem} of {totalItems} customers
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === 1
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
          } transition-colors duration-200`}
        >
          Prev
        </button>
        
        {pageNumbers.map((page, index) => (
          page < 0 ? (
            // Hiển thị dấu "..." cho các trang bị bỏ qua
            <span 
              key={`ellipsis-${index}`} 
              className="px-3 py-1 text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
              } transition-colors duration-200`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, actualTotalPages))}
          disabled={currentPage === actualTotalPages}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === actualTotalPages
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
          } transition-colors duration-200`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 