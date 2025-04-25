"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  RiFileTextLine,
  RiArrowLeftLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { ContractNode } from "./types";
import ContractTree from "./components/ContractTree";
import ContractDetail from "./components/ContractDetail";
import ContractHeader from "./components/ContractHeader";
import AddContractModal from "./components/AddContractModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchContracts,
  fetchContractsByClient,
  setSelectedContract,
  setTreeCurrentPage,
  selectContracts,
  selectSelectedContract,
  selectIsLoading,
  selectError,
  selectTreeCurrentPage,
  selectTreeTotalPages,
  selectTreeItemsPerPage,
  selectTreeSearchQuery,
} from "@/redux/slices/contractSlice";
import { showToast } from "@/redux/slices/toastSlice";
import ToastContainer from "@/components/ToastContainer";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}
  ></div>
);

export default function ContractsPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const contracts = useAppSelector(selectContracts);
  const selectedContract = useAppSelector(selectSelectedContract);
  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const currentPage = useAppSelector(selectTreeCurrentPage);
  const totalPages = useAppSelector(selectTreeTotalPages);
  const itemsPerPage = useAppSelector(selectTreeItemsPerPage);
  const searchQuery = useAppSelector(selectTreeSearchQuery);

  const clientId = searchParams.get("clientId");
  const clientName = searchParams.get("clientName") || undefined;

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMobile && selectedContract) setShowDetailPanel(true);
  }, [selectedContract, isMobile]);

  useEffect(() => {
    if (clientId) {
      setIsSearching(true);
      dispatch(
        fetchContractsByClient({ clientId, page: currentPage, searchQuery })
      )
        .then(() => {
          setIsSearching(false);
        })
        .catch(() => {
          setIsSearching(false);
          dispatch(
            showToast({
              message: "Error loading client contracts",
              type: "error",
              duration: 3000,
            })
          );
        });
    } else {
      setIsSearching(true);
      dispatch(fetchContracts({ page: currentPage, searchQuery }))
        .then(() => {
          setIsSearching(false);
        })
        .catch(() => {
          setIsSearching(false);
          dispatch(
            showToast({
              message: "Error loading contracts",
              type: "error",
              duration: 3000,
            })
          );
        });
    }
  }, [dispatch, clientId, currentPage, searchQuery, itemsPerPage]);

  const handleSelectContract = (contract: ContractNode) => {
    dispatch(setSelectedContract(contract));
    if (isMobile) setShowDetailPanel(true);
  };

  const handleClearClientFilter = () => {
    dispatch(setSelectedContract(null)); // Xóa contract đã chọn khi clear filter
    dispatch(fetchContracts({ page: 1, searchQuery: "" }));
    router.push("/contracts");
  };

  const handleAddContract = () => setIsAddModalOpen(true);
  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
    if (isMobile) dispatch(setSelectedContract(null)); // Xóa contract đã chọn khi đóng panel trên mobile
  };

  if (loading && contracts.length === 0) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-500">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 min-h-screen relative overflow-hidden">
      <ToastContainer />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300/10 to-indigo-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-primary-300/10 to-indigo-400/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <ContractHeader
          clientName={clientName}
          clearClientFilter={clientId ? handleClearClientFilter : undefined}
          onAddContract={handleAddContract}
        />
        <div
          className={`relative ${
            isMobile ? "flex flex-col" : "flex flex-row gap-6"
          }`}
        >
          <div
            className={`${isMobile ? "w-full" : "w-1/3"} ${
              isMobile && showDetailPanel ? "hidden md:block" : "block"
            } transition-all duration-300 ease-in-out`}
          >
            <ContractTree
              contracts={contracts}
              selectedId={selectedContract?.id || null}
              onSelect={handleSelectContract}
            />
          </div>
          {!isMobile && (
            <div className="flex-1 transition-all duration-300 ease-in-out">
              {selectedContract ? (
                <div className="animate-fadeIn">
                  <ContractDetail contract={selectedContract} />
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300 h-[750px] flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
                  <div className="p-6 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-full mb-6">
                    <RiFileTextLine className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Select a contract to view details
                  </h3>
                  <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
                    Choose a contract from the list on the left to view detailed
                    information.
                  </p>
                  <div className="mt-8 flex space-x-4">
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                      Import contract
                    </button>
                    <button
                      className="px-5 py-2.5 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
                      onClick={handleAddContract}
                    >
                      Create new contract
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {isMobile && (
            <div
              className={`fixed inset-0 bg-gray-900/50 z-40 transition-opacity duration-300 ${
                showDetailPanel
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
              onClick={handleCloseDetailPanel}
            >
              <div
                className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl transition-transform duration-300 transform ${
                  showDetailPanel ? "translate-y-0" : "translate-y-full"
                } h-[90vh] overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedContract?.title || "Contract Details"}
                  </h3>
                  <button
                    onClick={handleCloseDetailPanel}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <RiArrowLeftLine className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="h-[calc(90vh-60px)] overflow-auto">
                  {selectedContract ? (
                    <div className="animate-fadeIn">
                      <ContractDetail contract={selectedContract} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fadeIn">
                      <div className="p-6 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-full mb-6">
                        <RiFileTextLine className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        No contract selected
                      </h3>
                      <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
                        Choose a contract from the list to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
      {isAddModalOpen && (
        <AddContractModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}
