'use client';

import { useState, useEffect, useCallback, useMemo, useReducer, ReactNode } from 'react';
import { RiArrowRightSLine, RiArrowDownSLine, RiFileTextLine, RiSearchLine, RiFileList3Line, RiExchangeFundsLine, RiCalendarLine, RiIdCardLine } from 'react-icons/ri';
import clsx from 'clsx';
import { ContractNode } from '../types';
import Input from '@/components/ui/Input';

// Styles và icons cho từng loại contract
interface ContractStyle {
  icon: ReactNode;
  color: string;
  bg: string;
  selectedBg: string;
  parentBg?: string;
  badge: string;
  highlight: string;
  marginLeft: string;
}

// Styles và icons cho từng loại contract
const contractStyles: Record<string, ContractStyle> = {
  card: {
    icon: <RiIdCardLine className="w-5 h-5" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    selectedBg: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700/50',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    highlight: 'bg-emerald-50 dark:bg-emerald-900/50',
    marginLeft: 'left-[15%]',
    parentBg: 'bg-transparent border-transparent'
  },
  issue: {
    icon: <RiExchangeFundsLine className="w-5 h-5" />,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    selectedBg: 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700/50',
    parentBg: 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200/60 dark:border-purple-800/20',
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    highlight: 'bg-purple-50 dark:bg-purple-900/50',
    marginLeft: 'left-[5%]'
  },
  liability: {
    icon: <RiFileList3Line className="w-5 h-5" />,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    selectedBg: 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700/50',
    parentBg: 'bg-indigo-50/90 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800/30',
    badge: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    highlight: 'bg-indigo-50 dark:bg-indigo-900/50',
    marginLeft: 'left-0'
  },
  default: {
    icon: <RiFileTextLine className="w-5 h-5" />,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    selectedBg: 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700/50',
    parentBg: 'bg-transparent border-transparent',
    badge: '',
    highlight: '',
    marginLeft: 'left-0'
  }
};

// Định nghĩa action types
type ActionType = 
  | { type: 'TOGGLE_EXPAND_CONTRACT'; id: string }
  | { type: 'SET_ANIMATED_ROWS'; rows: Record<string, boolean> }
  | { type: 'ADD_ANIMATED_ROW'; id: string }
  | { type: 'RESET_ANIMATED_ROWS' }
  | { type: 'SET_CURRENT_PAGE'; page: number }
  | { type: 'VISIT_PAGE'; page: number }
  | { type: 'RESET_VISITED_PAGES' }
  | { type: 'SET_ANCESTOR_PATH'; path: string[] }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SET_HOVERED_ROW'; id: string | null };

// Định nghĩa state interface
interface ContractTreeState {
  expandedContracts: Record<string, boolean>;
  animatedRowsMap: Record<string, boolean>;
  currentPage: number;
  visitedPages: Record<number, boolean>;
  isInitialRender: boolean;
  ancestorPath: string[];
  searchQuery: string;
  hoveredRow: string | null;
}

// State ban đầu
const initialState: ContractTreeState = {
  expandedContracts: {},
  animatedRowsMap: {},
  currentPage: 1,
  visitedPages: {},
  isInitialRender: true,
  ancestorPath: [],
  searchQuery: '',
  hoveredRow: null
};

