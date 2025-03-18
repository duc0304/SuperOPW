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

// Interface cho dữ liệu Client từ API
export interface ApiClient {
  id: string;
  companyName: string;
  shortName: string;
  clientNumber: string;
  cityzenship: string;
  dateOpen: string | null;
  status: 'active' | 'inactive';
}

// Các hàm gọi API Auth
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

// Các hàm gọi API Client
export const clientService = {
  // Lấy tất cả clients
  getAllClients: async () => {
    return api.get('/clients');
  },
  
  // Lấy chi tiết một client
  getClient: async (id: string) => {
    return api.get(`/clients/${id}`);
  },
  
  // Thêm client mới
  createClient: async (clientData: Omit<ApiClient, 'id'>) => {
    return api.post('/clients', clientData);
  },
  
  // Cập nhật client
  updateClient: async (id: string, clientData: Partial<Omit<ApiClient, 'id'>>) => {
    return api.put(`/clients/${id}`, clientData);
  },
  
  // Xóa client
  deleteClient: async (id: string) => {
    return api.delete(`/clients/${id}`);
  }
};

export default api;