// "use client";

// import { useEffect, useCallback, useMemo, ReactNode } from "react";
// import {
//   RiArrowRightSLine,
//   RiArrowDownSLine,
//   RiFileTextLine,
//   RiSearchLine,
//   RiFileList3Line,
//   RiExchangeFundsLine,
//   RiCalendarLine,
//   RiIdCardLine,
// } from "react-icons/ri";
// import clsx from "clsx";
// import { ContractNode } from "../types";
// import Input from "@/components/ui/Input";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   toggleExpandContract,
//   setAnimatedRows,
//   addAnimatedRow,
//   setTreeCurrentPage,
//   visitPage,
//   resetVisitedPages,
//   setAncestorPath,
//   setTreeSearchQuery,
//   setHoveredRow,
//   selectExpandedContracts,
//   selectAnimatedRowsMap,
//   selectTreeCurrentPage,
//   selectVisitedPages,
//   selectIsInitialRender,
//   selectAncestorPath,
//   selectTreeSearchQuery,
//   selectHoveredRow,
// } from "@/redux/slices/contractSlice";

// // Styles và icons cho từng loại contract
// interface ContractStyle {
//   icon: ReactNode;
//   color: string;
//   bg: string;
//   selectedBg: string;
//   parentBg?: string;
//   badge: string;
//   highlight: string;
//   marginLeft: string;
// }

// // Styles và icons cho từng loại contract
// const contractStyles: Record<string, ContractStyle> = {
//   card: {
//     icon: <RiIdCardLine className="w-5 h-5" />,
//     color: "text-emerald-600 dark:text-emerald-400",
//     bg: "bg-emerald-100 dark:bg-emerald-900/30",
//     selectedBg:
//       "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700/50",
//     badge:
//       "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
//     highlight: "bg-emerald-50 dark:bg-emerald-900/50",
//     marginLeft: "left-[15%]",
//     parentBg: "bg-transparent border-transparent",
//   },
//   issue: {
//     icon: <RiExchangeFundsLine className="w-5 h-5" />,
//     color: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-100 dark:bg-purple-900/30",
//     selectedBg:
//       "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700/50",
//     parentBg:
//       "bg-purple-50/50 dark:bg-purple-900/10 border-purple-200/60 dark:border-purple-800/20",
//     badge:
//       "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
//     highlight: "bg-purple-50 dark:bg-purple-900/50",
//     marginLeft: "left-[5%]",
//   },
//   liability: {
//     icon: <RiFileList3Line className="w-5 h-5" />,
//     color: "text-indigo-600 dark:text-indigo-400",
//     bg: "bg-indigo-100 dark:bg-indigo-900/30",
//     selectedBg:
//       "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700/50",
//     parentBg:
//       "bg-indigo-50/90 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800/30",
//     badge:
//       "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
//     highlight: "bg-indigo-50 dark:bg-indigo-900/50",
//     marginLeft: "left-0",
//   },
//   default: {
//     icon: <RiFileTextLine className="w-5 h-5" />,
//     color: "text-gray-600 dark:text-gray-400",
//     bg: "bg-gray-100 dark:bg-gray-800/50",
//     selectedBg:
//       "bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700/50",
//     parentBg: "bg-transparent border-transparent",
//     badge: "",
//     highlight: "",
//     marginLeft: "left-0",
//   },
// };

// interface ContractTreeProps {
//   contracts: ContractNode[];
//   selectedId: string | null;
//   onSelect: (contract: ContractNode) => void;
// }

// // Thêm style custom animation vào đầu component
// const animationStyles = `
//   @keyframes ping-slow {
//     0% {
//       transform: scale(1);
//       opacity: 0.8;
//     }
//     75%, 100% {
//       transform: scale(1.8);
//       opacity: 0;
//     }
//   }

//   .animate-ping-slow {
//     animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
//   }
// `;

// export default function ContractTree({
//   contracts,
//   selectedId,
//   onSelect,
// }: Readonly<ContractTreeProps>) {
//   // Sử dụng Redux thay vì useReducer
//   const dispatch = useAppDispatch();