// Reducer function
function contractTreeReducer(state: ContractTreeState, action: ActionType): ContractTreeState {
  switch (action.type) {
    case 'TOGGLE_EXPAND_CONTRACT':
      return {
        ...state,
        expandedContracts: {
          ...state.expandedContracts,
          [action.id]: !state.expandedContracts[action.id]
        }
      };
    case 'SET_ANIMATED_ROWS':
      return {
        ...state,
        animatedRowsMap: action.rows
      };
    case 'ADD_ANIMATED_ROW':
      return {
        ...state,
        animatedRowsMap: {
          ...state.animatedRowsMap,
          [action.id]: true
        }
      };
    case 'RESET_ANIMATED_ROWS':
      return {
        ...state,
        animatedRowsMap: {},
        isInitialRender: true
      };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.page
      };
    case 'VISIT_PAGE':
      return {
        ...state,
        visitedPages: {
          ...state.visitedPages,
          [action.page]: true
        },
        isInitialRender: false
      };
    case 'RESET_VISITED_PAGES':
      return {
        ...state,
        visitedPages: {},
        isInitialRender: true
      };
    case 'SET_ANCESTOR_PATH':
      return {
        ...state,
        ancestorPath: action.path,
        // Mở rộng các contract trong đường dẫn tổ tiên
        expandedContracts: action.path.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, { ...state.expandedContracts })
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.query,
        // Reset khi search query thay đổi
        currentPage: 1,
        animatedRowsMap: {},
        visitedPages: {},
        isInitialRender: true
      };
    case 'SET_HOVERED_ROW':
      return {
        ...state,
        hoveredRow: action.id
      };
    default:
      return state;
  }
}

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
  // Sử dụng reducer thay vì nhiều useState
  const [state, dispatch] = useReducer(contractTreeReducer, initialState);
  const { 
    expandedContracts, 
    animatedRowsMap, 
    currentPage, 
    visitedPages, 
    isInitialRender, 
    ancestorPath, 
    searchQuery, 
    hoveredRow 
  } = state;
  
  const contractsPerPage = 10;

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
    // Hàm phân loại và tạo map cho liabilities
    const categorizeLiabilityContracts = (contracts: ContractNode[]) => {
      const map: Record<string, ContractNode> = {};
      const list: ContractNode[] = [];
      
      contracts.forEach(contract => {
        if (getContractType(contract) === 'liability') {
          const liability = { ...contract, children: [] };
          map[contract.oracleData?.ID || ''] = liability;
          list.push(liability);
        }
      });
      
      return { map, list };
    };
    
    // Hàm gán issue contracts vào liability parent của chúng
    const assignIssueContracts = (
      contracts: ContractNode[],
      liabilityMap: Record<string, ContractNode>
    ) => {
      const issueMap: Record<string, ContractNode> = {};
      
      contracts.forEach(contract => {
        if (getContractType(contract) === 'issue') {
          const issue = { ...contract, children: [] };
          issueMap[contract.oracleData?.ID || ''] = issue;
          
          const parentId = contract.oracleData?.LIAB_CONTRACT;
          if (parentId && liabilityMap[parentId]) {
            liabilityMap[parentId].children?.push(issue);
          }
        }
      });
      
      return issueMap;
    };
    
    // Hàm gán card contracts vào issue hoặc liability parent của chúng
    const assignCardContracts = (
      contracts: ContractNode[],
      liabilityMap: Record<string, ContractNode>,
      issueMap: Record<string, ContractNode>
    ) => {
      contracts.forEach(contract => {
        if (getContractType(contract) === 'card') {
          // Thử tìm parent dựa trên ACNT_CONTRACT__OID (issue parent)
          const issueParentId = contract.oracleData?.ACNT_CONTRACT__OID;
          if (issueParentId && issueMap[issueParentId]) {
            issueMap[issueParentId].children?.push({ ...contract });
            return;
          }
          
          // Thử tìm parent dựa trên LIAB_CONTRACT (liability parent)
          const liabParentId = contract.oracleData?.LIAB_CONTRACT;
          if (liabParentId && liabilityMap[liabParentId]) {
            liabilityMap[liabParentId].children?.push({ ...contract });
            return;
          }
        }
      });
    };
    
    // Thực hiện các bước tổ chức cây
    const { map: liabilityMap, list: result } = categorizeLiabilityContracts(contracts);
    const issueMap = assignIssueContracts(contracts, liabilityMap);
    assignCardContracts(contracts, liabilityMap, issueMap);
    
    return result;
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
  const flattenContractsForCurrentPage = useCallback((contracts: ContractNode[], page: number, itemsPerPage: number) => {
    const flattened: { contract: ContractNode; level: number }[] = [];
    let flatIndex = 0;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage - 1;
    
    // Hàm đệ quy flatten với early return khi đã đủ số lượng cần thiết
    const processContract = (contract: ContractNode, level: number) => {
      // Skip nếu đã quá trang hiện tại
      if (flatIndex > endIndex) {
        return false; // Đã đủ dữ liệu, dừng xử lý
      }
      
      // Thêm contract hiện tại nếu nằm trong khoảng trang hiện tại
      if (flatIndex >= startIndex && flatIndex <= endIndex) {
        flattened.push({ contract, level });
      }
      
      flatIndex++;
      
      // Chỉ xử lý các con nếu contract được mở rộng và flat index chưa vượt quá endIndex
      const contractType = getContractType(contract);
      if (expandedContracts[contract.id] && contract.children && contract.children.length > 0 && flatIndex <= endIndex) {
        for (const child of contract.children) {
          // Nếu processContract return false (đã đủ dữ liệu), dừng vòng lặp
          const childLevel = (contractType === 'issue' && getContractType(child) === 'card')
            ? level + 2 
            : level + 1;
            
          if (!processContract(child, childLevel)) {
            return false;
          }
        }
      }
      
      return flatIndex <= endIndex; // Còn cần thêm dữ liệu không
    };
    
    // Xử lý từng contract cấp cao nhất cho đến khi đủ dữ liệu cho trang hiện tại
    for (const contract of contracts) {
      if (!processContract(contract, 0)) {
        break; // Đã đủ dữ liệu cho trang hiện tại
      }
    }
    
    return flattened;
  }, [expandedContracts, getContractType]);
  
  // Tính tổng số contracts để phân trang (tính cả đã mở rộng)
  const totalContractCount = useMemo(() => {
    let count = 0;
    
    const countContract = (contract: ContractNode) => {
      count++;
      
      if (expandedContracts[contract.id] && contract.children && contract.children.length > 0) {
        contract.children.forEach(countContract);
      }
    };
    
    filteredContracts.forEach(countContract);
    
    return count;
  }, [filteredContracts, expandedContracts]);
  
  // Phân trang
  const totalPages = Math.ceil(totalContractCount / contractsPerPage);
  
  // Tính toán các contract hiển thị theo trang hiện tại
  const displayedContracts = useMemo(() => {
    return flattenContractsForCurrentPage(filteredContracts, currentPage, contractsPerPage);
  }, [filteredContracts, currentPage, contractsPerPage, flattenContractsForCurrentPage]);
  
  // Animation effect được tối ưu để mượt mà khi chuyển trang
  useEffect(() => {
    // Đánh dấu tất cả các contracts là đã animate ngay lập tức
    const allAnimated = displayedContracts.reduce((acc, item) => {
      acc[item.contract.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    dispatch({ type: 'SET_ANIMATED_ROWS', rows: allAnimated });
    
    // Đánh dấu trang đã thăm
    if (!visitedPages[currentPage]) {
      dispatch({ type: 'VISIT_PAGE', page: currentPage });
    }
  }, [displayedContracts, currentPage, visitedPages, dispatch]);

  // Reset animation chỉ khi search query thay đổi
  useEffect(() => {
    // Vẫn reset các state cần thiết khi thay đổi search
    dispatch({ type: 'RESET_VISITED_PAGES' });
    dispatch({ type: 'SET_CURRENT_PAGE', page: 1 });
  }, [searchQuery, dispatch]);

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
    } catch (_) {
      return '';
    }
  };

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    dispatch({ type: 'SET_CURRENT_PAGE', page: pageNumber });
  };

  // Toggle mở rộng/thu gọn contract
  const toggleExpandContract = (contractId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch({ type: 'TOGGLE_EXPAND_CONTRACT', id: contractId });
  };

  // Get icon based on contract type
  const getContractIcon = (contract: ContractNode) => {
    const contractType = getContractType(contract);
    return contractStyles[contractType]?.icon || contractStyles.default.icon;
  };

  // Get icon color based on contract type
  const getIconColor = (contract: ContractNode) => {
    const contractType = getContractType(contract);
    return contractStyles[contractType]?.color || contractStyles.default.color;
  };

  // Get icon background based on contract type
  const getIconBackground = (contract: ContractNode) => {
    const contractType = getContractType(contract);
    return contractStyles[contractType]?.bg || contractStyles.default.bg;
  };
  
  // Get style for highlight background
  const getHighlightStyle = (contract: ContractNode, isSelected: boolean, isAncestor: boolean, ancestorLevel: number) => {
    const contractType = getContractType(contract);
    const styles = contractStyles[contractType] || contractStyles.default;
    const marginLeft = styles.marginLeft;
    
    // Xác định background dựa vào trạng thái
    let bgClass = 'bg-transparent border-transparent';
    
    if (isSelected) {
      bgClass = styles.selectedBg;
    } else if (isAncestor) {
      const isParent = ancestorLevel === 1;
      const isGrandparent = ancestorLevel === 2;
      
      if (contractType === 'issue' && isParent) {
        bgClass = styles.parentBg || bgClass;
      } else if (contractType === 'liability' && (isGrandparent || isParent)) {
        bgClass = styles.parentBg || bgClass;
      }
    }
    
    return `${marginLeft} ${bgClass}`;
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
  }, [currentPage, totalPages, handlePageChange]);

  // Cập nhật hàm xử lý chọn contract để theo dõi ancestors
  const handleSelectContract = (contract: ContractNode) => {
    // Tìm đường dẫn ancestors của contract này
    const ancestors = findAncestorPath(contract.id);
    dispatch({ type: 'SET_ANCESTOR_PATH', path: ancestors });
    
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
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', query: e.target.value })}
            placeholder="Search contracts..."
            className="pl-10 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
          />
        </div>
        
        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {displayedContracts.length > 0 ? (
          <div className="space-y-1">
              {displayedContracts.map((item) => {
                const { contract, level } = item;
                const isSelected = selectedId === contract.id;
                const isAnimated = animatedRowsMap[contract.id] || currentPage === 1;
                const amendDate = contract.oracleData?.AMND_DATE;
                const contractType = getContractType(contract);
                const hasChildren = (contractType === 'liability' || contractType === 'issue') && 
                                   contract.children && contract.children.length > 0;
                const isExpanded = expandedContracts[contract.id];
                
                return (
                  <div 
                    key={contract.id} 
                    className={`transition-all duration-500 ease-out ${isAnimated ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
                    onMouseEnter={() => dispatch({ type: 'SET_HOVERED_ROW', id: contract.id })}
                    onMouseLeave={() => dispatch({ type: 'SET_HOVERED_ROW', id: null })}
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
                            return getHighlightStyle(contract, isSelected, isAncestor, ancestorLevel);
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
                          <span className={`ml-2 text-xs ${contractStyles[contractType].badge} px-2 py-0.5 rounded-full`}>
                            {contractType.charAt(0).toUpperCase() + contractType.slice(1)}
                          </span>
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