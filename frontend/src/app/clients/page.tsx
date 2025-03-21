'use client';

import { useEffect, useState } from 'react';
import ClientHeader from './components/ClientHeader';
import ClientTable from './components/ClientTable';
import Pagination from './components/Pagination';
import AddClientModal from './components/AddClientModal';
import EditClientModal from './components/EditClientModal';
import DeleteClientModal from './components/DeleteClientModal';
import Button from '@/components/ui/Button';
import { DEFAULT_FORM_DATA } from './mock_clients';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchClients,
  preloadNextPage,
  addClient as addClientAction,
  updateClient as updateClientAction,
  deleteClient as deleteClientAction,
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  invalidateCache,
  selectFilteredClients,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError,
  selectIsPageLoaded,
  selectIsPageLoading,
  selectPageError,
  selectIsInitialized,
  Client
} from '@/redux/slices/clientSlice';
import { RiRefreshLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

export default function ClientsPage() {
  const dispatch = useAppDispatch();
  
  // Lấy state từ Redux
  const filteredClients = useAppSelector(selectFilteredClients);
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
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Oracle data state
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPageOracle = 10;
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch clients data from Oracle when component mounts
  useEffect(() => {
    fetchOracleClients();
  }, []);

  // Fetch dữ liệu khi component mount và currentPage thay đổi
  useEffect(() => {
    // Chỉ fetch nếu trang chưa được tải
    if (!isPageLoaded) {
      dispatch(fetchClients(currentPage));
    }
  }, [dispatch, currentPage, isPageLoaded]);

  // Preload trang tiếp theo khi cần
  useEffect(() => {
    // Nếu đã tải trang hiện tại và không phải trang cuối
    if (isPageLoaded && currentPage < totalPages) {
      dispatch(preloadNextPage());
    }
  }, [dispatch, currentPage, totalPages, isPageLoaded]);

  // Reset form khi đóng modal
  useEffect(() => {
    if (!isAddModalOpen) {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [isAddModalOpen]);

  // Fetch clients from Oracle
  const fetchOracleClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/oracle/clients');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      let clientsData = data.data || [];
      
      // Đảm bảo mỗi client có ID từ Oracle để sử dụng làm định danh và đường dẫn URL
      clientsData = clientsData.map((client: any) => ({
        ...client,
        ID: client.ID != null ? client.ID.toString() : ""  // Check if ID exists before calling toString()
      }));
      
      // Sort clients by date opened
      const sortedClients = sortClientsByDate(clientsData, sortOrder);
      setClients(sortedClients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sort clients by date opened
  const sortClientsByDate = (clientsToSort: Client[], order: 'asc' | 'desc') => {
    return [...clientsToSort].sort((a, b) => {
      const dateA = a.dateOpen ? new Date(a.dateOpen).getTime() : 0;
      const dateB = b.dateOpen ? new Date(b.dateOpen).getTime() : 0;
      
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setClients(sortClientsByDate(clients, newOrder));
  };

  // Oracle pagination calculations
  const indexOfLastItem = page * itemsPerPageOracle;
  const indexOfFirstItem = indexOfLastItem - itemsPerPageOracle;
  const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPagesOracle = Math.ceil(clients.length / itemsPerPageOracle);

  // Oracle pagination handler
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Handlers for Client components
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleStatusFilterChange = (status: typeof statusFilter) => {
    dispatch(setStatusFilter(status));
  };

  const handleReduxPageChange = (page: number) => {
    if (page !== currentPage) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleRetryLoad = () => {
    // Retry loading current page
    dispatch(fetchClients(currentPage));
  };

  const handleRefreshData = () => {
    // Refresh Oracle data
    fetchOracleClients();
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch action to add client
    await dispatch(addClientAction(formData));
    setIsAddModalOpen(false);
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient) {
      // We only dispatch if we have a selectedClient
      // clientData can be partial since we're sending a PATCH
      await dispatch(updateClientAction({
        id: selectedClient.ID,
        clientData: formData,
      }));
      setIsEditModalOpen(false);
      setSelectedClient(null);
    }
  };

  const handleDeleteClient = async () => {
    if (selectedClient) {
      // We only dispatch if we have a selectedClient
      await dispatch(deleteClientAction(selectedClient.ID));
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    }
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

  // Loading state cho toàn bộ trang khi chưa khởi tạo
  if (loading && clients.length === 0) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <ClientHeader 
          onAddClick={() => setIsAddModalOpen(true)}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          onStatusChange={handleStatusFilterChange}
          statusFilter={statusFilter}
          totalItems={clients.length}
        />

        {/* Main Content */}
        <div className="mt-8 relative">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-700">Error loading data</h3>
                  <div className="mt-2 text-sm text-red-600">{error}</div>
                  <div className="mt-4">
                    <Button 
                      onClick={fetchOracleClients}
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

          {/* Refresh and Sort Buttons */}
          <div className="flex justify-between mb-4">
            <Button 
              onClick={toggleSortOrder}
              variant="secondary"
              className="flex items-center space-x-1 text-sm"
            >
              <span>Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}</span>
            </Button>
            
            <Button 
              onClick={handleRefreshData}
              variant="secondary"
              className="flex items-center space-x-1 text-sm"
            >
              <RiRefreshLine className="h-4 w-4" />
              <span>Refresh Data</span>
            </Button>
          </div>

          {/* Client Table */}
          {loading ? (
            <div className="mt-4 mb-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500 border-opacity-50"></div>
              <p className="text-sm text-gray-500 mt-2">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              No clients found. Please check your connection to the database.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 rounded-xl shadow-soft dark:shadow-indigo-900/10 overflow-hidden">
              <ClientTable 
                clients={currentClients}
                onEdit={openEditModal} 
                onDelete={openDeleteModal}
              />
            </div>
          )}

          {/* Pagination */}
          {clients.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {indexOfLastItem > clients.length ? clients.length : indexOfLastItem}
                </span>{' '}
                of <span className="font-medium">{clients.length}</span> clients
              </div>
              
              <div className="flex justify-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded-md ${
                    page === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                  }`}
                >
                  Prev
                </button>
                
                {/* Page buttons with ellipsis */}
                {(() => {
                  const buttons = [];
                  const totalPages = totalPagesOracle;
                  
                  // Calculate which page numbers to display
                  for (let i = 1; i <= totalPages; i++) {
                    // Always show first page, last page, and pages around current page
                    if (
                      i === 1 ||
                      i === totalPages ||
                      (i >= page - 1 && i <= page + 1)
                    ) {
                      buttons.push(
                        <button
                          key={`page-${i}`}
                          onClick={() => handlePageChange(i)}
                          className={`w-10 h-10 rounded-md ${
                            page === i 
                              ? 'bg-primary-600 text-white dark:bg-primary-700' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    } 
                    // Add ellipsis for gaps
                    else if (
                      (i === 2 && page > 3) ||
                      (i === totalPages - 1 && page < totalPages - 2)
                    ) {
                      buttons.push(
                        <span key={`ellipsis-${i}`} className="px-2 self-end pb-1">
                          ...
                        </span>
                      );
                    }
                  }
                  
                  return buttons;
                })()}
                
                {/* Next button */}
                <button
                  onClick={() => handlePageChange(page < totalPagesOracle ? page + 1 : totalPagesOracle)}
                  disabled={page === totalPagesOracle}
                  className={`px-3 py-1 rounded-md ${
                    page === totalPagesOracle 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddClientModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddClient}
        />

        <EditClientModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          client={selectedClient}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditClient}
        />

        <DeleteClientModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)}
          client={selectedClient}
          onDelete={handleDeleteClient}
        />
      </div>
    </div>
  );
}