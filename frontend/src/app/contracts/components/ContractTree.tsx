"use client";

import { ReactNode } from "react";
import {
  RiArrowRightSLine,
  RiArrowDownSLine,
  RiFileTextLine,
  RiSearchLine,
  RiFileList3Line,
  RiExchangeFundsLine,
  RiCalendarLine,
  RiIdCardLine,
} from "react-icons/ri";
import clsx from "clsx";
import { ContractNode } from "../types";
import Input from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSelectedContract,
  toggleExpandContract,
  setTreeSearchQuery,
  setTreeCurrentPage,
  selectExpandedContracts,
  selectTreeSearchQuery,
  selectTreeCurrentPage,
  selectTreeTotalPages,
  selectTreeTotalItems,
  selectTreeItemsPerPage,
  selectHighlightedAncestors,
} from "@/redux/slices/contractSlice";

interface ContractStyle {
  icon: ReactNode;
  color: string;
  bg: string;
  selectedBg: string;
  badge: string;
  marginLeft: string;
  parentBg?: string; // Thêm từ file dài hơn để highlight tổ tiên
}

const contractStyles: Record<string, ContractStyle> = {
  card: {
    icon: <RiIdCardLine className="w-5 h-5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    selectedBg:
      "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700/50",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    marginLeft: "ml-10",
    parentBg: "bg-transparent border-transparent",
  },
  issue: {
    icon: <RiExchangeFundsLine className="w-5 h-5" />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    selectedBg:
      "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700/50",
    badge:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    marginLeft: "ml-5",
    parentBg:
      "bg-purple-50/50 dark:bg-purple-900/10 border-purple-200/60 dark:border-purple-800/20",
  },
  liability: {
    icon: <RiFileList3Line className="w-5 h-5" />,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    selectedBg:
      "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700/50",
    badge:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    marginLeft: "ml-0",
    parentBg:
      "bg-indigo-50/90 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800/30",
  },
  default: {
    icon: <RiFileTextLine className="w-5 h-5" />,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800/50",
    selectedBg:
      "bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700/50",
    badge: "",
    marginLeft: "ml-0",
    parentBg: "bg-transparent border-transparent",
  },
};

interface ContractTreeProps {
  contracts: ContractNode[];
  selectedId: string | null;
  onSelect: (contract: ContractNode) => void;
}

const animationStyles = `
  @keyframes ping-slow {
    0% { transform: scale(1); opacity: 0.8; }
    75%, 100% { transform: scale(1.8); opacity: 0; }
  }
  .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
`;

