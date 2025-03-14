import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchContracts,
  fetchContractsByCustomer,
  setSelectedContract,
  clearCustomerFilter,
  selectContracts,
  selectSelectedContract,
  selectSelectedCustomer,
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
  const selectedCustomer = useAppSelector(selectSelectedCustomer);
  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  
  // Lấy customerId từ URL nếu có
  const customerId = searchParams.get('customerId');
  
  useEffect(() => {
    if (customerId) {
      dispatch(fetchContractsByCustomer(customerId));
    } else {
      dispatch(fetchContracts());
    }
  }, [dispatch, customerId]);
  
  const handleSelectContract = (contract: ContractNode) => {
    dispatch(setSelectedContract(contract));
  };
  
  const handleClearCustomerFilter = () => {
    dispatch(clearCustomerFilter());
    dispatch(fetchContracts());
  };
  
  return {
    contracts,
    selectedContract,
    customerName: selectedCustomer?.name,
    loading,
    error,
    setSelectedContract: handleSelectContract,
    clearCustomerFilter: handleClearCustomerFilter,
  };
} 