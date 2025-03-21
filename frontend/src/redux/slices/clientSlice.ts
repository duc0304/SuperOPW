import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { clientService, Client } from '@/services/api';
import axios from 'axios';

// Định nghĩa các type ở đây thay vì import từ mock_clients
export type StatusFilter = 'all' | 'active' | 'inactive';
export type FilterCriteria = 'Most Contracts' | 'Latest Clients' | 'Oldest Clients' | null;

// Re-export Client interface từ api
export type { Client };

// Định nghĩa state type
interface ClientState {
  clients: Client[];
  filteredClients: Client[];
  currentPage: number;
  searchQuery: string;
  statusFilter: StatusFilter;
  selectedFilter: FilterCriteria;
  isLoading: boolean;
  error: string | null;
  itemsPerPage: number;
  
  // Cải tiến lazy loading
  loadedPages: Record<number, {
    isLoaded: boolean;
    isLoading: boolean;
    error: string | null;
    timestamp: number; // Thời điểm tải dữ liệu
  }>;
  isInitialized: boolean;
  pageData: Record<number, Client[]>; // Lưu trữ dữ liệu theo trang
}

// State ban đầu
const initialState: ClientState = {
  clients: [],
  filteredClients: [],
  currentPage: 1,
  searchQuery: '',
  statusFilter: 'all',
  selectedFilter: null,
  isLoading: false,
  error: null,
  itemsPerPage: 10,
  
  // Cải tiến lazy loading
  loadedPages: {},
  isInitialized: false,
  pageData: {},
};

// Thời gian cache hết hạn (1 phút = 60000ms)
const CACHE_EXPIRATION_TIME = 60000;

// Async thunks
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (page: number | undefined, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const { currentPage, searchQuery, statusFilter, itemsPerPage } = state.clients;
    
    // Xác định trang cần tải (trang hiện tại hoặc trang được chỉ định)
    const targetPage = page !== undefined ? page : currentPage;
    
    // Kiểm tra xem trang này đã được tải chưa và cache còn hạn không
    const pageInfo = state.clients.loadedPages[targetPage];
    const now = Date.now();
    const isCacheValid = pageInfo && 
                         pageInfo.isLoaded && 
                         (now - pageInfo.timestamp < CACHE_EXPIRATION_TIME);
    
    // Nếu trang đã được tải, cache còn hạn và không có lỗi, không cần tải lại
    if (isCacheValid && !pageInfo.error) {
      return { page: targetPage, skipUpdate: true };
    }
    
    try {
      // Đánh dấu trang đang tải
      dispatch(setPageLoading({ page: targetPage, isLoading: true }));
      
      // Gọi API từ backend
      const response = await clientService.getAllClients();
      
      // Kiểm tra nếu response có dữ liệu
      if (!response.data.data) {
        throw new Error('No data received from API');
      }
      
      let apiClients = response.data.data as Client[];
      
      // Lọc dữ liệu theo searchQuery và statusFilter
      let filteredData = [...apiClients];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter((client: Client) => 
          client.companyName.toLowerCase().includes(query) ||
          client.shortName.toLowerCase().includes(query) ||
          client.clientNumber.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter !== 'all') {
        filteredData = filteredData.filter((client: Client) => 
          client.status === statusFilter
        );
      }
      
      // Tính toán tổng số trang và phân trang
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      
      // Lấy dữ liệu cho trang hiện tại
      const startIndex = (targetPage - 1) * itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
      
      // Đánh dấu trang đã được tải
      dispatch(setPageLoaded({ 
        page: targetPage, 
        isLoaded: true,
        error: null
      }));
      
      // Đánh dấu ứng dụng đã được khởi tạo
      dispatch(setInitialized());
      
      // Trả về dữ liệu đã được xử lý
      return {
        page: targetPage,
        clients: paginatedData,
        allClients: apiClients,
        totalItems,
        totalPages,
        skipUpdate: false
      };
    } catch (error: any) {
      // Xử lý lỗi
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      // Đánh dấu trang lỗi
      dispatch(setPageError({ 
        page: targetPage, 
        error: errorMessage 
      }));
      
      return rejectWithValue({ 
        page: targetPage, 
        error: errorMessage 
      });
    }
  }
);

// Thunk để preload trang tiếp theo
export const preloadNextPage = createAsyncThunk(
  'clients/preloadNextPage',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { currentPage, filteredClients, itemsPerPage } = state.clients;
    
    // Tính toán tổng số trang
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    
    // Nếu không phải trang cuối, preload trang tiếp theo
    if (currentPage < totalPages) {
      dispatch(fetchClients(currentPage + 1));
    }
    
    return null;
  }
);

