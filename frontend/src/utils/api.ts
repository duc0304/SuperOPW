import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Định nghĩa interface cho API Response
interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

// Định nghĩa interface cho API Error
interface ApiError {
  status: number;
  message: string;
  errors: string[];
}

// Base URL for API - có thể lấy từ biến môi trường
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor cho requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage nếu có
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Trích xuất data từ response nếu có cấu trúc API Response
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    
    return response.data;
  },
  (error: AxiosError) => {
    // Xử lý lỗi từ API
    const errorResponse = error.response?.data as ApiError | undefined;
    
    if (errorResponse && errorResponse.errors) {
      // Trả về lỗi từ API nếu có cấu trúc ApiError
      return Promise.reject({
        message: errorResponse.message || 'Đã xảy ra lỗi',
        errors: errorResponse.errors || []
      });
    }
    
    // Trả về lỗi mặc định nếu không có cấu trúc cụ thể
    return Promise.reject({
      message: error.message || 'Đã xảy ra lỗi',
      errors: []
    });
  }
);

// Hàm fetch data từ API
export const fetchData = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.get(url, config);
    return response;
  } catch (error) {
    console.error(`Lỗi khi gọi API GET ${url}:`, error);
    throw error;
  }
};

// Hàm post data lên API
export const postData = async (url: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response;
  } catch (error) {
    console.error(`Lỗi khi gọi API POST ${url}:`, error);
    throw error;
  }
};

// Hàm update data
export const updateData = async (url: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.put(url, data, config);
    return response;
  } catch (error) {
    console.error(`Lỗi khi gọi API PUT ${url}:`, error);
    throw error;
  }
};

// Hàm update một phần của data
export const patchData = async (url: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.patch(url, data, config);
    return response;
  } catch (error) {
    console.error(`Lỗi khi gọi API PATCH ${url}:`, error);
    throw error;
  }
};

// Hàm xóa data
export const deleteData = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response;
  } catch (error) {
    console.error(`Lỗi khi gọi API DELETE ${url}:`, error);
    throw error;
  }
}; 