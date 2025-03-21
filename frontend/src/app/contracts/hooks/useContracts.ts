import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchContracts,
  fetchContractsByClient,
  setSelectedContract,
  clearClientFilter,
  selectContracts,
  selectSelectedContract,
  selectSelectedClient,
  selectIsLoading,
  selectError,
} from '@/redux/slices/contractSlice';
import { useSearchParams } from 'next/navigation';
import { ContractNode, OracleContract, mapOracleContractToContractNode } from '../types';

export function useContracts() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  
  const contracts = useAppSelector(selectContracts);
  const selectedContract = useAppSelector(selectSelectedContract);
  const selectedClient = useAppSelector(selectSelectedClient);
  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  
  // State for Oracle contracts
  const [oracleContracts, setOracleContracts] = useState<ContractNode[]>([]);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleError, setOracleError] = useState<string | null>(null);
  const [selectedOracleContract, setSelectedOracleContract] = useState<ContractNode | null>(null);
  
  // Lấy clientId từ URL nếu có
  const clientId = searchParams.get('clientId');
  
  //Fetch contracts từ Oracle API
  useEffect(() => {
    const fetchOracleContracts = async () => {
      setOracleLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/oracle/contracts');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        const contractsData = data.data || [];
        
        // Map từ dữ liệu Oracle sang định dạng ContractNode
        const mappedContracts = contractsData.map((contract: OracleContract, index: number) => {
          // Đảm bảo mỗi contract có ID duy nhất
          const uniqueId = contract.ID || `oracle-contract-${index}`;
          return mapOracleContractToContractNode({
            ...contract,
            ID: uniqueId
          });
        });
        
        setOracleContracts(mappedContracts);
      } catch (err) {
        setOracleError(err instanceof Error ? err.message : 'Failed to fetch contracts');
        console.error('Error fetching Oracle contracts:', err);
      } finally {
        setOracleLoading(false);
      }
    };
    
    fetchOracleContracts();
  }, []);
  // useEffect(() => {
  //   setOracleContracts([]); // Không fetch API, chỉ set mảng rỗng
  //   setOracleLoading(false);
  // }, []);
  
  // Load mock contracts khi không có Oracle data hoặc nếu có clientId
  useEffect(() => {
    if (clientId) {
      dispatch(fetchContractsByClient(clientId));
    } else if (oracleContracts.length === 0 && !oracleLoading) {
      // Chỉ load mock data khi Oracle không có dữ liệu và không đang loading
      dispatch(fetchContracts());
    }
  }, [dispatch, clientId, oracleContracts.length, oracleLoading]);
  
  const handleSelectContract = (contract: ContractNode) => {
    if (contract.oracleData) {
      // Oracle contract
      setSelectedOracleContract(contract);
    } else {
      // Mock contract
      dispatch(setSelectedContract(contract));
    }
  };
  
  const handleClearClientFilter = () => {
    dispatch(clearClientFilter());
    dispatch(fetchContracts());
  };
  
  // Combine Oracle contracts and mock contracts, prioritize Oracle contracts
  const allContracts = oracleContracts.length > 0 ? oracleContracts : contracts;
  const currentSelectedContract = selectedOracleContract || selectedContract;
  const isCurrentlyLoading = oracleLoading || loading;
  const currentError = oracleError || error;
  
  return {
    contracts: allContracts,
    selectedContract: currentSelectedContract,
    clientName: selectedClient?.name,
    loading: isCurrentlyLoading,
    error: currentError,
    setSelectedContract: handleSelectContract,
    clearClientFilter: handleClearClientFilter,
  };
} 