// Thêm client mới
export const addClient = createAsyncThunk(
  'clients/addClient',
  async (clientData: Omit<Client, "ID">, { dispatch, rejectWithValue }) => {
    try {
      // Gọi API để thêm client
      const response = await clientService.createClient(clientData);
      
      // Trả về client mới từ API
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, clientData }: { id: string; clientData: Partial<Omit<Client, 'id'>> }, { rejectWithValue }) => {
    try {
      // Gọi API để cập nhật client
      const apiClientData = {
        companyName: clientData.companyName,
        shortName: clientData.shortName,
        clientNumber: clientData.clientNumber,
        cityzenship: clientData.cityzenship || '',
        dateOpen: clientData.dateOpen || '',
        status: clientData.status
      };
      
      const response = await clientService.updateClient(id, apiClientData);
      const updatedClient = response.data.data;
      
      return { id, clientData: updatedClient };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update client');
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: string, { rejectWithValue }) => {
    try {
      // Gọi API để xóa client
      await clientService.deleteClient(id);
      
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete client');
    }
  }
);

// Tạo slice
const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi tìm kiếm
      state.filteredClients = applyFilters(state);
      
      // Reset trạng thái tải trang khi thay đổi bộ lọc
      state.loadedPages = {};
      state.pageData = {};
    },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi lọc
      state.filteredClients = applyFilters(state);
      
      // Reset trạng thái tải trang khi thay đổi bộ lọc
      state.loadedPages = {};
      state.pageData = {};
    },
    setSelectedFilter: (state, action: PayloadAction<FilterCriteria>) => {
      state.selectedFilter = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi lọc
      state.filteredClients = applyFilters(state);
      
      // Reset trạng thái tải trang khi thay đổi bộ lọc
      state.loadedPages = {};
      state.pageData = {};
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<{ page: number; isLoading: boolean }>) => {
      const { page, isLoading } = action.payload;
      if (!state.loadedPages[page]) {
        state.loadedPages[page] = {
          isLoaded: false,
          isLoading,
          error: null,
          timestamp: Date.now()
        };
      } else {
        state.loadedPages[page].isLoading = isLoading;
      }
    },
    setPageLoaded: (state, action: PayloadAction<{ 
      page: number; 
      isLoaded: boolean; 
      error: string | null;
    }>) => {
      const { page, isLoaded, error } = action.payload;
      state.loadedPages[page] = {
        isLoaded,
        isLoading: false,
        error,
        timestamp: Date.now()
      };
    },
    setPageError: (state, action: PayloadAction<{ 
      page: number; 
      error: string;
    }>) => {
      const { page, error } = action.payload;
      if (!state.loadedPages[page]) {
        state.loadedPages[page] = {
          isLoaded: false,
          isLoading: false,
          error,
          timestamp: Date.now()
        };
      } else {
        state.loadedPages[page].isLoading = false;
        state.loadedPages[page].error = error;
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    invalidateCache: (state) => {
      // Reset tất cả cache
      state.loadedPages = {};
      state.pageData = {};
    },
  },
  extraReducers: (builder) => {
    // Xử lý fetchClients
    builder
      .addCase(fetchClients.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Nếu skipUpdate là true, không cập nhật state
        if (action.payload && !action.payload.skipUpdate) {
          // Type assertion để tránh lỗi TypeScript
          const payload = action.payload as unknown as {
            page: number;
            clients: Client[];
            allClients?: Client[];
            totalItems: number;
            totalPages: number;
            skipUpdate: boolean;
          };
          
          // Lưu tất cả clients từ API nếu có
          if (payload.allClients) {
            state.clients = payload.allClients;
          }
          
          // Lưu dữ liệu trang vào pageData
          if (payload.page && payload.clients) {
            state.pageData[payload.page] = payload.clients;
          }
          
          // Cập nhật filteredClients nếu đây là trang hiện tại
          if (payload.page === state.currentPage) {
            state.filteredClients = payload.clients || [];
          }
          
          // Đảm bảo cập nhật totalItems và totalPages từ payload
          if (payload.totalItems !== undefined) {
            // Nếu không có allClients, tạo mảng có độ dài totalItems
            if (!payload.allClients) {
              state.filteredClients = Array(payload.totalItems).fill(null);
            }
          }
          
          // Ghi log để debug
          console.log('Updated state after fetch:', {
            currentPage: state.currentPage,
            totalItems: payload.totalItems,
            totalPages: payload.totalPages
          });
        }
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        
        // Lấy thông tin lỗi từ payload
        if (action.payload && typeof action.payload === 'object') {
          const { page, error } = action.payload as { page: number; error: string };
          state.error = `Error loading page ${page}: ${error}`;
        } else {
          state.error = action.error.message || 'Unknown error';
        }
      });

    // Xử lý addClient
    builder
      .addCase(addClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients.push(action.payload);
        state.filteredClients = applyFilters(state);
        
        // Invalidate cache khi thêm client mới
        state.loadedPages = {};
        state.pageData = {};
      })
      .addCase(addClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Xử lý updateClient
    builder
      .addCase(updateClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, clientData } = action.payload;
        // Type assertion để tránh lỗi TypeScript
        const updatedClient = clientData as unknown as Client;
        
        // Cập nhật client trong danh sách
        state.clients = state.clients.map(client => 
          client.ID === id ? { ...client, ...updatedClient } : client
        );
        
        // Cập nhật filteredClients
        state.filteredClients = applyFilters(state);
        
        // Invalidate cache
        state.loadedPages = {};
        state.pageData = {};
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Xử lý deleteClient
    builder
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = state.clients.filter(client => client.ID !== action.payload);
        state.filteredClients = applyFilters(state);
        
        // Invalidate cache khi xóa client
        state.loadedPages = {};
        state.pageData = {};
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Hàm helper để áp dụng các bộ lọc
function applyFilters(state: ClientState): Client[] {
  let result = [...state.clients];

  // Apply search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    result = result.filter(
      (client: Client) =>
        client.companyName.toLowerCase().includes(query) ||
        client.clientNumber.toLowerCase().includes(query) ||
        client.shortName.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (state.statusFilter !== 'all') {
    result = result.filter((client: Client) => client.status === state.statusFilter);
  }

  // Apply selected filter
  if (state.selectedFilter) {
    switch (state.selectedFilter) {
      case 'Most Contracts':
        result.sort((a: Client, b: Client) => (b.contractsCount || 0) - (a.contractsCount || 0));
        break;
      case 'Latest Clients':
        result.sort((a: Client, b: Client) => parseInt(b.ID) - parseInt(a.ID));
        break;
      case 'Oldest Clients':
        result.sort((a: Client, b: Client) => parseInt(a.ID) - parseInt(b.ID));
        break;
    }
  }

  return result;
}

// Export actions
export const { 
  setSearchQuery, 
  setStatusFilter, 
  setSelectedFilter, 
  setCurrentPage, 
  setPageLoading,
  setPageLoaded,
  setPageError,
  setInitialized,
  invalidateCache
} = clientSlice.actions;

// Export selectors
export const selectClients = (state: { clients: ClientState }) => state.clients.clients;

export const selectFilteredClients = (state: { clients: ClientState }) => {
  const { filteredClients, currentPage, itemsPerPage, pageData } = state.clients;
  
  // Nếu có dữ liệu trang trong pageData, sử dụng nó và lọc ra các phần tử null
  if (pageData[currentPage] && pageData[currentPage].length > 0) {
    return pageData[currentPage].filter(client => client !== null && client !== undefined);
  }
  
  // Nếu không, sử dụng cách tính toán cũ và lọc ra các phần tử null
  const startIndex = (currentPage - 1) * itemsPerPage;
  const result = filteredClients.slice(startIndex, startIndex + itemsPerPage);
  return result.filter(client => client !== null && client !== undefined);
};

export const selectPagination = (state: { clients: ClientState }) => {
  const { currentPage, filteredClients, itemsPerPage } = state.clients;
  const totalItems = filteredClients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage
  };
};

export const selectFilters = (state: { clients: ClientState }) => {
  const { searchQuery, statusFilter, selectedFilter } = state.clients;
  return { searchQuery, statusFilter, selectedFilter };
};

export const selectLoading = (state: { clients: ClientState }) => state.clients.isLoading;

export const selectError = (state: { clients: ClientState }) => state.clients.error;

export const selectPageInfo = (state: RootState, page: number) => 
  state.clients.loadedPages[page] || {
    isLoaded: false,
    isLoading: false,
    error: null,
    timestamp: 0
  };

export const selectIsPageLoaded = (state: RootState, page: number) => {
  const pageInfo = selectPageInfo(state, page);
  const now = Date.now();
  // Kiểm tra xem trang đã được tải và cache còn hạn không
  return pageInfo.isLoaded && (now - pageInfo.timestamp < CACHE_EXPIRATION_TIME);
};

export const selectIsPageLoading = (state: RootState, page: number) => 
  selectPageInfo(state, page).isLoading;

export const selectPageError = (state: RootState, page: number) => 
  selectPageInfo(state, page).error;

export const selectIsInitialized = (state: RootState) => 
  state.clients.isInitialized;

// Export reducer
export default clientSlice.reducer;