//   // Lấy state từ Redux
//   const expandedContracts = useAppSelector(selectExpandedContracts);
//   const animatedRowsMap = useAppSelector(selectAnimatedRowsMap);
//   const currentPage = useAppSelector(selectTreeCurrentPage);
//   const visitedPages = useAppSelector(selectVisitedPages);
//   const ancestorPath = useAppSelector(selectAncestorPath);
//   const searchQuery = useAppSelector(selectTreeSearchQuery);
//   const hoveredRow = useAppSelector(selectHoveredRow);

//   const contractsPerPage = 10;

//   // Phân loại card vs contract dựa vào contract number và LIAB_CONTRACT
//   const getContractType = useCallback(
//     (contract: ContractNode): "card" | "issue" | "liability" => {
//       const contractNumber =
//         contract.oracleData?.CONTRACT_NUMBER ??
//         contract.liability?.contractNumber ??
//         "";
//       const cardNumber = contract.oracleData?.CARD_NUMBER ?? "";
//       const liabContract = contract.oracleData?.LIAB_CONTRACT ?? null;
//       const acntContract = contract.oracleData?.ACNT_CONTRACT__OID ?? null;

//       // Card có 16 số và thường bắt đầu bằng "10000" hoặc có ACNT_CONTRACT__OID
//       if (
//         (cardNumber &&
//           cardNumber.length === 16 &&
//           cardNumber.startsWith("10000")) ||
//         (contractNumber.length === 16 && contractNumber.startsWith("10000")) ||
//         acntContract
//       ) {
//         return "card";
//       }

//       // Nếu LIAB_CONTRACT khác null thì là issue contract
//       if (
//         liabContract !== null &&
//         liabContract !== undefined &&
//         liabContract !== ""
//       ) {
//         return "issue";
//       }

//       // Còn lại là liability contract
//       return "liability";
//     },
//     []
//   );

//   // Tổ chức contracts thành cấu trúc cây phân cấp ba cấp
//   const organizeContractsHierarchy = useCallback(() => {
//     console.log("ContractTree received: ", contracts.length, "contracts");

//     // Nếu các contracts đã có cấu trúc phân cấp (có children), giữ nguyên cấu trúc đó
//     const hasStructure = contracts.some(
//       (c) => c.children && c.children.length > 0
//     );
//     if (hasStructure) {
//       console.log(
//         "ContractTree: Input already has hierarchy, using it directly"
//       );
//       // Làm phẳng các contracts để đếm số lượng
//       let total = contracts.length;
//       contracts.forEach((c) => {
//         if (c.children) {
//           total += c.children.length;
//           c.children.forEach((cc) => {
//             if (cc.children) total += cc.children.length;
//           });
//         }
//       });
//       console.log(
//         `ContractTree: Using existing hierarchy with ${total} total contracts`
//       );
//       return [...contracts];
//     }

//     console.log("ContractTree: Building hierarchy from scratch");

//     // Hàm phân loại và tạo map cho liabilities
//     const categorizeLiabilityContracts = (contracts: ContractNode[]) => {
//       const map: Record<string, ContractNode> = {};
//       const list: ContractNode[] = [];

//       contracts.forEach((contract) => {
//         if (getContractType(contract) === "liability") {
//           const liability = { ...contract, children: [] };
//           map[contract.oracleData?.ID ?? ""] = liability;
//           list.push(liability);
//         }
//       });

//       return { map, list };
//     };

//     // Hàm gán issue contracts vào liability parent của chúng
//     const assignIssueContracts = (
//       contracts: ContractNode[],
//       liabilityMap: Record<string, ContractNode>
//     ) => {
//       const issueMap: Record<string, ContractNode> = {};

//       contracts.forEach((contract) => {
//         if (getContractType(contract) === "issue") {
//           const issue = { ...contract, children: [] };
//           issueMap[contract.oracleData?.ID ?? ""] = issue;

