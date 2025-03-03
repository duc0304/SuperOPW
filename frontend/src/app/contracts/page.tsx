'use client';

import { RiFileTextLine } from 'react-icons/ri';
import ContractTree from './components/ContractTree';
import ContractDetail from './components/ContractDetail';
import ContractHeader from './components/ContractHeader';
import { useContracts } from './hooks/useContracts';

export default function ContractsPage() {
  const {
  contracts, 
    selectedContract,
    setSelectedContract,
    customerName,
    loading,
    error,
    clearCustomerFilter
  } = useContracts();

  // Loading state
  if (loading) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
  return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
    </div>
  );
  }

  return (
    <div className="p-4 pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ContractHeader 
          customerName={customerName} 
          clearCustomerFilter={clearCustomerFilter} 
        />

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Sidebar - Contract Tree */}
          <div className="w-1/3">
            <ContractTree
              contracts={contracts}
              selectedId={selectedContract?.id || null}
              onSelect={setSelectedContract}
            />
          </div>

          {/* Right Content - Contract Detail */}
          <div className="flex-1">
            {selectedContract ? (
              <ContractDetail contract={selectedContract} />
            ) : (
              <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 rounded-xl shadow-soft dark:shadow-indigo-900/10 p-6 h-[calc(100vh-180px)] flex flex-col items-center justify-center text-center">
                <RiFileTextLine className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-indigo-100 mb-2">No Contract Selected</h3>
                <p className="text-sm text-gray-500 dark:text-indigo-300/70">
                  Select a contract from the list to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}