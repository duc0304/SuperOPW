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
  addCustomer as addCustomerAction,
  updateCustomer as updateCustomerAction,
  deleteCustomer as deleteCustomerAction,
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  selectFilteredCustomers,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError
} from '@/redux/slices/customerSlice';

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  
  // Lấy state từ Redux
  const filteredCustomers = useAppSelector(selectFilteredCustomers);
  const { currentPage, totalPages, totalItems, itemsPerPage } = useAppSelector(selectPagination);
  const { searchQuery, statusFilter } = useAppSelector(selectFilters);
  const isLoading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  // Local state cho modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>(DEFAULT_FORM_DATA);

  // Fetch customers khi component mount
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

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

  // Loading state
  if (isLoading && filteredCustomers.length === 0) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Error state
  if (error && filteredCustomers.length === 0) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="text-red-500 dark:text-red-400">Error: {error}</div>
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

        {/* Table */}
        <CustomerTable
          customers={filteredCustomers}
          onEdit={openEditModal}
          onDelete={(customer) => {
            setSelectedCustomer(customer);
            setIsDeleteModalOpen(true);
          }}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
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