import { useEffect } from 'react';
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
import { ContractNode } from '../types';

export function useContracts() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  
  const contracts = useAppSelector(selectContracts);
  const selectedContract = useAppSelector(selectSelectedContract);
  const selectedClient = useAppSelector(selectSelectedClient);
  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  
  // Lấy clientId từ URL nếu có
  const clientId = searchParams.get('clientId');
  
  useEffect(() => {
    if (clientId) {
      dispatch(fetchContractsByClient(clientId));
    } else {
      dispatch(fetchContracts());
    }
  }, [dispatch, clientId]);
  
  const handleSelectContract = (contract: ContractNode) => {
    dispatch(setSelectedContract(contract));
  };
  
  const handleClearClientFilter = () => {
    dispatch(clearClientFilter());
    dispatch(fetchContracts());
  };
  
  return {
    contracts,
    selectedContract,
    clientName: selectedClient?.name,
    loading,
    error,
    setSelectedContract: handleSelectContract,
    clearClientFilter: handleClearClientFilter,
  };
} 