//           const parentId = contract.oracleData?.LIAB_CONTRACT;
//           if (parentId && liabilityMap[parentId]) {
//             liabilityMap[parentId].children?.push(issue);
//           }
//         }
//       });

//       return issueMap;
//     };

//     // Hàm gán card contracts vào issue hoặc liability parent của chúng
//     const assignCardContracts = (
//       contracts: ContractNode[],
//       liabilityMap: Record<string, ContractNode>,
//       issueMap: Record<string, ContractNode>
//     ) => {
//       contracts.forEach((contract) => {
//         if (getContractType(contract) === "card") {
//           // Thử tìm parent dựa trên ACNT_CONTRACT__OID (issue parent)
//           const issueParentId = contract.oracleData?.ACNT_CONTRACT__OID;
//           if (issueParentId && issueMap[issueParentId]) {
//             issueMap[issueParentId].children?.push({ ...contract });
//             return;
//           }

//           // Thử tìm parent dựa trên LIAB_CONTRACT (liability parent)
//           const liabParentId = contract.oracleData?.LIAB_CONTRACT;
//           if (liabParentId && liabilityMap[liabParentId]) {
//             liabilityMap[liabParentId].children?.push({ ...contract });
//             return;
//           }
//         }
//       });
//     };

//     // Thực hiện các bước tổ chức cây
//     const { map: liabilityMap, list: result } =
//       categorizeLiabilityContracts(contracts);
//     const issueMap = assignIssueContracts(contracts, liabilityMap);
//     assignCardContracts(contracts, liabilityMap, issueMap);

//     console.log(
//       `ContractTree: Organized ${result.length} top-level contracts from ${contracts.length} input contracts`
//     );

//     return result;
//   }, [contracts, getContractType]);

//   // Sắp xếp contracts theo AMND_DATE mới nhất lên đầu
//   // Đặt trong useMemo để tránh tính toán lại mỗi khi render
//   const sortedHierarchicalContracts = useMemo(() => {
//     const hierarchicalContracts = organizeContractsHierarchy();

//     // Sắp xếp danh sách chính
//     return [...hierarchicalContracts].sort((a, b) => {
//       // Lấy AMND_DATE từ oracleData nếu có
//       const dateA = a.oracleData?.AMND_DATE
//         ? new Date(a.oracleData.AMND_DATE).getTime()
//         : 0;
//       const dateB = b.oracleData?.AMND_DATE
//         ? new Date(b.oracleData.AMND_DATE).getTime()
//         : 0;
//       // Sắp xếp giảm dần (mới nhất lên đầu)
//       return dateB - dateA;
//     });
//   }, [organizeContractsHierarchy]);

//   // Tìm kiếm trong cây contracts
//   const filteredContracts = useMemo(() => {
//     if (!searchQuery.trim()) return sortedHierarchicalContracts;

//     const lowerQuery = searchQuery.toLowerCase();

//     // Hàm kiểm tra xem contract có khớp với tìm kiếm không
//     const doesContractMatch = (contract: ContractNode): boolean => {
//       return (
//         contract.title.toLowerCase().includes(lowerQuery) ||
//         (contract.liability?.contractNumber?.toLowerCase() ?? "").includes(
//           lowerQuery
//         ) ||
//         (contract.oracleData?.CONTRACT_NUMBER?.toLowerCase() ?? "").includes(
//           lowerQuery
//         ) ||
//         (contract.oracleData?.CARD_NUMBER?.toLowerCase() ?? "").includes(
//           lowerQuery
//         )
//       );
//     };

//     // Clone cây contracts và lọc
//     return sortedHierarchicalContracts.filter((contract) => {
//       // Kiểm tra contract chính
//       if (doesContractMatch(contract)) return true;

//       // Kiểm tra các contract con
//       if (contract.children && contract.children.length > 0) {
//         // Lọc và giữ lại các contract con khớp với tìm kiếm
//         const matchingChildren = contract.children.filter((child) =>
//           doesContractMatch(child)
//         );

//         if (matchingChildren.length > 0) {
//           // Clone contract và chỉ giữ lại các con khớp với tìm kiếm
//           contract.children = matchingChildren;
//           return true;
//         }
//       }

