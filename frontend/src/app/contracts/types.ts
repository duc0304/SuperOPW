export interface ContractNode {
  id: string;
  title: string;
  type: 'liability' | 'issuing' | 'transaction';
  status: 'active' | 'pending' | 'draft';
  value: number;
  startDate: string;
  endDate: string;
  // Additional fields based on type
  segment?: {
    branch: string;
    product: string;
    type: string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
    type: string;
  };
  liability?: {
    contractName: string;
    customerName: string;
    customerId: string;
    type: string;
  };
  financial?: {
    currency: string;
    available: number;
    balance: number;
  };
  transactionDetails?: {
    type: string;
    issueContract: string;
  };
  children?: ContractNode[];
} 