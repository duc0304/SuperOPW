import { Client as AppClient } from '../clients/mock_clients';

/**
 * Trong ứng dụng này, có 2 loại Client:
 * 1. Client từ clients/mock_clients.ts (AppClient) - sử dụng trong module Clients
 * 2. Client được định nghĩa trong contracts/types.ts - là phiên bản đơn giản hơn sử dụng trong module Contracts
 * 
 * Không được sử dụng lẫn lộn 2 loại này.
 * Nếu cần lấy dữ liệu từ một Client dạng này sang dạng kia, hãy chuyển đổi bằng hàm map.
 */

/**
 * Interface cho Oracle Contract - chứa dữ liệu thô từ API
 */
export interface OracleContract {
  AMND_DATE?: string;
  ID?: string;
  BRANCH?: string;
  CONTRACT_NUMBER?: string;
  CONTRACT_NAME?: string;
  CLIENT_ID?: string;
  TR_FIRST_NAM?: string;
  TR_LAST_NAM?: string;
  LIAB_CONTRACT?: string;
  ACNT_CONTRACT__OID?: string;
  CARD_NUMBER?: string;
  [key: string]: any; // Cho phép các trường khác từ API
}

/**
 * Interface đơn giản hóa cho Client
 */
export interface Client {
  id: string;
  name: string;
  clientNumber?: string;
}

/**
 * Hàm chuyển đổi từ AppClient sang Client
 */
export function mapAppClientToContractClient(appClient: AppClient): Client {
  return {
    id: appClient.id,
    name: appClient.companyName,
    clientNumber: appClient.clientNumber
  };
}

/**
 * Định nghĩa ContractNode đơn giản hóa
 * Chỉ giữ lại các trường cần thiết
 */
export interface ContractNode {
  id: string;
  title: string;
  type: 'liability' | 'issue' | 'card';
  children?: ContractNode[];
  oracleData?: OracleContract; // Lưu trữ dữ liệu gốc từ Oracle
  liability?: {
    contractNumber: string;
  };
}

/**
 * Hàm chuyển đổi từ OracleContract sang ContractNode
 * Đơn giản hóa, chỉ giữ lại các trường cần thiết
 */
export function mapOracleContractToContractNode(oracleContract: OracleContract): ContractNode {
  // Tạo ID duy nhất từ CONTRACT_NUMBER hoặc ID để tránh trùng lặp
  const uniqueId = oracleContract.ID || 
                   (oracleContract.CONTRACT_NUMBER ? `contract-${oracleContract.CONTRACT_NUMBER}` : '') || 
                   `oracle-contract-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id: uniqueId,
    title: oracleContract.CONTRACT_NAME || oracleContract.CONTRACT_NUMBER || 'Unnamed Contract',
    type: 'liability', // Mặc định là liability, sẽ được xác định lại trong getContractType
    liability: {
      contractNumber: oracleContract.CONTRACT_NUMBER || '',
    },
    oracleData: { // Lưu trữ dữ liệu gốc từ Oracle
      ...oracleContract
    }
  };
}

// Mock data sẽ được định nghĩa trong một file riêng 