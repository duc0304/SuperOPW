/**
 * Các hàm tiện ích để làm việc với Oracle database
 */

// Chuyển đổi kết quả từ Oracle sang định dạng chuẩn
function formatOracleResult(result) {
  if (!result || !result.rows) {
    return [];
  }
  
  return result.rows;
}

// Xử lý lỗi Oracle
function handleOracleError(error) {
  console.error('Oracle Error:', error);
  
  // Tạo thông báo lỗi thân thiện hơn
  let errorMessage = 'Database error occurred';
  
  if (error.message) {
    errorMessage = error.message;
  }
  
  if (error.errorNum) {
    // Xử lý các mã lỗi Oracle cụ thể
    switch (error.errorNum) {
      case 1017:
        errorMessage = 'Invalid username/password';
        break;
      case 12154:
        errorMessage = 'Database connection error';
        break;
      case 942:
        errorMessage = 'Table or view does not exist';
        break;
      default:
        errorMessage = `Oracle error: ${error.message}`;
    }
  }
  
  return {
    message: errorMessage,
    code: error.errorNum || 500,
    details: error.message
  };
}

module.exports = {
  formatOracleResult,
  handleOracleError
}; 