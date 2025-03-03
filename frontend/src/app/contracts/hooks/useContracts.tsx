'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContractNode } from '../types';

// Mock data
const MOCK_CONTRACTS: ContractNode[] = [
  {
    id: 'l-1',
    title: 'Liability Contract 2024-A',
    type: 'liability',
    status: 'active',
    value: 500000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    segment: {
      branch: 'HCM Branch',
      product: 'Term Deposit',
      type: 'Corporate',
    },
    customer: {
      id: 'c-1',
      name: 'Enterprise Corp',
      email: 'contact@enterprise.com',
      type: 'Corporate',
    },
    children: [
      {
        id: 'i-1',
        title: 'Issuing Contract Q1',
        type: 'issuing',
        status: 'active',
        value: 200000,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        segment: {
          branch: 'HCM Branch',
          product: 'Term Deposit',
          type: 'Corporate',
        },
        liability: {
          contractName: 'Liability Contract 2024-A',
          customerName: 'Enterprise Corp',
          customerId: 'c-1',
          type: 'Corporate',
        },
        financial: {
          currency: 'USD',
          available: 150000,
          balance: 50000,
        },
        children: [
          {
            id: 't-1',
            title: 'Transaction Jan',
            type: 'transaction',
            status: 'active',
            value: 50000,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            transactionDetails: {
              type: 'Deposit',
              issueContract: 'Issuing Contract Q1',
            }
          }
        ]
      },
      {
        id: 'i-2',
        title: 'Issuing Contract Q2',
        type: 'issuing',
        status: 'pending',
        value: 150000,
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        children: [
          {
            id: 't-3',
            title: 'Transaction Apr',
            type: 'transaction',
            status: 'pending',
            value: 45000,
            startDate: '2024-04-01',
            endDate: '2024-04-30',
          }
        ]
      }
    ]
  },
  {
    id: 'l-2',
    title: 'Liability Contract 2024-B',
    type: 'liability',
    status: 'pending',
    value: 300000,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    children: [
      {
        id: 'i-3',
        title: 'Issuing Contract Mar',
        type: 'issuing',
        status: 'draft',
        value: 100000,
        startDate: '2024-03-01',
        endDate: '2024-03-31',
      }
    ]
  }
];

export function useContracts() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');
  const selectedContractId = searchParams.get('selected');
  
  const [selectedContract, setSelectedContract] = useState<ContractNode | null>(null);
  const [filteredContracts, setFilteredContracts] = useState<ContractNode[]>(MOCK_CONTRACTS);
  const [customerName, setCustomerName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter contracts by customerId if provided
  useEffect(() => {
    setLoading(true);
    try {
      if (customerId) {
        // In a real app, you would fetch contracts for this customer from API
        // For now, we'll filter the mock data
        const filtered = MOCK_CONTRACTS.filter(contract => 
          contract.customer?.id === customerId || 
          contract.liability?.customerId === customerId
        );
        setFilteredContracts(filtered);
        
        // Set customer name (in real app, fetch from API)
        const customer = MOCK_CONTRACTS.find(c => c.customer?.id === customerId)?.customer;
        setCustomerName(customer?.name || 'Unknown Customer');
      } else {
        setFilteredContracts(MOCK_CONTRACTS);
        setCustomerName('');
      }
      setError(null);
    } catch (err) {
      setError('Failed to load contracts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);
  
  // Select contract if ID is provided in URL
  useEffect(() => {
    if (selectedContractId) {
      const findContract = (nodes: ContractNode[]): ContractNode | null => {
        for (const node of nodes) {
          if (node.id === selectedContractId) return node;
          if (node.children) {
            const found = findContract(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      
      const contract = findContract(MOCK_CONTRACTS);
      if (contract) setSelectedContract(contract);
    }
  }, [selectedContractId]);

  // Function to clear customer filter
  const clearCustomerFilter = () => {
    // In a real app, you would use router.push
    window.location.href = '/contracts';
  };

  return {
    contracts: filteredContracts,
    selectedContract,
    setSelectedContract,
    customerName,
    loading,
    error,
    clearCustomerFilter
  };
}