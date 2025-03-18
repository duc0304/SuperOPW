import { Client as AppClient } from '../clients/mock_clients';

/**
 * Trong ứng dụng này, có 2 loại Client:
 * 1. Client từ clients/mock_clients.ts (AppClient) - sử dụng trong module Clients
 * 2. Client được định nghĩa trong contracts/types.ts - là phiên bản đơn giản hơn sử dụng trong module Contracts
 * 
 * Không được sử dụng lẫn lộn 2 loại này.
 * Nếu cần lấy dữ liệu từ một Client dạng này sang dạng kia, hãy chuyển đổi bằng hàm map.
 */
export interface Client {
  id: string;
  name: string;
  email: string;
  type: string;
  shortName?: string;
  clientNumber?: string;
}

// Hàm chuyển đổi từ AppClient sang Client
export function mapAppClientToContractClient(appClient: AppClient): Client {
  return {
    id: appClient.id,
    name: appClient.companyName,
    email: `contact@${appClient.shortName.toLowerCase()}.com`,
    type: appClient.clientCategory || 'default',
    shortName: appClient.shortName,
    clientNumber: appClient.clientNumber
  };
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
  client?: Client;
  liability?: Liability;
  financial?: Financial;
  cardDetails?: CardDetails;
  children?: ContractNode[];
}

// Mock data sẽ được định nghĩa trong một file riêng 