//       return false;
//     });
//   }, [searchQuery, sortedHierarchicalContracts]);

//   // Làm phẳng danh sách contracts cho hiển thị và phân trang
//   const flattenContractsForCurrentPage = useCallback(
//     (contracts: ContractNode[], page: number, itemsPerPage: number) => {
//       const flattened: { contract: ContractNode; level: number }[] = [];
//       let flatIndex = 0;
//       const startIndex = (page - 1) * itemsPerPage;
//       const endIndex = startIndex + itemsPerPage - 1;

//       // Hàm đệ quy flatten với early return khi đã đủ số lượng cần thiết
//       const processContract = (contract: ContractNode, level: number) => {
//         // Skip nếu đã quá trang hiện tại
//         if (flatIndex > endIndex) {
//           return false; // Đã đủ dữ liệu, dừng xử lý
//         }

//         // Thêm contract hiện tại nếu nằm trong khoảng trang hiện tại
//         if (flatIndex >= startIndex && flatIndex <= endIndex) {
//           flattened.push({ contract, level });
//         }

//         flatIndex++;

//         // Chỉ xử lý các con nếu contract được mở rộng và flat index chưa vượt quá endIndex
//         const contractType = getContractType(contract);
//         if (
//           expandedContracts[contract.id] &&
//           contract.children &&
//           contract.children.length > 0 &&
//           flatIndex <= endIndex
//         ) {
//           for (const child of contract.children) {
//             // Nếu processContract return false (đã đủ dữ liệu), dừng vòng lặp
//             const childLevel =
//               contractType === "issue" && getContractType(child) === "card"
//                 ? level + 2
//                 : level + 1;

//             if (!processContract(child, childLevel)) {
//               return false;
//             }
//           }
//         }

//         return flatIndex <= endIndex; // Còn cần thêm dữ liệu không
//       };

//       // Xử lý từng contract cấp cao nhất cho đến khi đủ dữ liệu cho trang hiện tại
//       for (const contract of contracts) {
//         if (!processContract(contract, 0)) {
//           break; // Đã đủ dữ liệu cho trang hiện tại
//         }
//       }

//       return flattened;
//     },
//     [expandedContracts, getContractType]
//   );

//   // Tính tổng số contracts để phân trang (tính cả đã mở rộng)
//   const totalContractCount = useMemo(() => {
//     let count = 0;

//     const countContract = (contract: ContractNode) => {
//       count++;

//       if (
//         expandedContracts[contract.id] &&
//         contract.children &&
//         contract.children.length > 0
//       ) {
//         contract.children.forEach(countContract);
//       }
//     };

//     filteredContracts.forEach(countContract);

//     return count;
//   }, [filteredContracts, expandedContracts]);

//   // Phân trang
//   const totalPages = Math.ceil(totalContractCount / contractsPerPage);

//   // Tính toán các contract hiển thị theo trang hiện tại
//   const displayedContracts = useMemo(() => {
//     return flattenContractsForCurrentPage(
//       filteredContracts,
//       currentPage,
//       contractsPerPage
//     );
//   }, [
//     filteredContracts,
//     currentPage,
//     contractsPerPage,
//     flattenContractsForCurrentPage,
//   ]);

//   // Animation effect được tối ưu để mượt mà khi chuyển trang
//   useEffect(() => {
//     // Đánh dấu tất cả các contracts là đã animate ngay lập tức
//     const allAnimated = displayedContracts.reduce((acc, item) => {
//       acc[item.contract.id] = true;
//       return acc;
//     }, {} as Record<string, boolean>);

//     dispatch(setAnimatedRows(allAnimated));

//     // Đánh dấu trang đã thăm
//     if (!visitedPages[currentPage]) {
//       dispatch(visitPage(currentPage));
//     }
//   }, [displayedContracts, currentPage, visitedPages, dispatch]);

