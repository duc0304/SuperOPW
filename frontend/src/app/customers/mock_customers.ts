export interface Customer {
  id: string;
  companyName: string;
  shortName: string;
  clientNumber: string;
  clientTypeCode: string;
  reasonCode: string;
  reason: string;
  institutionCode: string;
  branch: string;
  clientCategory: string;
  productCategory: string;
  status: 'active' | 'inactive';
  contractsCount: number;
}

export type FilterCriteria = 'Most Contracts' | 'Latest Customers' | 'Oldest Customers' | null;
export type StatusFilter = 'all' | 'active' | 'inactive';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
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
  },
  {
    id: '2',
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
  },
  {
    id: '3',
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
  },
  {
    id: '4',
    companyName: 'Retail Chain Inc',
    shortName: 'RetChain',
    clientNumber: 'CL-004',
    clientTypeCode: 'RETL',
    reasonCode: 'RC003',
    reason: 'Partnership',
    institutionCode: 'INST03',
    branch: 'Danang Branch',
    clientCategory: 'Retail',
    productCategory: 'Commerce',
    status: 'active',
    contractsCount: 2,
  },
  {
    id: '5',
    companyName: 'Financial Services Group',
    shortName: 'FinServ',
    clientNumber: 'CL-005',
    clientTypeCode: 'FIN',
    reasonCode: 'RC001',
    reason: 'New Business',
    institutionCode: 'INST01',
    branch: 'HCM Branch',
    clientCategory: 'Financial',
    productCategory: 'Banking',
    status: 'inactive',
    contractsCount: 0,
  },
  {
    id: '6',
    companyName: 'Innovatech Ltd',
    shortName: 'InnoTech',
    clientNumber: 'CL-006',
    clientTypeCode: 'TECH',
    reasonCode: 'RC006',
    reason: 'New Market Entry',
    institutionCode: 'INST06',
    branch: 'Hanoi Branch',
    clientCategory: 'Technology',
    productCategory: 'Software',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '7',
    companyName: 'Healthcare Solutions Co',
    shortName: 'HealthSol',
    clientNumber: 'CL-007',
    clientTypeCode: 'HLT',
    reasonCode: 'RC007',
    reason: 'New Market Entry',
    institutionCode: 'INST07',
    branch: 'HCM Branch',
    clientCategory: 'Healthcare',
    productCategory: 'Medical',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '8',
    companyName: 'Education Institute',
    shortName: 'EduInst',
    clientNumber: 'CL-008',
    clientTypeCode: 'EDU',
    reasonCode: 'RC008',
    reason: 'New Market Entry',
    institutionCode: 'INST08',
    branch: 'Hanoi Branch',
    clientCategory: 'Education',
    productCategory: 'Training',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '9',
    companyName: 'Entertainment Group',
    shortName: 'Entertain',
    clientNumber: 'CL-009',
    clientTypeCode: 'ENT',
    reasonCode: 'RC009',
    reason: 'New Market Entry',
    institutionCode: 'INST09',
    branch: 'HCM Branch',
    clientCategory: 'Entertainment',
    productCategory: 'Media',
    status: 'inactive',
    contractsCount: 0,
  },
  {
    id: '10',
    companyName: 'Construction Company',
    shortName: 'Constr',
    clientNumber: 'CL-010',
    clientTypeCode: 'CON',
    reasonCode: 'RC010',
    reason: 'New Market Entry',
    institutionCode: 'INST10',
    branch: 'Hanoi Branch',
    clientCategory: 'Construction',
    productCategory: 'Construction', 
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '11',
    companyName: 'Construction Company',
    shortName: 'Constr',
    clientNumber: 'CL-011',
    clientTypeCode: 'CON',
    reasonCode: 'RC011',
    reason: 'New Market Entry',
    institutionCode: 'INST11',
    branch: 'Hanoi Branch',
    clientCategory: 'Construction',
    productCategory: 'Construction',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '12',
    companyName: 'Construction Company',
    shortName: 'Constr',
    clientNumber: 'CL-012',
    clientTypeCode: 'CON',
    reasonCode: 'RC012',
    reason: 'New Market Entry',
    institutionCode: 'INST12',
    branch: 'Hanoi Branch',
    clientCategory: 'Construction',
    productCategory: 'Construction',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '13',
    companyName: 'Construction Company',
    shortName: 'Constr',
    clientNumber: 'CL-013',
    clientTypeCode: 'CON',
    reasonCode: 'RC013',
    reason: 'New Market Entry',
    institutionCode: 'INST13',
    branch: 'Hanoi Branch',
    clientCategory: 'Construction',
    productCategory: 'Construction',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '14',
    companyName: 'Construction Company',
    shortName: 'Constr',
    clientNumber: 'CL-014',
    clientTypeCode: 'CON',
    reasonCode: 'RC014',
    reason: 'New Market Entry',
    institutionCode: 'INST14',
    branch: 'Hanoi Branch',
    clientCategory: 'Construction',
    productCategory: 'Construction',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '15',
    companyName: 'Construction Company',
    shortName: 'Constr',
    clientNumber: 'CL-015',
    clientTypeCode: 'CON',
    reasonCode: 'RC015',
    reason: 'New Market Entry',
    institutionCode: 'INST15',
    branch: 'Hanoi Branch',
    clientCategory: 'Construction',
    productCategory: 'Construction',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '16',
    companyName: 'Construction Company',
    shortName: 'Constr',
    clientNumber: 'CL-016',
    clientTypeCode: 'CON',
    reasonCode: 'RC016',
    reason: 'New Market Entry',
    institutionCode: 'INST16',
    branch: 'Hanoi Branch',
    clientCategory: 'Construction',
    productCategory: 'Construction',
    status: 'active',
    contractsCount: 0,
  },
  {
    id: '17',
    companyName: 'Tech Solutions',
    shortName: 'TechSol',
    clientNumber: 'CL-011',
    clientTypeCode: 'TEC',
    reasonCode: 'RC011',
    reason: 'Digital Expansion',
    institutionCode: 'INST11',
    branch: 'Saigon Branch',
    clientCategory: 'Technology',
    productCategory: 'Software',
    status: 'active',
    contractsCount: 2,
  },
  {
    id: '18',
    companyName: 'Green Energy Ltd',
    shortName: 'GreenEn',
    clientNumber: 'CL-012',
    clientTypeCode: 'ENE',
    reasonCode: 'RC012',
    reason: 'Sustainable Initiatives',
    institutionCode: 'INST12',
    branch: 'Danang Branch',
    clientCategory: 'Energy',
    productCategory: 'Renewable',
    status: 'active',  
    contractsCount: 5,
  },
  {
    id: '19',
    companyName: 'Finance Group',
    shortName: 'FinGrp',
    clientNumber: 'CL-013',
    clientTypeCode: 'FIN',
    reasonCode: 'RC013',
    reason: 'Market Expansion',
    institutionCode: 'INST13',
    branch: 'Hanoi Branch',
    clientCategory: 'Finance',
    productCategory: 'Banking',
    status: 'active',
    contractsCount: 3,
  },
  {
    id: '20',
    companyName: 'Healthcare Partners',
    shortName: 'HealthP',
    clientNumber: 'CL-014',
    clientTypeCode: 'HEA',
    reasonCode: 'RC014',
    reason: 'Medical Innovation',
    institutionCode: 'INST14',
    branch: 'Saigon Branch',
    clientCategory: 'Healthcare',
    productCategory: 'Medical Equipment',
    status: 'inactive',
    contractsCount: 0,
  },
  {
    id: '21',
    companyName: 'Automotive Solutions',
    shortName: 'AutoSol',
    clientNumber: 'CL-015',
    clientTypeCode: 'AUT',
    reasonCode: 'RC015',
    reason: 'New Product Launch',
    institutionCode: 'INST15',
    branch: 'Hanoi Branch',
    clientCategory: 'Automotive',
    productCategory: 'Manufacturing',
    status: 'active',
    contractsCount: 1,
  },
  {
    id: '22',
    companyName: 'Retail Ventures',
    shortName: 'RetVen',
    clientNumber: 'CL-016',
    clientTypeCode: 'RET',
    reasonCode: 'RC016',
    reason: 'E-commerce Growth',
    institutionCode: 'INST16',
    branch: 'Danang Branch',
    clientCategory: 'Retail',
    productCategory: 'E-commerce',
    status: 'active',
    contractsCount: 4,
  },
  {
    id: '23',
    companyName: 'Agriculture Corp',
    shortName: 'AgriCo',
    clientNumber: 'CL-017',
    clientTypeCode: 'AGR',
    reasonCode: 'RC017',
    reason: 'Sustainable Farming',
    institutionCode: 'INST17',
    branch: 'Saigon Branch',
    clientCategory: 'Agriculture',
    productCategory: 'Organic Products',
    status: 'active',
    contractsCount: 2,
  },
  {
    id: '24',
    companyName: 'Education Hub',
    shortName: 'EduHub',
    clientNumber: 'CL-018',
    clientTypeCode: 'EDU',
    reasonCode: 'RC018',
    reason: 'Online Learning Expansion',
    institutionCode: 'INST18',
    branch: 'Hanoi Branch',
    clientCategory: 'Education',
    productCategory: 'E-learning',
    status: 'active',
    contractsCount: 6,
  },
  {
    id: '25',
    companyName: 'Logistics Experts',
    shortName: 'LogExp',
    clientNumber: 'CL-019',
    clientTypeCode: 'LOG',
    reasonCode: 'RC019',
    reason: 'Global Shipping Network',
    institutionCode: 'INST19',
    branch: 'Danang Branch',
    clientCategory: 'Logistics',
    productCategory: 'Transportation',
    status: 'inactive',
    contractsCount: 0,
  },
  {
    id: '26',
    companyName: 'Media House',
    shortName: 'MediaH',
    clientNumber: 'CL-020',
    clientTypeCode: 'MED',
    reasonCode: 'RC020',
    reason: 'Content Expansion',
    institutionCode: 'INST20',
    branch: 'Saigon Branch',
    clientCategory: 'Media',
    productCategory: 'Broadcasting',
    status: 'active',
    contractsCount: 5,
  },
  {
    id: '27',
    companyName: 'Hospitality Group',
    shortName: 'HospGrp',
    clientNumber: 'CL-021',
    clientTypeCode: 'HOS',
    reasonCode: 'RC021',
    reason: 'Tourism Growth',
    institutionCode: 'INST21',
    branch: 'Hanoi Branch',
    clientCategory: 'Hospitality',
    productCategory: 'Hotels & Resorts',
    status: 'active',
    contractsCount: 3,
  },
  {
    id: '28',
    companyName: 'Fashion Brands',
    shortName: 'FashBr',
    clientNumber: 'CL-022',
    clientTypeCode: 'FAS',
    reasonCode: 'RC022',
    reason: 'New Market Expansion',
    institutionCode: 'INST22',
    branch: 'Danang Branch',
    clientCategory: 'Fashion',
    productCategory: 'Apparel',
    status: 'active',
    contractsCount: 2,
  },
  {
    id: '29',
    companyName: 'Food & Beverage Co.',
    shortName: 'FoodBev',
    clientNumber: 'CL-023',
    clientTypeCode: 'FOB',
    reasonCode: 'RC023',
    reason: 'Franchise Growth',
    institutionCode: 'INST23',
    branch: 'Saigon Branch',
    clientCategory: 'Food & Beverage',
    productCategory: 'Restaurants',
    status: 'active',
    contractsCount: 7,
  },
  {
    id: '30',
    companyName: 'Telecom Providers',
    shortName: 'TelecomP',
    clientNumber: 'CL-024',
    clientTypeCode: 'TEL',
    reasonCode: 'RC024',
    reason: '5G Network Expansion',
    institutionCode: 'INST24',
    branch: 'Hanoi Branch',
    clientCategory: 'Telecommunications',
    productCategory: 'Network Services',
    status: 'active',
    contractsCount: 8,
  },
  {
    id: '31',
    companyName: 'Cybersecurity Solutions',
    shortName: 'CyberSec',
    clientNumber: 'CL-025',
    clientTypeCode: 'CYB',
    reasonCode: 'RC025',
    reason: 'Data Protection Measures',
    institutionCode: 'INST25',
    branch: 'Danang Branch',
    clientCategory: 'Cybersecurity',
    productCategory: 'Software Security',
    status: 'active',
    contractsCount: 4,
  }
];

export const DEFAULT_FORM_DATA: Omit<Customer, 'id'> = {
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
  contractsCount: 0
}; 