'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  RiFileTextLine,
  RiAddLine,
  RiInformationLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseLine
} from 'react-icons/ri';
import Button from '@/components/ui/Button';
import AddContractModal from '@/app/contracts/components/AddContractModal';
import ContractTree from '@/app/contracts/components/ContractTree';
import ContractDetail from '@/app/contracts/components/ContractDetail';
import { ContractNode, mapOracleContractToContractNode } from '@/app/contracts/types';
import { Client } from '@/services/api';

export default function CustomerContractsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [contracts, setContracts] = useState<ContractNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);

  // Fetch client details and contracts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch client details
        const clientResponse = await fetch(`http://localhost:5000/api/oracle/clients/${clientId}`);
        if (!clientResponse.ok) {
          throw new Error(`Failed to fetch client: ${clientResponse.status}`);
        }

        const clientData = await clientResponse.json();
        setClient(clientData.data);

        // Fetch all client contracts
        const contractsResponse = await fetch(`http://localhost:5000/api/oracle/contracts/client/${clientId}`);
        if (!contractsResponse.ok) {
          throw new Error(`Failed to fetch contracts: ${contractsResponse.status}`);
        }

        const contractsData = await contractsResponse.json();

        // Map Oracle contracts to ContractNode structure
        if (contractsData.data && Array.isArray(contractsData.data)) {
          // Convert to ContractNode structure
          const contractNodes = contractsData.data.map(mapOracleContractToContractNode);
          // Organize in hierarchical structure
          const organizedContracts = organizeContractsHierarchy(contractNodes);
          setContracts(organizedContracts);
        } else {
          setContracts([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  // Animation effect on mount
  useEffect(() => {
    setAnimateBackground(true);
  }, []);

  // Kiểm tra nếu là mobile
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

  // Tự động mở rộng tất cả contracts khi có dữ liệu
  useEffect(() => {
    if (contracts.length > 0) {
      // Logging tổng số contracts được tải
      console.log(`Loaded ${contracts.length} contracts for client ${clientId}`);
    }
  }, [contracts, clientId]);

  // Organize contracts into a hierarchical structure
  const organizeContractsHierarchy = (contracts: ContractNode[]): ContractNode[] => {
    // Nếu không có contracts, trả về mảng rỗng
    if (!contracts || contracts.length === 0) {
      return [];
    }
    
    // Maps tổ chức contracts theo ID
    const liabMap = new Map<string, ContractNode>();
    const issueMap = new Map<string, ContractNode>();
    const idMap = new Map<string, ContractNode>();
    const processedContracts = new Set<string>(); // Theo dõi các contract đã được xử lý
    
    // Danh sách kết quả - chỉ chứa liability contracts ở cấp cao nhất
    const result: ContractNode[] = [];
    
    // Bước 1: Xây dựng các maps
    contracts.forEach(contract => {
      // Tạo bản sao để tránh các vấn đề tham chiếu và đảm bảo children array được khởi tạo
      const contractCopy = { ...contract, children: [] };
      
      // Lưu vào map theo ID nếu có
      if (contract.oracleData?.ID) {
        idMap.set(contract.oracleData.ID, contractCopy);
      }
      
      // Chỉ thêm liability contracts vào kết quả cấp cao nhất
      if (contract.type === 'liability') {
        liabMap.set(contract.id, contractCopy);
        result.push(contractCopy);
        processedContracts.add(contract.id);
      } else if (contract.type === 'issue') {
        issueMap.set(contract.id, contractCopy);
      }
    });
    
    // Bước 2: Gán các issue contracts vào LIAB cha
    contracts.forEach(contract => {
      if (contract.type === 'issue') {
        // Tìm bản sao đã được tạo
        const issueCopy = issueMap.get(contract.id);
        if (!issueCopy) return;
        
        let parentFound = false;
        
        if (contract.oracleData?.LIAB_CONTRACT) {
          const liabId = contract.oracleData.LIAB_CONTRACT;
          
          // Tìm LIAB contract dựa trên ID
          for (const [id, liabContract] of liabMap.entries()) {
            if (liabContract.oracleData?.ID === liabId) {
              liabContract.children = liabContract.children || [];
              liabContract.children.push(issueCopy);
              parentFound = true;
              processedContracts.add(contract.id);
              break;
            }
          }
        }
        
        // Bỏ qua issues mồ côi, không thêm vào cấp cao nhất
      }
    });
    
    // Bước 3: Gán các card contracts vào issue hoặc LIAB cha
    contracts.forEach(contract => {
      if (contract.type === 'card') {
        let parentFound = false;
        
        // Nếu có ACNT_CONTRACT__OID, đây là card thuộc về issue
        if (contract.oracleData?.ACNT_CONTRACT__OID) {
          const issueId = contract.oracleData.ACNT_CONTRACT__OID;
          const parentIssue = idMap.get(issueId);
          
          if (parentIssue) {
            parentIssue.children = parentIssue.children || [];
            parentIssue.children.push({ ...contract, children: [] });
            parentFound = true;
            processedContracts.add(contract.id);
          }
        } 
        // Nếu có LIAB_CONTRACT, đây là card thuộc về LIAB
        else if (contract.oracleData?.LIAB_CONTRACT) {
          const liabId = contract.oracleData.LIAB_CONTRACT;
          
          // Tìm LIAB contract dựa trên ID
          for (const [id, liabContract] of liabMap.entries()) {
            if (liabContract.oracleData?.ID === liabId) {
              liabContract.children = liabContract.children || [];
              liabContract.children.push({ ...contract, children: [] });
              parentFound = true;
              processedContracts.add(contract.id);
              break;
            }
          }
        }
        
        // Bỏ qua cards mồ côi, không thêm vào cấp cao nhất
      }
    });
    
    // Không thêm các contract mồ côi vào cấp cao nhất
    
    return result;
  };

  const handleContractSelect = (contract: ContractNode) => {
    setSelectedContract(contract);
    if (isMobile) {
      setShowDetailPanel(true);
    }
  };

  // Đóng panel chi tiết
  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
  };

  // Handle adding a new contract
  const handleAddContract = async (contractData: any) => {
    setIsLoading(true);
    try {
      // Call API to add new contract
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add contract: ${response.status}`);
      }

      // Refresh contracts
      const contractsResponse = await fetch(`http://localhost:5000/api/clients/${clientId}/contracts`);
      const contractsData = await contractsResponse.json();

      if (contractsData.data && Array.isArray(contractsData.data)) {
        const contractNodes = contractsData.data.map(mapOracleContractToContractNode);
        setContracts(organizeContractsHierarchy(contractNodes));
      }

      // Close modal
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error adding contract:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!client && isLoading) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!client && !isLoading) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-red-500 dark:text-red-400 text-xl font-semibold p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-red-200 dark:border-red-800">
          {error || "Client not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300/10 to-indigo-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-300/10 to-indigo-400/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with gradient background */}
        <div className="mb-6 overflow-visible">
          {/* Enhanced 3D background with gradient from dark to light (left to right) */}
          <div className={`bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 
            rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all duration-700 ease-out
            ${animateBackground ? 'opacity-100 transform-none' : 'opacity-0 transform -translate-y-4'}`}>
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>

            {/* Decorative elements */}
            <div className="absolute right-10 bottom-10 w-20 h-20 border-4 border-primary-300/30 rounded-xl rotate-12"></div>
            <div className="absolute left-1/3 top-10 w-6 h-6 bg-primary-300/40 rounded-full"></div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
              <div className="flex items-center">
                {/* Back button integrated in the header */}
                <button
                  onClick={() => router.back()}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 shadow-lg transform transition-transform hover:scale-110 duration-300 hover:bg-white/30"
                  aria-label="Back to client"
                >
                  <RiArrowLeftLine className="h-7 w-7 text-white" />
                </button>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 shadow-lg transform transition-transform hover:scale-105 duration-300">
                  <RiFileTextLine className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-md">
                    Client Contracts
                  </h1>
                  <p className="text-primary-100 dark:text-primary-200">
                    {client ? `Manage contracts for ${client.shortName}` : 'Loading client details...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-3">
                {/* Client filter badge */}
                <div className="flex items-center">
                  <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm">
                    <span className="mr-2">👤</span>
                    Client: {client?.shortName || 'Loading...'}
                  </span>
                </div>

                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="primary"
                  className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-300/20"
                  icon={RiAddLine}
                >
                  New Contract
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Content - Responsive Layout */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : contracts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 rounded-xl shadow-soft dark:shadow-indigo-900/10 p-6 text-center text-gray-500 dark:text-gray-400">
            <RiInformationLine className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No contracts found for this client</p>
            <Button
              variant="primary"
              icon={RiAddLine}
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 bg-primary-600 hover:bg-primary-700 text-white"
            >
              Add New Contract
            </Button>
          </div>
        ) : (
          <div className={`relative ${isMobile ? 'flex flex-col' : 'flex flex-row gap-6'}`}>
            {/* Left Sidebar - Contract Tree */}
            <div className={`${isMobile ? 'w-full' : 'w-1/3'} ${isMobile && showDetailPanel ? 'hidden md:block' : 'block'}`}>
              <ContractTree
                contracts={contracts}
                selectedId={selectedContract?.id || null}
                onSelect={handleContractSelect}
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
                    <div className="mt-8">
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
                className={`fixed inset-0 bg-gray-900/50 z-40 transition-opacity duration-300 ${showDetailPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                onClick={handleCloseDetailPanel}
              >
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl transition-transform duration-300 transform ${showDetailPanel ? 'translate-y-0' : 'translate-y-full'
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
                  <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                    {selectedContract && <ContractDetail contract={selectedContract} />}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Contract Modal */}
      {isAddModalOpen && (
        <AddContractModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
} 