//   // Reset animation chỉ khi search query thay đổi
//   useEffect(() => {
//     // Vẫn reset các state cần thiết khi thay đổi search
//     dispatch(resetVisitedPages());
//     dispatch(setTreeCurrentPage(1));
//   }, [searchQuery, dispatch]);

//   // Format date for display
//   const formatDate = (dateString: string | undefined) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       });
//     } catch (_) {
//       return "";
//     }
//   };

//   // Xử lý chuyển trang
//   const handlePageChange = (pageNumber: number) => {
//     if (pageNumber === currentPage) return;
//     dispatch(setTreeCurrentPage(pageNumber));
//   };

//   // Toggle mở rộng/thu gọn contract
//   const handleToggleExpandContract = (
//     contractId: string,
//     event: React.MouseEvent
//   ) => {
//     event.stopPropagation();
//     dispatch(toggleExpandContract(contractId));
//   };

//   // Get icon based on contract type
//   const getContractIcon = (contract: ContractNode) => {
//     const contractType = getContractType(contract);
//     return contractStyles[contractType]?.icon || contractStyles.default.icon;
//   };

//   // Get icon color based on contract type
//   const getIconColor = (contract: ContractNode) => {
//     const contractType = getContractType(contract);
//     return contractStyles[contractType]?.color || contractStyles.default.color;
//   };

//   // Get icon background based on contract type
//   const getIconBackground = (contract: ContractNode) => {
//     const contractType = getContractType(contract);
//     return contractStyles[contractType]?.bg || contractStyles.default.bg;
//   };

//   // Get style for highlight background
//   const getHighlightStyle = (
//     contract: ContractNode,
//     isSelected: boolean,
//     isAncestor: boolean,
//     ancestorLevel: number
//   ) => {
//     const contractType = getContractType(contract);
//     const styles = contractStyles[contractType] || contractStyles.default;
//     const marginLeft = styles.marginLeft;

//     // Xác định background dựa vào trạng thái
//     let bgClass = "bg-transparent border-transparent";

//     if (isSelected) {
//       bgClass = styles.selectedBg;
//     } else if (isAncestor) {
//       const isParent = ancestorLevel === 1;
//       const isGrandparent = ancestorLevel === 2;
//       if (
//         (contractType === "issue" && isParent) ||
//         (contractType === "liability" && (isGrandparent || isParent))
//       ) {
//         bgClass = styles.parentBg ?? bgClass;
//       }
//     }
//     return `${marginLeft} ${bgClass}`;
//   };

//   // Tạo pagination buttons
//   const renderPaginationButtons = useMemo(() => {
//     if (totalPages <= 1) return null;

//     const buttons = [];

//     // Previous button
//     buttons.push(
//       <button
//         key="prev"
//         onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
//         disabled={currentPage === 1}
//         className={`px-3 py-1 rounded-md ${
//           currentPage === 1
//             ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
//             : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
//         }`}
//       >
//         Prev
//       </button>
//     );

//     // Page buttons with ellipsis
//     [...Array(totalPages)].forEach((_, index) => {
//       const pageNum = index + 1;

//       // Hiển thị nút cho trang đầu, trang cuối và các trang gần trang hiện tại
//       if (
//         pageNum === 1 ||
//         pageNum === totalPages ||
//         (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
//       ) {
//         buttons.push(
//           <button
//             key={`page-${pageNum}`}
//             onClick={() => handlePageChange(pageNum)}
//             className={`w-8 h-8 rounded-md ${
//               pageNum === currentPage
//                 ? "bg-primary-600 text-white dark:bg-primary-700"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
//             }`}
//           >
//             {pageNum}
//           </button>
//         );
//       }
//       // Hiển thị dấu "..." nếu có khoảng cách
//       else if (
//         (pageNum === 2 && currentPage > 3) ||
//         (pageNum === totalPages - 1 && currentPage < totalPages - 2)
//       ) {
//         buttons.push(
//           <span key={`ellipsis-${pageNum}`} className="px-2 self-end pb-1">
//             ...
//           </span>
//         );
//       }
//     });

