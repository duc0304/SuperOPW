

/**
 * Trong ứng dụng này, sử dụng Client từ services/api.ts
 * Không sử dụng định nghĩa Client riêng cho contracts nữa
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
  CLIENT__ID?: string;
  TR_FIRST_NAM?: string;
  TR_LAST_NAM?: string;
  LIAB_CONTRACT?: string;
  ACNT_CONTRACT__OID?: string;
  CARD_NUMBER?: string;
  [key: string]: any; // Cho phép các trường khác từ API
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
  
  // Xác định loại contract dựa vào dữ liệu
  // LIAB contracts: không có LIAB_CONTRACT và không có ACNT_CONTRACT__OID
  let contractType: 'liability' | 'issue' | 'card' = 'liability';
  
  // Debug các trường quan trọng
  console.log(`Contract ${oracleContract.CONTRACT_NUMBER || uniqueId} info:`, {
    id: uniqueId,
    acntOid: oracleContract.ACNT_CONTRACT__OID,
    liabContract: oracleContract.LIAB_CONTRACT
  });
  
  if (oracleContract.ACNT_CONTRACT__OID) {
    contractType = 'card';
    console.log(`Contract ${oracleContract.CONTRACT_NUMBER || uniqueId} is a CARD contract`);
  } else if (oracleContract.LIAB_CONTRACT) {
    contractType = 'issue';
    console.log(`Contract ${oracleContract.CONTRACT_NUMBER || uniqueId} is an ISSUE contract`);
  } else {
    console.log(`Contract ${oracleContract.CONTRACT_NUMBER || uniqueId} is a LIABILITY contract`);
  }
  
  return {
    id: uniqueId,
    title: oracleContract.CONTRACT_NAME || oracleContract.CONTRACT_NUMBER || 'Unnamed Contract',
    type: contractType,
    liability: {
      contractNumber: oracleContract.CONTRACT_NUMBER || '',
    },
    oracleData: { // Lưu trữ dữ liệu gốc từ Oracle
      ...oracleContract
    }
  };
}

// Mock data sẽ được định nghĩa trong một file riêng 