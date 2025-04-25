"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  RiFileTextLine,
  RiAddLine,
  RiInformationLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseLine,
} from "react-icons/ri";
import Button from "@/components/ui/Button";
import AddContractModal from "@/app/contracts/components/AddContractModal";
import ContractTree from "@/app/contracts/components/ContractTree";
import ContractDetail from "@/app/contracts/components/ContractDetail";
import { ContractNode } from "@/app/contracts/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToast } from "@/redux/slices/toastSlice";
import {
  fetchContractsByClient,
  setSelectedContract as selectContract,
  setTreeCurrentPage,
  resetState,
} from "@/redux/slices/contractSlice";
import ToastContainer from "@/components/ToastContainer";

// Định nghĩa kiểu dữ liệu cho Client
interface Client {
  ID?: string;
  shortName?: string;
  companyName?: string;
  clientNumber?: string;
  status?: string;
  [key: string]: any;
}

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}
  ></div>
);

export default function CustomerContractsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const clientId = params.id as string;

  // Sử dụng Redux state thay vì state cục bộ
  const {
    contracts,
    selectedContract,
    isLoading,
    error,
    tree: { currentPage, totalPages },
  } = useAppSelector((state) => state.contracts);

  const [client, setClient] = useState<Client | null>(null);
  const [clientNumber, setClientNumber] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);

  // Thêm effect để reset state khi component unmount
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  // Fetch client details and contracts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch client details
        const clientResponse = await fetch(
          `http://localhost:5000/api/oracle/clients/${clientId}`
        );
        if (!clientResponse.ok) {
          throw new Error(`Failed to fetch client: ${clientResponse.status}`);
        }

        const clientData = await clientResponse.json();
        setClient(clientData.data);
        setClientNumber(clientData.data.clientNumber);
        console.log("Client number:", clientData.data.clientNumber);
        // Fetch client contracts using Redux action
        dispatch(
          fetchContractsByClient({
            clientId,
            page: currentPage,
          })
        );
      } catch (err) {
        console.error("Error fetching client data:", err);
        dispatch(
          showToast({
            message:
              err instanceof Error ? err.message : "Failed to load client data",
            type: "error",
            duration: 3000,
          })
        );
      }
    };

    fetchData();
  }, [clientId, currentPage, dispatch]);

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
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Hiển thị panel chi tiết khi có contract được chọn trên mobile
  useEffect(() => {
    if (isMobile && selectedContract) {
      setShowDetailPanel(true);
    }
  }, [selectedContract, isMobile]);

  // Log khi load dữ liệu thành công
  useEffect(() => {
    if (contracts.length > 0) {
      console.log(
        `Loaded ${contracts.length} contracts for client ${clientId}`
      );
    }
  }, [contracts, clientId]);

  const handleContractSelect = (contract: ContractNode) => {
    dispatch(selectContract(contract));
    if (isMobile) {
      setShowDetailPanel(true);
    }
  };

  // Đóng panel chi tiết
  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
    if (isMobile) {
      dispatch(selectContract(null));
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setTreeCurrentPage(page));
  };

  // Handle adding a new contract
  const handleAddContract = () => {
    setIsAddModalOpen(true);
  };

  // Xử lý lưu contract mới từ modal
  const handleSaveContract = async (contractData: any) => {
    try {
      console.log("handleSaveContract called with clientId:", clientId);
      console.log("Contract data received:", contractData);

      // Refresh contracts sau khi thêm mới bằng cách dispatch lại action fetchContractsByClient
      dispatch(
        fetchContractsByClient({
          clientId,
          page: currentPage,
        })
      );

      dispatch(
        showToast({
          message: "Contract added successfully",
          type: "success",
          duration: 3000,
        })
      );
    } catch (err) {
      console.error("Error refreshing contracts:", err);
      dispatch(
        showToast({
          message:
            err instanceof Error
              ? err.message
              : "Unable to update contract list",
          type: "error",
          duration: 3000,
        })
      );
    }
  };

  // Trở về trang chi tiết khách hàng
  const handleBackToClient = () => {
    router.push(`/clients/${clientId}`);
  };

  if (isLoading && contracts.length === 0) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Loading contracts...
          </p>
        </div>
      </div>
    );
  }

  if (error && contracts.length === 0) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <RiInformationLine className="mx-auto text-red-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Error loading data
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleBackToClient}
              variant="secondary"
              icon={RiArrowLeftLine}
            >
              Back
            </Button>
            <Button onClick={() => window.location.reload()} variant="primary">
              Try again
            </Button>
          </div>
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
        {/* Header */}
        <div className="mb-6 overflow-visible">
          <div
            className={`bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 
            rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all duration-700 ease-out
            ${
              animateBackground
                ? "opacity-100 transform-none"
                : "opacity-0 transform -translate-y-4"
            }`}
          >
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>

            {/* Decorative elements */}
            <div className="absolute right-10 bottom-10 w-20 h-20 border-4 border-primary-300/30 rounded-xl rotate-12"></div>
            <div className="absolute left-1/3 top-10 w-6 h-6 bg-primary-300/40 rounded-full"></div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
              <div className="flex items-center">
                {/* Back button */}
                <button
                  onClick={handleBackToClient}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 shadow-lg transform transition-transform hover:scale-105 duration-300"
                >
                  <RiArrowLeftLine className="h-6 w-6 text-white" />
                </button>

                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-md">
                    Client Contracts
                  </h1>
                  <p className="text-primary-100 dark:text-primary-200">
                    {client
                      ? `Manage contracts of client ${client.shortName}`
                      : "Loading client information..."}
                  </p>

                  <div className="flex mt-2 space-x-3">
                    <span className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-white">
                      ID: {clientId}
                    </span>
                    {client && client.clientNumber && (
                      <span className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-white">
                        {client.clientNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <Button
                  onClick={handleAddContract}
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

        {/* Main Content */}
        {contracts.length === 0 && !isLoading ? (
          <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300 h-[750px] flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
            <div className="p-6 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-full mb-6">
              <RiFileTextLine className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No contracts found
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
              There are currently no contracts for this client. You can add a
              new contract.
            </p>
            <div className="mt-8">
              <Button
                variant="primary"
                icon={RiAddLine}
                onClick={handleAddContract}
              >
                Add New Contract
              </Button>
            </div>
          </div>
        ) : (
          <>
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
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <ContractTree
                    contracts={contracts}
                    selectedId={selectedContract?.id || null}
                    onSelect={handleContractSelect}
                  />
                )}
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
                        Choose a contract from the list on the left to view
                        detailed information.
                      </p>
                      <div className="mt-8 flex space-x-4">
                        <button
                          className="px-5 py-2.5 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
                          onClick={handleAddContract}
                        >
                          Create New Contract
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
                        <RiCloseLine className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
                            Select a contract from the list to view details
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

            {/* Pagination */}
            {contracts.length > 0 && totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-2">
                <Button
                  variant="secondary"
                  icon={RiArrowLeftLine}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-gray-600 dark:text-gray-300">
                  Page {currentPage} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  icon={RiArrowRightLine}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {isAddModalOpen && (
        <AddContractModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveContract}
          clientId={clientId}
          clientNumber={client?.clientNumber}
        />
      )}
    </div>
  );
}