//     // Next button
//     buttons.push(
//       <button
//         key="next"
//         onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
//         disabled={currentPage === totalPages}
//         className={`px-3 py-1 rounded-md ${
//           currentPage === totalPages
//             ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
//             : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
//         }`}
//       >
//         Next
//       </button>
//     );

//     return <div className="mt-4 flex justify-center space-x-2">{buttons}</div>;
//   }, [currentPage, totalPages, handlePageChange]);

//   // Cập nhật hàm xử lý chọn contract để theo dõi ancestors
//   const handleSelectContract = (contract: ContractNode) => {
//     // Tìm đường dẫn ancestors của contract này
//     const ancestors = findAncestorPath(contract.id);
//     dispatch(setAncestorPath(ancestors));

//     // Gọi hàm onSelect gốc
//     onSelect(contract);
//   };

//   // Hàm tìm đường dẫn ancestors cho một contract - cải thiện việc tìm kiếm cha
//   const findAncestorPath = (contractId: string): string[] => {
//     const path: string[] = [];

//     // Hàm đệ quy để tìm tổ tiên
//     const findParent = (
//       contracts: ContractNode[],
//       id: string,
//       currentPath: string[] = []
//     ): boolean => {
//       for (const contract of contracts) {
//         // Nếu contract này chính là contract đang tìm
//         if (contract.id === id) {
//           return true;
//         }

//         // Kiểm tra nếu contract này có con trùng với id
//         if (contract.children?.some((child) => child.id === id)) {
//           currentPath.push(contract.id);
//           return true;
//         }

//         // Tìm kiếm đệ quy trong các contract con
//         if (contract.children && contract.children.length > 0) {
//           const tempPath: string[] = [];
//           if (findParent(contract.children, id, tempPath)) {
//             currentPath.push(contract.id);
//             currentPath.push(...tempPath);
//             return true;
//           }
//         }
//       }

//       return false;
//     };

//     // Bắt đầu tìm kiếm từ danh sách contracts cấp cao nhất
//     const ancestorPath: string[] = [];
//     findParent(sortedHierarchicalContracts, contractId, ancestorPath);
//     path.push(contractId, ...ancestorPath);

//     return path;
//   };

//   // Hàm kiểm tra xem một node có phải là tổ tiên của node được chọn hay không
//   const isAncestorOfSelected = useCallback(
//     (contractId: string): boolean => {
//       return ancestorPath.includes(contractId) && contractId !== selectedId;
//     },
//     [ancestorPath, selectedId]
//   );

//   return (
//     <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-gray-700/30 bg-white dark:bg-gray-800/90 transition-all duration-300 h-[calc(100vh-250px)] md:h-[calc(100vh-180px)]">
//       {/* Inject custom animation styles */}
//       <style jsx>{animationStyles}</style>

//       <div className="p-4 flex flex-col h-full">
//         <div className="mb-4 relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <RiSearchLine className="text-gray-400 dark:text-gray-500" />
//           </div>
//           <Input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => dispatch(setTreeSearchQuery(e.target.value))}
//             placeholder="Search contracts..."
//             className="pl-10 w-full bg-white dark:bg-gray-700/70 border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500"
//           />
//         </div>

//         <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar rounded-xl border border-gray-200/60 dark:border-gray-700/30 bg-white/80 dark:bg-gray-800/50">
//           {displayedContracts.length > 0 ? (
//             <div className="space-y-1 p-2">
//               {displayedContracts.map((item) => {
//                 const { contract, level } = item;
//                 const isSelected = selectedId === contract.id;
//                 const isAnimated =
//                   animatedRowsMap[contract.id] || currentPage === 1;
//                 const amendDate = contract.oracleData?.AMND_DATE;
//                 const contractType = getContractType(contract);
//                 const hasChildren =
//                   (contractType === "liability" || contractType === "issue") &&
//                   contract.children &&
//                   contract.children.length > 0;
//                 const isExpanded = expandedContracts[contract.id];