export default function ContractTree({
  contracts,
  selectedId,
  onSelect,
}: ContractTreeProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectTreeSearchQuery);
  const expandedContracts = useAppSelector(selectExpandedContracts);
  const currentPage = useAppSelector(selectTreeCurrentPage);
  const totalPages = useAppSelector(selectTreeTotalPages);
  const totalItems = useAppSelector(selectTreeTotalItems);
  const itemsPerPage = useAppSelector(selectTreeItemsPerPage);
  const highlightedAncestors = useAppSelector(selectHighlightedAncestors);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getContractIcon = (contract: ContractNode) =>
    contractStyles[contract.type]?.icon || contractStyles.default.icon;
  const getIconColor = (contract: ContractNode) =>
    contractStyles[contract.type]?.color || contractStyles.default.color;
  const getIconBackground = (contract: ContractNode) =>
    contractStyles[contract.type]?.bg || contractStyles.default.bg;

  const handleToggleExpandContract = (
    contractId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    dispatch(toggleExpandContract(contractId));
  };

  const handleSelectContract = (contract: ContractNode) => {
    dispatch(setSelectedContract(contract));
    onSelect(contract);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== currentPage) dispatch(setTreeCurrentPage(pageNumber));
  };

  const renderContractNode = (contract: ContractNode) => {
    const isSelected = selectedId === contract.id;
    const isAncestor = highlightedAncestors.includes(contract.id);
    const amendDate = contract.oracleData?.AMND_DATE;
    const hasChildren =
      (contract.type === "liability" || contract.type === "issue") &&
      contract.children &&
      contract.children.length > 0;
    const isExpanded = expandedContracts[contract.id] ?? false;

    const getBackgroundGradient = () => {
      if (isSelected) {
        switch (contract.type) {
          case "liability":
            return "bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-800";
          case "issue":
            return "bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700";
          case "card":
            return "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800";
          default:
            return "bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-800";
        }
      } else if (isAncestor) {
        return (
          contractStyles[contract.type]?.parentBg ||
          "bg-transparent border-transparent"
        );
      }
      return "bg-white/0 dark:bg-gray-800/0 border-transparent";
    };

    return (
      <div key={contract.id}>
        <div
          role="button"
          tabIndex={0}
          className={clsx(
            "group flex items-center py-2 px-3 my-1 cursor-pointer rounded-lg transition-all duration-200 relative",
            contractStyles[contract.type]?.marginLeft || "ml-0",
            isSelected && "shadow-lg border-0 z-20 transform-gpu scale-[1.02]",
            isAncestor && !isSelected && "shadow-md z-10"
          )}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        >
          <div
            className={clsx(
              "absolute inset-0 rounded-lg border transition-all duration-200",
              getBackgroundGradient()
            )}
          ></div>
          {hasChildren ? (
            <button
              onClick={(e) => handleToggleExpandContract(contract.id, e)}
              className={clsx(
                "mr-1 p-1 rounded-md transition-colors relative z-10",
                isSelected
                  ? "hover:bg-white/40 text-white"
                  : isAncestor
                  ? `text-${
                      contract.type === "liability"
                        ? "blue"
                        : contract.type === "issue"
                        ? "purple"
                        : "emerald"
                    }-700 dark:text-${
                      contract.type === "liability"
                        ? "blue"
                        : contract.type === "issue"
                        ? "purple"
                        : "emerald"
                    }-300 hover:bg-${
                      contract.type === "liability"
                        ? "blue"
                        : contract.type === "issue"
                        ? "purple"
                        : "emerald"
                    }-100 dark:hover:bg-${
                      contract.type === "liability"
                        ? "blue"
                        : contract.type === "issue"
                        ? "purple"
                        : "emerald"
                    }-900/30`
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              )}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <RiArrowDownSLine className="w-4 h-4" />
              ) : (
                <RiArrowRightSLine className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6 relative z-10"></div>
          )}
          <div
            role="button"
            tabIndex={0}
            className={clsx(
              "p-1.5 rounded-lg mr-3 relative z-10 shadow-sm",
              isSelected ? "bg-white/30" : getIconBackground(contract)
            )}
            onClick={() => handleSelectContract(contract)}
          >
            <div className={isSelected ? "text-white" : getIconColor(contract)}>
              {getContractIcon(contract)}
            </div>
          </div>
          <div
            className="flex-1 min-w-0 relative z-10"
            onClick={() => handleSelectContract(contract)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSelectContract(contract);
            }}
            tabIndex={0}
          >
            <div
              className={clsx(
                "font-medium truncate flex items-center",
                isSelected ? "text-white" : "text-gray-900 dark:text-white"
              )}
            >
              {contract.title}
              <span
                className={clsx(
                  "ml-2 text-xs px-2 py-0.5 rounded-full",
                  isSelected
                    ? "bg-white/30 text-white"
                    : contractStyles[contract.type]?.badge || ""
                )}
              >
                {contract.type.charAt(0).toUpperCase() + contract.type.slice(1)}
              </span>
            </div>
            <div
              className={clsx(
                "text-xs truncate flex items-center",
                isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"
              )}
            >
              <span className="mr-2">
                {contract.type === "card"
                  ? contract.oracleData?.CARD_NUMBER ||
                    contract.oracleData?.CONTRACT_NUMBER ||
                    "No card number"
                  : contract.oracleData?.CONTRACT_NUMBER ||
                    "No contract number"}
              </span>
              {amendDate && (
                <span
                  className={clsx(
                    "flex items-center text-xs px-1.5 py-0.5 rounded-md",
                    isSelected
                      ? "bg-white/30 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  )}
                >
                  <RiCalendarLine className="w-3 h-3 mr-1" />
                  {formatDate(amendDate)}
                </span>
              )}
            </div>
          </div>
        </div>
        {isExpanded &&
          hasChildren &&
          contract.children?.map((child) => renderContractNode(child))}
      </div>
    );
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const buttons = [];

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={clsx(
          "px-3 py-1 rounded-md",
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
        )}
      >
        Prev
      </button>
    );

    [...Array(totalPages)].forEach((_, index) => {
      const pageNum = index + 1;
      if (
        pageNum === 1 ||
        pageNum === totalPages ||
        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={`page-${pageNum}`}
            onClick={() => handlePageChange(pageNum)}
            className={clsx(
              "w-8 h-8 rounded-md",
              pageNum === currentPage
                ? "bg-primary-600 text-white dark:bg-primary-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            )}
          >
            {pageNum}
          </button>
        );
      } else if (
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

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={clsx(
          "px-3 py-1 rounded-md",
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
        )}
      >
        Next
      </button>
    );

    return <div className="mt-4 flex justify-center space-x-2">{buttons}</div>;
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-gray-700/30 bg-white dark:bg-gray-800/90 transition-all duration-300 h-[calc(100vh-250px)] md:h-[calc(100vh-180px)]">
      <style jsx>{animationStyles}</style>
      <div className="p-4 flex flex-col h-full">
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <RiSearchLine className="text-gray-400 dark:text-gray-500" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setTreeSearchQuery(e.target.value))}
            placeholder="Search contracts..."
            className="pl-10 w-full bg-white dark:bg-gray-700/70 border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500"
          />
        </div>

        <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar rounded-xl border border-gray-200/60 dark:border-gray-700/30 bg-white/80 dark:bg-gray-800/50">
          {contracts.length > 0 ? (
            <div className="space-y-1 p-2">
              {contracts.map((contract) => renderContractNode(contract))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
              <RiFileTextLine className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p>No contracts found</p>
              {searchQuery && (
                <p className="text-sm mt-1">Try adjusting your search</p>
              )}
            </div>
          )}
        </div>

        {contracts.length > 0 && (
          <div className="mt-4 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} contracts
              </div>
            </div>
            {renderPaginationButtons()}
          </div>
        )}
      </div>
    </div>
  );
}
