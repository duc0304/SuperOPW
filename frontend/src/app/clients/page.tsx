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
import { RiRefreshLine, RiSortAsc } from 'react-icons/ri';
import toast from 'react-hot-toast';

export default function ClientsPage() {
  const dispatch = useAppDispatch();
  
  const filteredClients = useAppSelector(selectFilteredClients);
  const { currentPage, totalPages, totalItems, itemsPerPage } = useAppSelector(selectPagination);
  const { searchQuery, statusFilter } = useAppSelector(selectFilters);
  const isLoading = useAppSelector(selectLoading);
  const globalError = useAppSelector(selectError);
  
  const isPageLoaded = useAppSelector(state => selectIsPageLoaded(state, currentPage));
  const isPageLoading = useAppSelector(state => selectIsPageLoading(state, currentPage));
  const pageError = useAppSelector(state => selectPageError(state, currentPage));
  const isInitialized = useAppSelector(selectIsInitialized);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPageOracle = 10;
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchOracleClients();
  }, []);

  useEffect(() => {
    if (!isPageLoaded) {
      dispatch(fetchClients(currentPage));
    }
  }, [dispatch, currentPage, isPageLoaded]);

  useEffect(() => {
    if (isPageLoaded && currentPage < totalPages) {
      dispatch(preloadNextPage());
    }
  }, [dispatch, currentPage, totalPages, isPageLoaded]);

  useEffect(() => {
    if (!isAddModalOpen) {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [isAddModalOpen]);

  const fetchOracleClients = async () => {
    setLoading(true);
    if (searchQuery) setIsSearching(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/oracle/clients');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      let clientsData = data.data || [];
      
      clientsData = clientsData.map((client: any) => ({
        ...client,
        ID: client.ID != null ? client.ID.toString() : ""
      }));
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        clientsData = clientsData.filter((client: any) => 
          (client.companyName && client.companyName.toLowerCase().includes(query)) ||
          (client.shortName && client.shortName.toLowerCase().includes(query)) ||
          (client.clientNumber && client.clientNumber.toLowerCase().includes(query))
        );
      }
      
      if (statusFilter !== 'all') {
        clientsData = clientsData.filter((client: any) => 
          client.status === statusFilter
        );
      }
      
      const sortedClients = sortClientsByDate(clientsData, sortOrder);
      setClients(sortedClients);
      
      if (searchQuery) {
        const resultsCount = clientsData.length;
        toast.success(`Found ${resultsCount} result${resultsCount !== 1 ? 's' : ''} for "${searchQuery}"`);
      }
      
      return clientsData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      console.error('Error fetching clients:', err);
      if (searchQuery) {
        toast.error(`Error searching for "${searchQuery}"`);
      }
      throw err;
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const sortClientsByDate = (clientsToSort: Client[], order: 'asc' | 'desc') => {
    return [...clientsToSort].sort((a, b) => {
      const dateA = a.dateOpen ? new Date(a.dateOpen).getTime() : 0;
      const dateB = b.dateOpen ? new Date(b.dateOpen).getTime() : 0;
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const toggleSortOrder = () => {
    setIsSearching(true);
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    fetchOracleClients()
      .then(clientsData => {
        setClients(sortClientsByDate(clientsData, newOrder));
        setIsSearching(false);
        toast.success(`Sorted by date ${newOrder === 'asc' ? 'ascending' : 'descending'}`);
      })
      .catch(() => {
        setIsSearching(false);
        toast.error('Error sorting clients');
      });
  };

  const indexOfLastItem = page * itemsPerPageOracle;
  const indexOfFirstItem = indexOfLastItem - itemsPerPageOracle;
  const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPagesOracle = Math.ceil(clients.length / itemsPerPageOracle);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearchSubmit = (query: string, clientID?: string) => {
    setIsSearching(true);
    dispatch(setSearchQuery(query));
    fetchOracleClients()
      .then(clientsData => {
        setIsSearching(false);
        if (clientID) {
          const selectedClient = clientsData.find((client: Client) => client.ID === clientID);
          if (selectedClient) {
            setClients([selectedClient]);
            toast.success(`Selected client: ${selectedClient.shortName || selectedClient.companyName}`);
            return;
          }
        }
        if (query) {
          toast.success(`Searching for "${query}"`);
        } else {
          toast.success('Cleared search filters');
        }
      })
      .catch(() => {
        setIsSearching(false);
        toast.error('Error searching clients');
      });
  };

  const handleStatusFilterChange = (status: typeof statusFilter) => {
    dispatch(setStatusFilter(status));
    setIsSearching(true);
    fetchOracleClients()
      .then(() => {
        setIsSearching(false);
        toast.success(`Filtered by status: ${status === 'all' ? 'All' : status}`);
      })
      .catch(() => {
        setIsSearching(false);
        toast.error('Error filtering clients');
      });
  };

  const handleReduxPageChange = (page: number) => {
    if (page !== currentPage) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleRetryLoad = () => {
    dispatch(fetchClients(currentPage));
  };

  const handleRefreshData = () => {
    setIsSearching(true);
    fetchOracleClients()
      .then(() => {
        setIsSearching(false);
        if (statusFilter !== 'all') {
          toast.success(`Data refreshed with status filter: ${statusFilter}`);
        } else if (searchQuery) {
          toast.success(`Data refreshed with search: "${searchQuery}"`);
        } else {
          toast.success('All client data refreshed successfully');
        }
      })
      .catch(() => {
        setIsSearching(false);
        toast.error('Error refreshing data');
      });
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addClientAction(formData));
    setIsAddModalOpen(false);
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient) {
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
        <ClientHeader 
          onAddClick={() => setIsAddModalOpen(true)}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          searchQuery={searchQuery}
          onStatusChange={handleStatusFilterChange}
          statusFilter={statusFilter}
          totalItems={clients.length}
          isSearching={isSearching}
          allClients={clients}
          onSortToggle={toggleSortOrder}
          onRefresh={handleRefreshData}
        />

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

          <div className="hidden md:flex justify-between mb-4">
            <Button 
              onClick={toggleSortOrder}
              variant="secondary"
              className="flex items-center space-x-1 text-sm"
            >
              <RiSortAsc className="h-4 w-4" />
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
            <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 rounded-xl shadow-soft dark:shadow-indigo-900/10 overflow-hidden
              md:bg-white md:dark:bg-gray-800/90 
              bg-gray-50 dark:bg-gray-900/90">
              <ClientTable 
                clients={currentClients}
                onEdit={openEditModal} 
                onDelete={openDeleteModal}
              />
            </div>
          )}

          {clients.length > 0 && (
            <>
              <div className="mt-6 hidden md:flex md:justify-between md:items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastItem > clients.length ? clients.length : indexOfLastItem}
                  </span>{' '}
                  of <span className="font-medium">{clients.length}</span> clients
                </div>
                
                <div className="flex justify-center space-x-2">
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
                  {(() => {
                    const buttons = [];
                    const totalPages = totalPagesOracle;
                    for (let i = 1; i <= totalPages; i++) {
                      if (
                        i === 1 ||
                        i === totalPages ||
                        (i >= page - 1 && i <= page + 1)
                      ) {
                        buttons.push(
                          <button
                            key={`page-${i}`}
                            onClick={() => handlePageChange(i)}
                            className={`w-8 h-8 rounded-md ${
                              page === i 
                                ? 'bg-primary-600 text-white dark:bg-primary-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      } else if (
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

              <div className="mt-4 flex flex-col md:hidden">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
                  Showing {indexOfFirstItem + 1} to {indexOfLastItem > clients.length ? clients.length : indexOfLastItem} of {clients.length} clients
                </div>
                <div className="flex justify-center items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                    disabled={page === 1}
                    className={`min-w-[50px] px-2 py-1 rounded text-xs font-medium ${
                      page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                    }`}
                  >
                    Prev
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {(() => {
                      const mobileButtons = [];
                      const totalPages = totalPagesOracle;
                      
                      // Luôn hiển thị trang đầu
                      if (totalPages > 0) {
                        mobileButtons.push(
                          <button
                            key="mobile-page-1"
                            onClick={() => handlePageChange(1)}
                            className={`w-8 h-8 rounded-md text-xs font-medium ${
                              page === 1 
                                ? 'bg-primary-600 text-white dark:bg-primary-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            1
                          </button>
                        );
                      }
                      
                      // Hiển thị dấu "..." nếu trang hiện tại > 2
                      if (page > 2) {
                        mobileButtons.push(
                          <span key="ellipsis-start" className="text-gray-400 mx-0.5">...</span>
                        );
                      }
                      
                      // Hiển thị trang hiện tại (nếu không phải trang đầu và trang cuối)
                      if (page > 1 && page < totalPages) {
                        mobileButtons.push(
                          <button
                            key={`mobile-page-${page}`}
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 rounded-md text-xs font-medium bg-primary-600 text-white dark:bg-primary-700"
                          >
                            {page}
                          </button>
                        );
                      }
                      
                      // Hiển thị dấu "..." nếu trang hiện tại < trang cuối - 1
                      if (page < totalPages - 1 && totalPages > 2) {
                        mobileButtons.push(
                          <span key="ellipsis-end" className="text-gray-400 mx-0.5">...</span>
                        );
                      }
                      
                      // Luôn hiển thị trang cuối (nếu có hơn 1 trang)
                      if (totalPages > 1) {
                        mobileButtons.push(
                          <button
                            key={`mobile-page-${totalPages}`}
                            onClick={() => handlePageChange(totalPages)}
                            className={`w-8 h-8 rounded-md text-xs font-medium ${
                              page === totalPages 
                                ? 'bg-primary-600 text-white dark:bg-primary-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
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
                    onClick={() => handlePageChange(page < totalPagesOracle ? page + 1 : totalPagesOracle)}
                    disabled={page === totalPagesOracle}
                    className={`min-w-[50px] px-2 py-1 rounded text-xs font-medium ${
                      page === totalPagesOracle 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Mobile navigation spacing */}
        <div className="h-16 md:hidden"></div>

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