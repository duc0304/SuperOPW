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
  
  // Tạo mảng các trang cần hiển thị
  const getPageNumbers = () => {
    // Hiển thị trang đầu, trang cuối và các trang gần trang hiện tại (giống ContractTree)
    const pages = [];
    
    for (let i = 1; i <= actualTotalPages; i++) {
      // Hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
      if (
        i === 1 ||
        i === actualTotalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } 
      // Thêm dấu ... (ellipsis) cho khoảng cách lớn
      else if (
        (i === 2 && currentPage > 3) ||
        (i === actualTotalPages - 1 && currentPage < actualTotalPages - 2)
      ) {
        pages.push(-i); // Giá trị âm để đánh dấu vị trí ellipsis
      }
    }
    
    return pages.filter((value, index, self) => 
      self.indexOf(value) === index // Loại bỏ trùng lặp
    );
  };
  
  const pageNumbers = getPageNumbers();

  // Rút gọn pageNumbers cho mobile - chỉ hiển thị trang hiện tại và 2 trang kề
  const getMobilePageNumbers = () => {
    const pages = [];
    
    // Chỉ hiển thị trang hiện tại và trang trước/sau nếu có
    for (let i = 1; i <= actualTotalPages; i++) {
      if (i === currentPage || i === currentPage - 1 || i === currentPage + 1) {
        pages.push(i);
      }
    }
    
    return pages.filter((value, index, self) => 
      self.indexOf(value) === index && value > 0 && value <= actualTotalPages
    );
  };
  
  const mobilePageNumbers = getMobilePageNumbers();
  
  return (
    <div className="mt-4">
      {/* Desktop version */}
      <div className="hidden md:flex md:items-center md:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Showing {startItem} to {endItem} of {totalItems} clients
        </div>
        <div className="flex justify-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
            }`}
          >
            Prev
          </button>
          
          {/* Page buttons */}
          {pageNumbers.map((page, index) => {
            // Xử lý hiển thị dấu "..." 
            if (page < 0) {
              return (
                <span key={`ellipsis-${index}`} className="px-2 self-end pb-1">
                  ...
                </span>
              );
            }
            
            // Hiển thị nút trang
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-md ${
                  page === currentPage 
                    ? 'bg-primary-600 text-white dark:bg-primary-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          {/* Next button */}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, actualTotalPages))}
            disabled={currentPage === actualTotalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === actualTotalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden">
        <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">
          Showing {startItem} to {endItem} of {totalItems} clients
        </div>
        <div className="flex justify-between items-center">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-2 py-0.5 text-[10px] rounded ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300'
            }`}
          >
            Prev
          </button>
          
          {/* Page buttons - simplified for mobile */}
          <div className="flex space-x-1 mx-1">
            {mobilePageNumbers.map((page) => (
              <button
                key={`mobile-page-${page}`}
                onClick={() => onPageChange(page)}
                className={`w-5 h-5 text-[10px] rounded ${
                  page === currentPage 
                    ? 'bg-primary-600 text-white dark:bg-primary-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          {/* Next button */}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, actualTotalPages))}
            disabled={currentPage === actualTotalPages}
            className={`px-2 py-0.5 text-[10px] rounded ${
              currentPage === actualTotalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 