//                 // Lấy màu sắc từ loại contract tương ứng với ContractDetail
//                 const getBackgroundGradient = () => {
//                   if (isSelected) {
//                     switch (contractType) {
//                       case "liability":
//                         return "bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-800";
//                       case "issue":
//                         return "bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700";
//                       case "card":
//                         return "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800";
//                       default:
//                         return "bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-800";
//                     }
//                   }
//                   return "";
//                 };

//                 return (
//                   <div
//                     key={contract.id}
//                     role="button"
//                     tabIndex={0}
//                     className={`transition-all duration-500 ease-out ${
//                       isAnimated
//                         ? "opacity-100 transform-none"
//                         : "opacity-0 translate-y-4"
//                     }`}
//                     onMouseEnter={() => dispatch(setHoveredRow(contract.id))}
//                     onMouseLeave={() => dispatch(setHoveredRow(null))}
//                   >
//                     <div
//                       className={clsx(
//                         "group flex items-center py-2 px-3 my-1 cursor-pointer rounded-lg transition-all duration-200",
//                         "relative",
//                         level === 0
//                           ? ""
//                           : level === 1
//                           ? "ml-5 relative"
//                           : level === 2
//                           ? "ml-10 relative"
//                           : level >= 3
//                           ? "ml-14 relative"
//                           : "",
//                         hoveredRow === contract.id && !isSelected
//                           ? "shadow-md dark:shadow-gray-900/50 z-10 scale-[1.01] bg-white/90 dark:bg-gray-700/50"
//                           : "",
//                         isSelected
//                           ? "shadow-lg border-0 z-20 transform-gpu scale-[1.02]"
//                           : isAncestorOfSelected(contract.id)
//                           ? "shadow-md z-10"
//                           : ""
//                       )}
//                     >
//                       {/* Background highlight với gradient giống ContractDetail */}
//                       <div
//                         className={clsx(
//                           "absolute inset-0 rounded-lg border transition-all duration-200",
//                           isSelected
//                             ? getBackgroundGradient() // Gradient giống với ContractDetail header
//                             : isAncestorOfSelected(contract.id)
//                             ? `bg-${
//                                 contractType === "liability"
//                                   ? "blue"
//                                   : contractType === "issue"
//                                   ? "purple"
//                                   : "emerald"
//                               }-100 dark:bg-${
//                                 contractType === "liability"
//                                   ? "blue"
//                                   : contractType === "issue"
//                                   ? "purple"
//                                   : "emerald"
//                               }-900/40 border-${
//                                 contractType === "liability"
//                                   ? "blue"
//                                   : contractType === "issue"
//                                   ? "purple"
//                                   : "emerald"
//                               }-300 dark:border-${
//                                 contractType === "liability"
//                                   ? "blue"
//                                   : contractType === "issue"
//                                   ? "purple"
//                                   : "emerald"
//                               }-600`
//                             : hoveredRow === contract.id
//                             ? `bg-${
//                                 contractType === "liability"
//                                   ? "blue"
//                                   : contractType === "issue"
//                                   ? "purple"
//                                   : "emerald"
//                               }-50 dark:bg-${
//                                 contractType === "liability"
//                                   ? "blue"
//                                   : contractType === "issue"
//                                   ? "purple"
//                                   : "emerald"
//                               }-900/30 border-${
//                                 contractType === "liability"
//                                   ? "blue"
//                                   : contractType === "issue"
//                                   ? "purple"
//                                   : "emerald"
//                               }-200 dark:border-${
//                                 contractType === "liability"
//                                   ? "blue"
//                                   : contractType === "issue"
//                                   ? "purple"
//                                   : "emerald"
//                               }-700`
//                             : "bg-white/0 dark:bg-gray-800/0 border-transparent"
//                         )}
//                       ></div>

