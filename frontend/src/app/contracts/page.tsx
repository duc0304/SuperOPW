'use client';

import { useState, useEffect } from 'react';
import { RiFileTextLine, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import ContractTree from './components/ContractTree';
import ContractDetail from './components/ContractDetail';
import ContractHeader from './components/ContractHeader';
import AddContractModal from './components/AddContractModal';
import { useContracts } from './hooks/useContracts';

export default function ContractsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  
  const {
    contracts, 
    selectedContract,
    setSelectedContract,
    clientName,
    loading,
    error,
    clearClientFilter
  } = useContracts();

  // Kiểm tra nếu là mobile và hiển thị panel chi tiết khi có contract được chọn
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Kiểm tra lần đầu
    checkIfMobile();
    
    // Thêm event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Hiển thị panel chi tiết khi có contract được chọn trên mobile
  useEffect(() => {
    if (isMobile && selectedContract) {
      setShowDetailPanel(true);
    }
  }, [selectedContract, isMobile]);

  // Xử lý khi chọn contract trên mobile
  const handleSelectContract = (contract: any) => {
    setSelectedContract(contract);
    if (isMobile) {
      setShowDetailPanel(true);
    }
  };

  // Đóng panel chi tiết
  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
  };

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
    <div className="p-4 pt-20 min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300/10 to-indigo-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-300/10 to-indigo-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <ContractHeader 
          clientName={clientName} 
          clearClientFilter={clearClientFilter}
          onAddContract={() => setIsAddModalOpen(true)}
        />

        {/* Main Content - Responsive Layout */}
        <div className={`relative ${isMobile ? 'flex flex-col' : 'flex flex-row gap-6'}`}>
          {/* Left Sidebar - Contract Tree */}
          <div className={`${isMobile ? 'w-full' : 'w-1/3'} ${isMobile && showDetailPanel ? 'hidden md:block' : 'block'}`}>
            <ContractTree
              contracts={contracts}
              selectedId={selectedContract?.id || null}
              onSelect={handleSelectContract}
            />
          </div>

          {/* Right Content - Contract Detail (Desktop) */}
          {!isMobile && (
            <div className="flex-1">
              {selectedContract ? (
                <ContractDetail contract={selectedContract} />
              ) : (
                <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300 h-[calc(100vh-180px)] flex flex-col items-center justify-center text-center p-6">
                  <div className="p-6 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-full mb-6">
                    <RiFileTextLine className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Contract Selected</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
                    Select a contract from the list to view its details and manage its information
                  </p>
                  <div className="mt-8 flex space-x-4">
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                      Import Contracts
                    </button>
                    <button 
                      className="px-5 py-2.5 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      Create New Contract
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sliding Panel for Contract Detail (Mobile) */}
          {isMobile && (
            <div 
              className={`fixed inset-0 bg-gray-900/50 z-40 transition-opacity duration-300 ${
                showDetailPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={handleCloseDetailPanel}
            >
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl transition-transform duration-300 transform ${
                  showDetailPanel ? 'translate-y-0' : 'translate-y-full'
                } h-[90vh] overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Panel Header with Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedContract?.title || 'Contract Details'}
                  </h3>
                  <button 
                    onClick={handleCloseDetailPanel}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <RiArrowLeftLine className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                {/* Panel Content */}
                <div className="h-[calc(90vh-60px)] overflow-auto">
                  {selectedContract ? (
                    <ContractDetail contract={selectedContract} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="p-6 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-full mb-6">
                        <RiFileTextLine className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Contract Selected</h3>
                      <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
                        Select a contract from the list to view its details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button to show details (Mobile) */}
          {isMobile && selectedContract && !showDetailPanel && (
            <button
              onClick={() => setShowDetailPanel(true)}
              className="fixed bottom-20 right-4 z-30 bg-primary-600 text-white p-4 rounded-full shadow-lg"
            >
              <RiArrowRightLine className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Add Contract Modal */}
      <AddContractModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}