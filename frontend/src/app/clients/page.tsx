"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import ClientHeader from "./components/ClientHeader";
import ClientTable from "./components/ClientTable";
import Pagination from "./components/Pagination";
import ToastContainer from "@/components/ToastContainer";
const AddClientModal = lazy(() => import("./components/AddClientModal"));
const EditClientModal = lazy(() => import("./components/EditClientModal"));
const DeleteClientModal = lazy(() => import("./components/DeleteClientModal"));

import Button from "@/components/ui/Button";

import { DEFAULT_FORM_DATA } from "./mock_clients";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchClients,
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  selectFilteredClients,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError,
  selectIsInitialized,
  setItemsPerPage,
  Client,
} from "@/redux/slices/clientSlice";
import { RiRefreshLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { showToast } from "@/redux/slices/toastSlice"; // Import showToast


const LoadingFallback = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
    <p className="ml-3 text-sm text-gray-500">Loading...</p>
  </div>
);

export default function ClientsPage() {
  const dispatch = useAppDispatch();

  const filteredClients = useAppSelector(selectFilteredClients);
  const { currentPage, totalPages, totalItems, itemsPerPage } =
    useAppSelector(selectPagination);
  const { searchQuery, statusFilter } = useAppSelector(selectFilters);
  const isLoading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const isInitialized = useAppSelector(selectIsInitialized);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchClients(currentPage));
    }
  }, [dispatch, currentPage, isInitialized]);

  useEffect(() => {
    if (!isAddModalOpen) {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [isAddModalOpen]);

  const handlePageChange = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
    dispatch(fetchClients(pageNumber));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearchSubmit = (query: string) => {
    setIsSearching(true);
    dispatch(fetchClients(currentPage))
      .then(() => {
        setIsSearching(false);
        if (query) {
          dispatch(
            showToast({
              message: `Searching for "${query}"`,
              type: "success",
              duration: 1000,
            })
          );
        } else {
          dispatch(
            showToast({
              message: "Cleared search filters",
              type: "success",
              duration: 1000,
            })
          );
        }
      })
      .catch(() => {
        setIsSearching(false);
        dispatch(
          showToast({
            message: "Error searching clients",
            type: "error",
            duration: 1000,
          })
        );
      });
  };

  const handleStatusFilterChange = (status: typeof statusFilter) => {
    dispatch(setStatusFilter(status));
    setIsSearching(true);
    dispatch(fetchClients(currentPage))
      .then(() => {
        setIsSearching(false);
        toast.success(
          `Filtered by status: ${status === "all" ? "All" : status}`
        );
      })
      .catch(() => {
        setIsSearching(false);
        toast.error("Error filtering clients");
      });
  };

  const handleRefreshData = () => {
    setIsSearching(true);
    dispatch(fetchClients(currentPage))
      .then(() => {
        setIsSearching(false);
        if (statusFilter !== "all") {
          dispatch(
            showToast({
              message: `Data refreshed with status filter: ${statusFilter}`,
              type: "success",
              duration: 1000,
            })
          );
        } else if (searchQuery) {
          dispatch(
            showToast({
              message: `Data refreshed with search: "${searchQuery}"`,
              type: "success",
              duration: 1000,
            })
          );
        } else {
          dispatch(
            showToast({
              message: "All client data refreshed successfully",
              type: "success",
              duration: 1000,
            })
          );
        }
      })
      .catch(() => {
        setIsSearching(false);
        dispatch(
          showToast({
            message: "Error refreshing data",
            type: "error",
            duration: 1000,
          })
        );
      });
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: This needs a proper API call to add a client
    setIsAddModalOpen(false);
    handleRefreshData();
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: This needs a proper API call to update a client
    setIsEditModalOpen(false);
    setSelectedClient(null);
    handleRefreshData();
  };

  const handleDeleteClient = async () => {
    // Note: This needs a proper API call to delete a client
    setIsDeleteModalOpen(false);
    setSelectedClient(null);
    handleRefreshData();
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      ...client,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  if (isLoading && filteredClients.length === 0) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 min-h-screen">
      <ToastContainer/>
      <div className="container mx-auto max-w-7xl">
        <ClientHeader
          onAddClick={() => setIsAddModalOpen(true)}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          searchQuery={searchQuery}
          onStatusChange={handleStatusFilterChange}
          statusFilter={statusFilter}
          totalItems={totalItems}
          isSearching={isSearching}
          allClients={filteredClients}
          onRefresh={handleRefreshData}
        />

        <div className="mt-8 relative">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-700">
                    Error loading data
                  </h3>
                  <div className="mt-2 text-sm text-red-600">{error}</div>
                  <div className="mt-4">
                    <Button
                      onClick={() => dispatch(fetchClients(currentPage))}
                      variant="secondary"
                      className="bg-white hover:bg-gray-50 text-red-700 border border-red-200"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* // Row per page */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage" className="text-xm font-medium text-gray-600 dark:text-gray-300">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  const newItemsPerPage = parseInt(e.target.value);
                  dispatch(setItemsPerPage(newItemsPerPage));
                  dispatch(fetchClients(1)); // Gọi lại API với trang 1
                }}
                className="border border-indigo-200/80 dark:border-indigo-700/30 rounded-md px-2 py-2 text-xm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800/50 shadow-xs hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 focus:outline-none focus:ring-1 focus:ring-primary-400 transition-all duration-150 max-w-[80px]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="hidden md:flex">
              <Button
                onClick={handleRefreshData}
                variant="secondary"
                className="flex items-center space-x-1 text-sm"
              >
                <RiRefreshLine className="h-4 w-4" />
                <span>Refresh Data</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-4 mb-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500 border-opacity-50"></div>
              <p className="text-sm text-gray-500 mt-2">Loading clients...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              No clients found. Please check your connection to the database.
            </div>
          ) : (
            <div
              className="bg-white dark:bg-gray-800/90 
              md:bg-white md:dark:bg-gray-800/90
              rounded-xl shadow-soft dark:shadow-indigo-900/10 
              overflow-hidden dark:border dark:border-indigo-900/30"
            >
              <ClientTable
                clients={filteredClients}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            </div>
          )}

          {filteredClients.length > 0 && (
            <>
              <div className="mt-6 hidden md:flex md:justify-between md:items-center">
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  <div>
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span> clients
                  </div>
                  
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() =>
                      handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
                    }`}
                  >
                    Prev
                  </button>
                  {(() => {
                    const buttons = [];
                    for (let i = 1; i <= totalPages; i++) {
                      if (
                        i === 1 ||
                        i === totalPages ||
                        (i >= currentPage - 1 && i <= currentPage + 1)
                      ) {
                        buttons.push(
                          <button
                            key={`page-${i}`}
                            onClick={() => handlePageChange(i)}
                            className={`w-8 h-8 rounded-md ${
                              currentPage === i
                                ? "bg-primary-600 text-white dark:bg-primary-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {i}
                          </button>
                        );
                      } else if (
                        (i === 2 && currentPage > 3) ||
                        (i === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        buttons.push(
                          <span
                            key={`ellipsis-${i}`}
                            className="px-2 self-end pb-1"
                          >
                            ...
                          </span>
                        );
                      }
                    }
                    return buttons;
                  })()}
                  <button
                    onClick={() =>
                      handlePageChange(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-col md:hidden">
                <div className="flex flex-col items-center space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <div>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems} clients
                  </div>
                </div>
                <div className="flex justify-center items-center gap-1.5">
                  <button
                    onClick={() =>
                      handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className={`min-w-[50px] px-2 py-1 rounded text-xs font-medium ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
                    }`}
                  >
                    Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const mobileButtons = [];
                      if (totalPages > 0) {
                        mobileButtons.push(
                          <button
                            key="mobile-page-1"
                            onClick={() => handlePageChange(1)}
                            className={`w-8 h-8 rounded-md text-xs font-medium ${
                              currentPage === 1
                                ? "bg-primary-600 text-white dark:bg-primary-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            1
                          </button>
                        );
                      }
                      if (currentPage > 2) {
                        mobileButtons.push(
                          <span
                            key="ellipsis-start"
                            className="text-gray-400 mx-0.5"
                          >
                            ...
                          </span>
                        );
                      }
                      if (currentPage > 1 && currentPage < totalPages) {
                        mobileButtons.push(
                          <button
                            key={`mobile-page-${currentPage}`}
                            onClick={() => handlePageChange(currentPage)}
                            className="w-8 h-8 rounded-md text-xs font-medium bg-primary-600 text-white dark:bg-primary-700"
                          >
                            {currentPage}
                          </button>
                        );
                      }
                      if (currentPage < totalPages - 1 && totalPages > 2) {
                        mobileButtons.push(
                          <span
                            key="ellipsis-end"
                            className="text-gray-400 mx-0.5"
                          >
                            ...
                          </span>
                        );
                      }
                      if (totalPages > 1) {
                        mobileButtons.push(
                          <button
                            key={`mobile-page-${totalPages}`}
                            onClick={() => handlePageChange(totalPages)}
                            className={`w-8 h-8 rounded-md text-xs font-medium ${
                              currentPage === totalPages
                                ? "bg-primary-600 text-white dark:bg-primary-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {totalPages}
                          </button>
                        );
                      }
                      return mobileButtons;
                    })()}
                  </div>

                  <button
                    onClick={() =>
                      handlePageChange(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                    disabled={currentPage === totalPages}
                    className={`min-w-[50px] px-2 py-1 rounded text-xs font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        

        <div className="h-16 md:hidden"></div>

        {isAddModalOpen && (
          <Suspense fallback={<LoadingFallback />}>
            <AddClientModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddClient}
            />
          </Suspense>
        )}

        {isEditModalOpen && (
          <Suspense fallback={<LoadingFallback />}>
            <EditClientModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              client={selectedClient}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEditClient}
            />
          </Suspense>
        )}

        {isDeleteModalOpen && (
          <Suspense fallback={<LoadingFallback />}>
            <DeleteClientModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              client={selectedClient}
              onDelete={handleDeleteClient}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}