//                       {/* Nút mở rộng/thu gọn cho Liability contracts có con */}
//                       {hasChildren ? (
//                         <button
//                           onClick={(e) =>
//                             handleToggleExpandContract(contract.id, e)
//                           }
//                           className={`mr-1 p-1 rounded-md transition-colors relative z-10 ${
//                             isSelected
//                               ? "hover:bg-white/40 text-white"
//                               : isAncestorOfSelected(contract.id)
//                               ? `text-${
//                                   contractType === "liability"
//                                     ? "blue"
//                                     : contractType === "issue"
//                                     ? "purple"
//                                     : "emerald"
//                                 }-700 dark:text-${
//                                   contractType === "liability"
//                                     ? "blue"
//                                     : contractType === "issue"
//                                     ? "purple"
//                                     : "emerald"
//                                 }-300 hover:bg-${
//                                   contractType === "liability"
//                                     ? "blue"
//                                     : contractType === "issue"
//                                     ? "purple"
//                                     : "emerald"
//                                 }-100 dark:hover:bg-${
//                                   contractType === "liability"
//                                     ? "blue"
//                                     : contractType === "issue"
//                                     ? "purple"
//                                     : "emerald"
//                                 }-900/30`
//                               : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
//                           }`}
//                           aria-label={isExpanded ? "Collapse" : "Expand"}
//                         >
//                           {isExpanded ? (
//                             <RiArrowDownSLine className="w-4 h-4" />
//                           ) : (
//                             <RiArrowRightSLine className="w-4 h-4" />
//                           )}
//                         </button>
//                       ) : (
//                         <div className="w-6 relative z-10"></div>
//                       )}

//                       {/* Icon với style giống contract detail */}
//                       <div
//                         role="button"
//                         tabIndex={0}
//                         className={`p-1.5 rounded-lg mr-3 relative z-10 shadow-sm ${
//                           isSelected
//                             ? "bg-white/30"
//                             : getIconBackground(contract)
//                         }`}
//                         onClick={() => handleSelectContract(contract)}
//                       >
//                         <div
//                           className={
//                             isSelected ? "text-white" : getIconColor(contract)
//                           }
//                         >
//                           {getContractIcon(contract)}
//                         </div>
//                       </div>

//                       <div
//                         className="flex-1 min-w-0 relative z-10"
//                         onClick={() => handleSelectContract(contract)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") handleSelectContract(contract);
//                         }}
//                         tabIndex={0}
//                       >
//                         <div
//                           className={`font-medium ${
//                             isSelected
//                               ? "text-white"
//                               : "text-gray-900 dark:text-white"
//                           } truncate flex items-center`}
//                         >
//                           {contract.title}
//                           <span
//                             className={`ml-2 text-xs ${
//                               isSelected
//                                 ? "bg-white/30 text-white"
//                                 : contractStyles[contractType].badge
//                             } px-2 py-0.5 rounded-full`}
//                           >
//                             {contractType.charAt(0).toUpperCase() +
//                               contractType.slice(1)}
//                           </span>
//                         </div>
//                         <div
//                           className={`text-xs ${
//                             isSelected
//                               ? "text-white"
//                               : "text-gray-500 dark:text-gray-400"
//                           } truncate flex items-center`}
//                         >
//                           <span className="mr-2">
//                             {contractType === "card"
//                               ? contract.oracleData?.CARD_NUMBER ||
//                                 contract.oracleData?.CONTRACT_NUMBER ||
//                                 contract.liability?.contractNumber ||
//                                 "No card number"
//                               : contract.oracleData?.CONTRACT_NUMBER ||
//                                 contract.liability?.contractNumber ||
//                                 "No contract number"}
//                           </span>
//                           {amendDate && (
//                             <span
//                               className={`flex items-center text-xs ${
//                                 isSelected
//                                   ? "bg-white/30 text-white"
//                                   : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
//                               } px-1.5 py-0.5 rounded-md`}
//                             >
//                               <RiCalendarLine className="w-3 h-3 mr-1" />
//                               {formatDate(amendDate)}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
//               <RiFileTextLine className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
//               <p>No contracts found</p>
//               {searchQuery && (
//                 <p className="text-sm mt-1">Try adjusting your search</p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Phân trang styled like ContractDetail */}
//         {renderPaginationButtons && (
//           <div className="mt-4 flex justify-center space-x-2">
//             {renderPaginationButtons}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
