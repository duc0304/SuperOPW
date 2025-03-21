// Import Client từ API thay vì từ Redux store
import type { Client } from '@/services/api';
import type { StatusFilter, FilterCriteria } from '@/redux/slices/clientSlice';

// Re-export các type còn lại
export type { StatusFilter, FilterCriteria };

// Giá trị mặc định cho form thêm mới client
export const DEFAULT_FORM_DATA: Omit<Client, 'ID'> = {
  companyName: '',
  shortName: '',
  clientNumber: '',
  clientTypeCode: '',
  reasonCode: '',
  reason: '',
  institutionCode: '',
  branch: '',
  clientCategory: '',
  productCategory: '',
  status: 'active',
  contractsCount: 0,
  cityzenship: '',
  dateOpen: null
};

// Dữ liệu mẫu - chỉ sử dụng khi cần test UI mà không có backend
export const MOCK_CLIENTS: Client[] = [
  {
    ID: '1',
    companyName: 'Enterprise Corporation',
    shortName: 'EnterCorp',
    clientNumber: 'CL-001',
    clientTypeCode: 'CORP',
    reasonCode: 'RC001',
    reason: 'New Business',
    institutionCode: 'INST01',
    branch: 'HCM Branch',
    clientCategory: 'Corporate',
    productCategory: 'Banking',
    status: 'active',
    contractsCount: 3,
    cityzenship: 'Vietnam',
    dateOpen: '2022-01-15',
  },
  {
    ID: '2',
    companyName: 'Tech Solutions Ltd',
    shortName: 'TechSol',
    clientNumber: 'CL-002',
    clientTypeCode: 'TECH',
    reasonCode: 'RC002',
    reason: 'Service Expansion',
    institutionCode: 'INST02',
    branch: 'Hanoi Branch',
    clientCategory: 'SME',
    productCategory: 'Technology',
    status: 'inactive',
    contractsCount: 1,
    cityzenship: 'Singapore',
    dateOpen: '2022-03-22',
  },
  {
    ID: '3',
    companyName: 'Global Trading Co',
    shortName: 'GTC',
    clientNumber: 'CL-003',
    clientTypeCode: 'TRAD',
    reasonCode: 'RC001',
    reason: 'New Business',
    institutionCode: 'INST01',
    branch: 'HCM Branch',
    clientCategory: 'Corporate',
    productCategory: 'Trading',
    status: 'active',
    contractsCount: 5,
    cityzenship: 'United States',
    dateOpen: '2022-05-10',
  }
]; 