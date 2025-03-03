class ApiError {
  constructor(statusCode, message, errors = []) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    this.data = null;
  }
}

module.exports = { ApiError }; 