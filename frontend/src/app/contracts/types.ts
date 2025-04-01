export interface OracleContract {
  AMND_DATE?: string;
  ID?: string | number;
  BRANCH?: string;
  CONTRACT_NUMBER?: string;
  CONTRACT_NAME?: string;
  CLIENT__ID?: number;
  TR_FIRST_NAM?: string;
  TR_LAST_NAM?: string;
  LIAB_CONTRACT?: number | null;
  ACNT_CONTRACT__OID?: number | null;
  CARD_NUMBER?: string;
  [key: string]: any;
}

export interface ContractNode {
  id: string;
  title: string;
  type: 'liability' | 'issue' | 'card';
  contractNumber: string;
  oracleData: OracleContract;
  children?: ContractNode[];
}

export function mapOracleContractToContractNode(oracleContract: any): ContractNode {
  // Nếu dữ liệu API đã có sẵn id, title, type, contractNumber, thì giữ nguyên
  const uniqueId = String(oracleContract.id || oracleContract.ID || oracleContract.CONTRACT_NUMBER || `oracle-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  
  let contractType: 'liability' | 'issue' | 'card' = oracleContract.type || 'liability';
  if (!oracleContract.type) {
    if (oracleContract.ACNT_CONTRACT__OID) contractType = 'card';
    else if (oracleContract.LIAB_CONTRACT) contractType = 'issue';
  }

  const node: ContractNode = {
    id: uniqueId,
    title: oracleContract.title || oracleContract.CONTRACT_NAME || oracleContract.CONTRACT_NUMBER || 'Unnamed Contract',
    type: contractType,
    contractNumber: oracleContract.contractNumber || oracleContract.CONTRACT_NUMBER || '',
    oracleData: oracleContract.oracleData || { ...oracleContract }
  };

  if (oracleContract.children && Array.isArray(oracleContract.children)) {
    node.children = oracleContract.children.map((child: any) => mapOracleContractToContractNode(child));
  } else {
    node.children = [];
  }

  return node;
}