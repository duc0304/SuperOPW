import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Tạo instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Định nghĩa kiểu dữ liệu
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Các hàm gọi API
export const authService = {
  register: async (userData: RegisterData) => {
    return api.post('/auth/register', userData);
  },
  login: async (credentials: LoginData) => {
    return api.post('/auth/login', credentials);
  },
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};

export default api;