'use client';

import { useEffect, useState } from 'react';
import CustomerHeader from './components/CustomerHeader';
import CustomerTable from './components/CustomerTable';
import Pagination from './components/Pagination';
import AddCustomerModal from './components/AddCustomerModal';
import EditCustomerModal from './components/EditCustomerModal';
import DeleteCustomerModal from './components/DeleteCustomerModal';
import { Customer, DEFAULT_FORM_DATA } from './mock_customers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchCustomers,
  preloadNextPage,
  addCustomer as addCustomerAction,
  updateCustomer as updateCustomerAction,
  deleteCustomer as deleteCustomerAction,
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  invalidateCache,
  selectFilteredCustomers,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError,
  selectIsPageLoaded,
  selectIsPageLoading,
  selectPageError,
  selectIsInitialized
} from '@/redux/slices/customerSlice';

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  
  // Lấy state từ Redux
  const filteredCustomers = useAppSelector(selectFilteredCustomers);
  const { currentPage, totalPages, totalItems, itemsPerPage } = useAppSelector(selectPagination);
  const { searchQuery, statusFilter } = useAppSelector(selectFilters);
  const isLoading = useAppSelector(selectLoading);
  const globalError = useAppSelector(selectError);
  
  // Thông tin về trang hiện tại
  const isPageLoaded = useAppSelector(state => selectIsPageLoaded(state, currentPage));
  const isPageLoading = useAppSelector(state => selectIsPageLoading(state, currentPage));
  const pageError = useAppSelector(state => selectPageError(state, currentPage));
  const isInitialized = useAppSelector(selectIsInitialized);

  // Local state cho modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>(DEFAULT_FORM_DATA);

  // Fetch customers khi component mount hoặc khi currentPage, searchQuery, statusFilter thay đổi
  useEffect(() => {
    // Chỉ fetch khi trang chưa được tải hoặc khi có thay đổi về filter
    if (!isPageLoaded || !isInitialized) {
      dispatch(fetchCustomers(currentPage));
    }
  }, [dispatch, currentPage, searchQuery, statusFilter, isPageLoaded, isInitialized]);

  // Preload trang tiếp theo khi trang hiện tại đã tải xong
  useEffect(() => {
    if (isPageLoaded && currentPage < totalPages) {
      dispatch(preloadNextPage());
    }
  }, [dispatch, isPageLoaded, currentPage, totalPages]);

  // Thêm useEffect để log thông tin phân trang để debug
  useEffect(() => {
    console.log('Pagination info:', { currentPage, totalPages, totalItems, itemsPerPage });
  }, [currentPage, totalPages, totalItems, itemsPerPage]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleStatusFilterChange = (status: typeof statusFilter) => {
    dispatch(setStatusFilter(status));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Xử lý thử lại khi tải trang thất bại
  const handleRetryLoad = () => {
    dispatch(fetchCustomers(currentPage));
  };

  // Xử lý làm mới cache
  const handleRefreshData = () => {
    dispatch(invalidateCache());
    dispatch(fetchCustomers(currentPage));
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(addCustomerAction(formData));
    if (addCustomerAction.fulfilled.match(resultAction)) {
      setIsAddModalOpen(false);
      setFormData(DEFAULT_FORM_DATA);
    }
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomer) {
      const resultAction = await dispatch(updateCustomerAction({
        id: selectedCustomer.id,
        customerData: formData
      }));
      if (updateCustomerAction.fulfilled.match(resultAction)) {
        setIsEditModalOpen(false);
        setSelectedCustomer(null);
        setFormData(DEFAULT_FORM_DATA);
      }
    }
  };

  const handleDeleteCustomer = async () => {
    if (selectedCustomer) {
      const resultAction = await dispatch(deleteCustomerAction(selectedCustomer.id));
      if (deleteCustomerAction.fulfilled.match(resultAction)) {
        setIsDeleteModalOpen(false);
        setSelectedCustomer(null);
      }
    }
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      companyName: customer.companyName,
      shortName: customer.shortName,
      clientNumber: customer.clientNumber,
      clientTypeCode: customer.clientTypeCode,
      reasonCode: customer.reasonCode,
      reason: customer.reason,
      institutionCode: customer.institutionCode,
      branch: customer.branch,
      clientCategory: customer.clientCategory,
      productCategory: customer.productCategory,
      status: customer.status,
      contractsCount: customer.contractsCount
    });
    setIsEditModalOpen(true);
  };

  // Loading state cho toàn bộ trang khi chưa khởi tạo
  if (isLoading && filteredCustomers.length === 0 && !isInitialized) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Error state cho toàn bộ trang khi chưa khởi tạo
  if (globalError && filteredCustomers.length === 0 && !isInitialized) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center flex-col">
        <div className="text-red-500 dark:text-red-400 mb-4">Error: {globalError}</div>
        <button 
          onClick={handleRetryLoad}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <CustomerHeader
          onAddClick={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />

        {/* Refresh Data Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleRefreshData}
            className="flex items-center text-sm text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Hiển thị lỗi trang cụ thể nếu có */}
        {pageError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading page {currentPage}: {pageError}
                </p>
                <div className="mt-2">
                  <button
                    onClick={handleRetryLoad}
                    className="text-sm font-medium text-red-700 hover:text-red-600 underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 rounded-xl shadow-soft dark:shadow-indigo-900/10 overflow-hidden">
          {isPageLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <CustomerTable
                customers={filteredCustomers}
                onEdit={openEditModal}
                onDelete={(customer) => {
                  setSelectedCustomer(customer);
                  setIsDeleteModalOpen(true);
                }}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No customers found. Try adjusting your search or filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || Math.ceil(totalItems / itemsPerPage)}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />

        {/* Modals */}
        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormData(DEFAULT_FORM_DATA);
          }}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddCustomer}
        />

        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCustomer(null);
            setFormData(DEFAULT_FORM_DATA);
          }}
          customer={selectedCustomer}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditCustomer}
        />

        <DeleteCustomerModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          onConfirm={handleDeleteCustomer}
        />
      </div>
    </div>
  );
}