export interface Customer {
  id: string;
  name: string;
  email: string;
  type: string;
}

export interface Segment {
  institution: string;
  branch: string;
  product: string;
  serviceGroup: string;
  reportType: string;
  role: string;
}

export interface Liability {
  category: string;
  contractNumber: string;
  client: string;
}

export interface Financial {
  currency: string;
  available: number;
  balance: number;
  creditLimit: number;
  additionalLimit: number;
  blocked: number;
}

export interface CardDetails {
  type: string;
  issueContract: string;
}

export interface ContractNode {
  id: string;
  title: string;
  type: 'liability' | 'issuing' | 'card';
  status: 'active' | 'pending' | 'closed';
  startDate: string;
  endDate: string;
  value: number;
  segment?: Segment;
  customer?: Customer;
  liability?: Liability;
  financial?: Financial;
  cardDetails?: CardDetails;
  children?: ContractNode[];
}

// Mock data sẽ được định nghĩa trong một file riêng 