'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RiArrowRightSLine, RiArrowDownSLine, RiFileTextLine, RiSearchLine, RiFileList3Line, RiExchangeFundsLine, RiMoneyDollarCircleLine, RiCalendarLine, RiIdCardLine } from 'react-icons/ri';
import clsx from 'clsx';
import { ContractNode } from '../types';
import Input from '@/components/ui/Input';

interface ContractTreeProps {
  contracts: ContractNode[];
  selectedId: string | null;
  onSelect: (contract: ContractNode) => void;
}

export default function ContractTree({ 
  contracts, 
  selectedId, 
  onSelect 
}: ContractTreeProps) {
  const [animatedRowsMap, setAnimatedRowsMap] = useState<{[key: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 10;
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [visitedPages, setVisitedPages] = useState<{[key: number]: boolean}>({});
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [expandedContracts, setExpandedContracts] = useState<{[key: string]: boolean}>({});
  const [ancestorPath, setAncestorPath] = useState<string[]>([]);

  // Phân loại card vs contract dựa vào contract number và LIAB_CONTRACT
  const getContractType = useCallback((contract: ContractNode): 'card' | 'issue' | 'liability' => {
    const contractNumber = contract.oracleData?.CONTRACT_NUMBER || contract.liability?.contractNumber || '';
    const cardNumber = contract.oracleData?.CARD_NUMBER || '';
    const liabContract = contract.oracleData?.LIAB_CONTRACT || null;
    const acntContract = contract.oracleData?.ACNT_CONTRACT__OID || null;
    
    // Card có 16 số và thường bắt đầu bằng "10000" hoặc có ACNT_CONTRACT__OID
    if ((cardNumber && cardNumber.length === 16 && cardNumber.startsWith('10000')) || 
        (contractNumber.length === 16 && contractNumber.startsWith('10000')) ||
        acntContract) {
      return 'card';
    }
    
    // Nếu LIAB_CONTRACT khác null thì là issue contract
    if (liabContract !== null && liabContract !== undefined && liabContract !== '') {
      return 'issue';
    }
    
    // Còn lại là liability contract
    return 'liability';
  }, []);

  // Tổ chức contracts thành cấu trúc cây phân cấp ba cấp
  const organizeContractsHierarchy = useCallback(() => {
    // Tạo map để theo dõi các contract theo ID
    const liabilityContractsMap: { [key: string]: ContractNode } = {};
    const issuingContractsMap: { [key: string]: ContractNode } = {};
    
    // Danh sách cuối cùng chỉ bao gồm các liability contract
    const hierarchicalContracts: ContractNode[] = [];
    
    // Bước 1: Phân loại và lưu trữ tất cả các contract
    contracts.forEach(contract => {
      const contractType = getContractType(contract);
      
      if (contractType === 'liability') {
        // Clone contract và thêm một mảng children rỗng
        const liabilityContract = { 
          ...contract, 
          children: [] as ContractNode[] 
        };
        
        // Thêm vào map để dễ truy cập sau này
        if (contract.oracleData?.ID) {
          liabilityContractsMap[contract.oracleData.ID] = liabilityContract;
        }
        
        // Thêm vào danh sách kết quả
        hierarchicalContracts.push(liabilityContract);
      } 
      else if (contractType === 'issue') {
        // Clone issuing contract và thêm mảng children rỗng
        const issuingContract = {
          ...contract,
          children: [] as ContractNode[]
        };
        
        // Thêm vào map để dễ truy cập sau này
        if (contract.oracleData?.ID) {
          issuingContractsMap[contract.oracleData.ID] = issuingContract;
        }
        
        // Không thêm trực tiếp vào danh sách kết quả, sẽ xử lý ở bước sau
      }
      // Card contracts sẽ được xử lý ở bước tiếp theo
    });
    
    // Bước 2: Xử lý issue contracts và gán chúng vào liability contract cha
    contracts.forEach(contract => {
      const contractType = getContractType(contract);
      
      if (contractType === 'issue') {
        const parentId = contract.oracleData?.LIAB_CONTRACT;
        
        if (parentId && liabilityContractsMap[parentId]) {
          // Thêm issuing contract đã có trong map vào mảng children của liability contract cha
          const issuingContract = issuingContractsMap[contract.oracleData?.ID || ''] || { ...contract, children: [] };
          liabilityContractsMap[parentId].children?.push(issuingContract);
        } else {
          // Nếu không tìm thấy parent, thêm issue contract vào danh sách chính
          hierarchicalContracts.push({ ...contract, children: [] });
        }
      }
    });
    
    // Bước 3: Xử lý card contracts và gán chúng vào issuing contract cha
    contracts.forEach(contract => {
      const contractType = getContractType(contract);
      
      if (contractType === 'card') {
        const parentId = contract.oracleData?.ACNT_CONTRACT__OID;
        
        if (parentId && issuingContractsMap[parentId]) {
          // Thêm card contract vào mảng children của issuing contract cha
          issuingContractsMap[parentId].children?.push({ ...contract });
          // Đảm bảo issuing contract nằm trong hierarchy nếu chưa được thêm
          const issueContract = issuingContractsMap[parentId];
          const issueParentId = issueContract.oracleData?.LIAB_CONTRACT;
          
          if (issueParentId && liabilityContractsMap[issueParentId]) {
            // Kiểm tra xem issuing contract đã là con của liability contract chưa
            const liabilityChildren = liabilityContractsMap[issueParentId].children || [];
            const issueExists = liabilityChildren.some(child => 
              child.oracleData?.ID === issueContract.oracleData?.ID);
            
            if (!issueExists) {
              liabilityContractsMap[issueParentId].children?.push(issueContract);
            }
          }
        } else {
          // Thử tìm issuing contract cha dựa vào trường LIAB_CONTRACT
          const issueParentId = contract.oracleData?.LIAB_CONTRACT;
          
          // Nếu có LIAB_CONTRACT, thử tìm trong các issuing contracts cùng LIAB_CONTRACT
          if (issueParentId) {
            // Tìm issuing contract phù hợp trong các issuing có cùng liab parent
            const matchingIssueContract = Object.values(issuingContractsMap).find(issue => 
              issue.oracleData?.LIAB_CONTRACT === issueParentId);
            
            if (matchingIssueContract && matchingIssueContract.oracleData?.ID) {
              // Thêm card vào issuing contract này
              issuingContractsMap[matchingIssueContract.oracleData.ID].children?.push({ ...contract });
            } else if (liabilityContractsMap[issueParentId]) {
              // Nếu không tìm thấy issuing phù hợp, thêm card trực tiếp vào liability
              liabilityContractsMap[issueParentId].children?.push({ ...contract });
            } else {
              hierarchicalContracts.push({ ...contract });
            }
          } else {
            // Nếu không tìm thấy parent nào, thêm card contract vào danh sách chính
            hierarchicalContracts.push({ ...contract });
          }
        }
      }
    });
    
    return hierarchicalContracts;
  }, [contracts, getContractType]);

  // Sắp xếp contracts theo AMND_DATE mới nhất lên đầu
  // Đặt trong useMemo để tránh tính toán lại mỗi khi render
  const sortedHierarchicalContracts = useMemo(() => {
    const hierarchicalContracts = organizeContractsHierarchy();
    
    // Sắp xếp danh sách chính
    return [...hierarchicalContracts].sort((a, b) => {
      // Lấy AMND_DATE từ oracleData nếu có
      const dateA = a.oracleData?.AMND_DATE ? new Date(a.oracleData.AMND_DATE).getTime() : 0;
      const dateB = b.oracleData?.AMND_DATE ? new Date(b.oracleData.AMND_DATE).getTime() : 0;
      // Sắp xếp giảm dần (mới nhất lên đầu)
      return dateB - dateA;
    });
  }, [organizeContractsHierarchy]);

  // Tìm kiếm trong cây contracts
  const filteredContracts = useMemo(() => {
    if (!searchQuery.trim()) return sortedHierarchicalContracts;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    // Hàm kiểm tra xem contract có khớp với tìm kiếm không
    const doesContractMatch = (contract: ContractNode): boolean => {
      return (
        contract.title.toLowerCase().includes(lowerQuery) ||
        (contract.liability?.contractNumber?.toLowerCase() || '').includes(lowerQuery) ||
        (contract.oracleData?.CONTRACT_NUMBER?.toLowerCase() || '').includes(lowerQuery) ||
        (contract.oracleData?.CARD_NUMBER?.toLowerCase() || '').includes(lowerQuery)
      );
    };
    
    // Clone cây contracts và lọc
    return sortedHierarchicalContracts.filter(contract => {
      // Kiểm tra contract chính
      if (doesContractMatch(contract)) return true;
      
      // Kiểm tra các contract con
      if (contract.children && contract.children.length > 0) {
        // Lọc và giữ lại các contract con khớp với tìm kiếm
        const matchingChildren = contract.children.filter(child => doesContractMatch(child));
        
        if (matchingChildren.length > 0) {
          // Clone contract và chỉ giữ lại các con khớp với tìm kiếm
          contract.children = matchingChildren;
          return true;
        }
      }
      
      return false;
    });
  }, [searchQuery, sortedHierarchicalContracts]);

  // Làm phẳng danh sách contracts cho hiển thị và phân trang
  const flattenedContractsForDisplay = useMemo(() => {
    const flattened: { contract: ContractNode; level: number; isChild: boolean }[] = [];
    
    const processContract = (contract: ContractNode, level: number, isChild: boolean) => {
      flattened.push({ contract, level, isChild });
      
      // Nếu contract này được mở rộng và có các contract con, thêm chúng vào danh sách
      const contractType = getContractType(contract);
      if (expandedContracts[contract.id] && contract.children && contract.children.length > 0) {
        contract.children.forEach(child => {
          // Giảm độ thụt lề xuống, card chỉ thụt thêm 1 cấp so với issuing
          const childLevel = (contractType === 'issue' && getContractType(child) === 'card') ? level + 2 : level + 1;
          processContract(child, childLevel, true);
        });
      }
    };
    
    // Xử lý tất cả các contract cấp cao nhất
    filteredContracts.forEach(contract => {
      processContract(contract, 0, false);
    });
    
    return flattened;
  }, [filteredContracts, expandedContracts, getContractType]);

  // Phân trang
  const totalPages = Math.ceil(flattenedContractsForDisplay.length / contractsPerPage);
  
  // Tính toán các contract hiển thị theo trang hiện tại
  const displayedContracts = useMemo(() => {
    const indexOfLastContract = currentPage * contractsPerPage;
    const indexOfFirstContract = indexOfLastContract - contractsPerPage;
    return flattenedContractsForDisplay.slice(indexOfFirstContract, indexOfLastContract);
  }, [flattenedContractsForDisplay, currentPage, contractsPerPage]);

  // Animation effect cho tất cả các trang, đảm bảo luôn hiển thị dữ liệu
  useEffect(() => {
    // Đảm bảo trang 1 luôn được hiển thị ngay cả khi không có animation
    if (currentPage === 1 && isInitialRender) {
      // Với trang đầu tiên, đánh dấu animatedRows ngay lập tức
      const initialAnimations: {[key: string]: boolean} = {};
      displayedContracts.forEach(item => {
        initialAnimations[item.contract.id] = true;
      });
      
      setAnimatedRowsMap(initialAnimations);
      setIsInitialRender(false);
      setVisitedPages({ ...visitedPages, 1: true });
      return;
    }
    
    // Không cần thực hiện animation cho các trang đã thăm
    if (visitedPages[currentPage]) {
      // Nhưng vẫn đảm bảo tất cả các contract đều được đánh dấu là đã animate
      const currentPageContracts = displayedContracts.reduce((acc, item) => {
        acc[item.contract.id] = true;
        return acc;
      }, {} as {[key: string]: boolean});
      
      setAnimatedRowsMap(prev => ({
        ...prev,
        ...currentPageContracts
      }));
      return;
    }
    
    // Đánh dấu trang hiện tại đã thăm
    setVisitedPages(prev => ({ ...prev, [currentPage]: true }));
    
    const animationDelay = 30; // giảm xuống từ 50 để animation nhanh hơn
    
    displayedContracts.forEach((item, index) => {
      setTimeout(() => {
        setAnimatedRowsMap(prev => ({
          ...prev,
          [item.contract.id]: true
        }));
      }, index * animationDelay);
    });
  }, [displayedContracts, currentPage, visitedPages, isInitialRender]);

  // Reset animation chỉ khi search query thay đổi
  useEffect(() => {
    setAnimatedRowsMap({});
    // Reset visited pages khi search
    setVisitedPages({});
    setIsInitialRender(true);
    setCurrentPage(1);
  }, [searchQuery]);

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
  };

  // Toggle mở rộng/thu gọn contract
  const toggleExpandContract = (contractId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedContracts(prev => ({
      ...prev,
      [contractId]: !prev[contractId]
    }));
  };

  // Get icon based on contract type
  const getContractIcon = (contract: ContractNode) => {
    const contractType = getContractType(contract);
    
    switch (contractType) {
      case 'card':
        return <RiIdCardLine className="w-5 h-5" />;
      case 'liability':
        return <RiFileList3Line className="w-5 h-5" />;
      case 'issue':
        return <RiExchangeFundsLine className="w-5 h-5" />;
      default:
        return <RiFileTextLine className="w-5 h-5" />;
    }
  };

  // Get icon color based on contract type
  const getIconColor = (contract: ContractNode) => {
    const contractType = getContractType(contract);
    
    switch (contractType) {
      case 'card':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'liability':
        return 'text-indigo-600 dark:text-indigo-400';
      case 'issue':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Get icon background based on contract type
  const getIconBackground = (contract: ContractNode) => {
    const contractType = getContractType(contract);
    
    switch (contractType) {
      case 'card':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'liability':
        return 'bg-indigo-100 dark:bg-indigo-900/30';
      case 'issue':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800/50';
    }
  };

  // Tạo pagination buttons
  const renderPaginationButtons = useMemo(() => {
    if (totalPages <= 1) return null;
    
    const buttons = [];
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
        }`}
      >
        Prev
      </button>
    );
    
    // Page buttons with ellipsis
    [...Array(totalPages)].forEach((_, index) => {
      const pageNum = index + 1;
      
      // Hiển thị nút cho trang đầu, trang cuối và các trang gần trang hiện tại
      if (
        pageNum === 1 ||
        pageNum === totalPages ||
        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={`page-${pageNum}`}
            onClick={() => handlePageChange(pageNum)}
            className={`w-8 h-8 rounded-md ${
              pageNum === currentPage 
                ? 'bg-primary-600 text-white dark:bg-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {pageNum}
          </button>
        );
      }
      // Hiển thị dấu "..." nếu có khoảng cách
      else if (
        (pageNum === 2 && currentPage > 3) ||
        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
      ) {
        buttons.push(
          <span key={`ellipsis-${pageNum}`} className="px-2 self-end pb-1">
            ...
          </span>
        );
      }
    });
    
    // Next button
    buttons.push(
            <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
        }`}
      >
        Next
            </button>
    );

    return (
      <div className="mt-4 flex justify-center space-x-2">
        {buttons}
      </div>
    );
  }, [currentPage, totalPages]);

  // Cập nhật hàm xử lý chọn contract để theo dõi ancestors
  const handleSelectContract = (contract: ContractNode) => {
    // Tìm đường dẫn ancestors của contract này
    const ancestors = findAncestorPath(contract.id);
    setAncestorPath(ancestors);
    
    // Đảm bảo mở rộng tất cả các nút cha trong đường dẫn
    const expandUpdates = {} as {[key: string]: boolean};
    ancestors.forEach(id => {
      expandUpdates[id] = true;
    });
    setExpandedContracts(prev => ({...prev, ...expandUpdates}));
    
    // Gọi hàm onSelect gốc
    onSelect(contract);
  };

  // Hàm tìm đường dẫn ancestors cho một contract
  const findAncestorPath = (contractId: string): string[] => {
    const path: string[] = [contractId];
    
    // Hàm đệ quy để tìm tổ tiên
    const findParent = (contracts: ContractNode[], id: string): boolean => {
      for (const contract of contracts) {
        // Kiểm tra nếu đây là contract cha trực tiếp
        if (contract.children && contract.children.some(child => child.id === id)) {
          path.push(contract.id);
          return true;
        }
        
        // Tìm kiếm đệ quy trong các contract con
        if (contract.children && findParent(contract.children, id)) {
          path.push(contract.id);
          return true;
        }
      }
      
      return false;
    };
    
    // Bắt đầu tìm kiếm từ danh sách contracts cấp cao nhất
    findParent(sortedHierarchicalContracts, contractId);
    
    return path;
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300 h-[calc(100vh-250px)] md:h-[calc(100vh-180px)]">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-xl -z-10"></div>
      <div className="absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-purple-400/20 rounded-full blur-xl -z-10"></div>
      
      <div className="p-4 flex flex-col h-full">
        <div className="mb-4 relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contracts..."
            className="pl-10 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
          />
        </div>
        
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {displayedContracts.length > 0 ? (
          <div className="space-y-1">
              {displayedContracts.map((item) => {
                const { contract, level, isChild } = item;
                const isSelected = selectedId === contract.id;
                const isAnimated = animatedRowsMap[contract.id] || currentPage === 1;
                const amendDate = contract.oracleData?.AMND_DATE;
                const contractType = getContractType(contract);
                const hasChildren = (contractType === 'liability' || contractType === 'issue') && 
                                   contract.children && contract.children.length > 0;
                const isExpanded = expandedContracts[contract.id];
                const isHighlighted = isSelected || ancestorPath.includes(contract.id);
                
                return (
                  <div 
                    key={contract.id} 
                    className={`transition-all duration-500 ease-out ${isAnimated ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
                    onMouseEnter={() => setHoveredRow(contract.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <div 
                      className={clsx(
                        'group flex items-center py-2 my-1 cursor-pointer rounded-lg transition-all duration-200',
                        'relative',
                        level === 0 ? 'px-3' : 
                        level === 1 ? 'pl-6 ml-1.5 relative' :
                        level === 2 ? 'pl-9 ml-3 relative' :
                        level >= 3 ? 'pl-12 ml-4.5 relative' : 'px-3',
                        level > 0 && 'before:absolute before:left-2 before:top-1/2 before:w-2 before:h-px before:bg-gray-200 dark:before:bg-gray-700',
                        hoveredRow === contract.id ? 'shadow-md dark:shadow-gray-900/50 z-10 scale-[1.01]' : '',
                      )}
                    >
                      {/* Phần highlight nền - điều chỉnh để bám lề phải và thụt vào bên trái theo cấp độ */}
                      <div 
                        className={clsx(
                          'absolute inset-y-0 rounded-lg border transition-all duration-200 right-0',
                          (() => {
                            const isAncestor = ancestorPath.includes(contract.id) && !isSelected;
                            const ancestorLevel = isAncestor ? ancestorPath.indexOf(contract.id) : -1;
                            const isParent = ancestorLevel === 1; // Cha trực tiếp
                            const isGrandparent = ancestorLevel === 2; // Ông/bà (Liability)
                            
                            // Điều chỉnh độ thụt vào bên trái theo cấp độ và loại contract
                            const marginLeftClass = (() => {
                              if (contractType === 'card') {
                                return 'left-[15%]'; // Card: thụt vào 20% từ trái
                              } else if (contractType === 'issue') {
                                return 'left-[5%]'; // Issue: thụt vào 10% từ trái
                              } else if (contractType === 'liability') {
                                return 'left-0'; // Liability: không thụt vào
                              }
                              return 'left-0';
                            })();
                            
                            // Màu nền và border theo loại contract & trạng thái
                            switch (contractType) {
                              case 'card':
                                return `${marginLeftClass} ${
                                  isSelected 
                                    ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700/50' 
                                    : isAncestor
                                      ? 'bg-transparent border-transparent'
                                      : 'bg-transparent border-transparent'
                                }`;
                              case 'issue':
                                return `${marginLeftClass} ${
                                  isSelected 
                                    ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700/50' 
                                    : isParent
                                      ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200/60 dark:border-purple-800/20'
                                      : 'bg-transparent border-transparent'
                                }`;
                              case 'liability':
                                return `${marginLeftClass} ${
                                  isSelected 
                                    ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700/50' 
                                    : isGrandparent || isParent
                                      ? 'bg-indigo-50/90 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800/30'
                                      : 'bg-transparent border-transparent'
                                }`;
                              default:
                                return `${marginLeftClass} ${
                                  isSelected 
                                    ? 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700/50' 
                                    : 'bg-transparent border-transparent'
                                }`;
                            }
                          })()
                        )}
                      ></div>
                      
                      {/* Nút mở rộng/thu gọn cho Liability contracts có con */}
                      {hasChildren ? (
                        <button
                          onClick={(e) => toggleExpandContract(contract.id, e)}
                          className="mr-1 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative z-10"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <RiArrowDownSLine className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <RiArrowRightSLine className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                      ) : (
                        <div className="w-6 relative z-10"></div>
                      )}
                      
                      <div 
                        className={`p-1.5 rounded-md mr-3 relative z-10 ${getIconBackground(contract)}`}
                        onClick={() => handleSelectContract(contract)}
                      >
                        <div className={getIconColor(contract)}>
                          {getContractIcon(contract)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 relative z-10" onClick={() => handleSelectContract(contract)}>
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {contract.title}
                          {(() => {
                            switch (contractType) {
                              case 'card':
                                return (
                                  <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                    Card
                                  </span>
                                );
                              case 'issue':
                                return (
                                  <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                                    Issue
                                  </span>
                                );
                              case 'liability':
                                return (
                                  <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                                    Liability
                                  </span>
                                );
                              default:
                                return null;
                            }
                          })()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center">
                          <span className="mr-2">
                            {contractType === 'card'
                              ? (contract.oracleData?.CARD_NUMBER || contract.oracleData?.CONTRACT_NUMBER || contract.liability?.contractNumber || 'No card number')
                              : (contract.oracleData?.CONTRACT_NUMBER || contract.liability?.contractNumber || 'No contract number')
                            }
                          </span>
                          {amendDate && (
                            <span className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md">
                              <RiCalendarLine className="w-3 h-3 mr-1" />
                              {formatDate(amendDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap relative z-10" onClick={() => handleSelectContract(contract)}>
                        {contract.oracleData?.CLIENT_ID ? `Client: ${contract.oracleData.CLIENT_ID}` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No contracts found
              </div>
            )}
          </div>
        
        {/* Phân trang đơn giản với useMemo để tránh render lại không cần thiết */}
        {renderPaginationButtons}
      </div>
    </div>
  );
}