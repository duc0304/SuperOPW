import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Customer, MOCK_CUSTOMERS, FilterCriteria, StatusFilter } from '@/app/customers/mock_customers';
import { RootState } from '@/redux/store';

// Định nghĩa state type
interface CustomerState {
  customers: Customer[];
  filteredCustomers: Customer[];
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
  pageData: Record<number, Customer[]>; // Lưu trữ dữ liệu theo trang
}

// State ban đầu
const initialState: CustomerState = {
  customers: [],
  filteredCustomers: [],
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
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (page: number | undefined, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const { currentPage, searchQuery, statusFilter, itemsPerPage } = state.customers;
    
    // Xác định trang cần tải (trang hiện tại hoặc trang được chỉ định)
    const targetPage = page !== undefined ? page : currentPage;
    
    // Kiểm tra xem trang này đã được tải chưa và cache còn hạn không
    const pageInfo = state.customers.loadedPages[targetPage];
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
      
      // Mô phỏng độ trễ của mạng
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Giảm xác suất lỗi xuống 0% (hoặc giá trị thấp hơn như 0.01 nếu muốn test đôi khi)
      if (Math.random() < 0) { // Thay đổi từ 0.1 xuống 0
        throw new Error('Simulated network error');
      }
      
      // Lọc dữ liệu theo searchQuery và statusFilter
      let filteredData = [...MOCK_CUSTOMERS];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(customer => 
          customer.companyName.toLowerCase().includes(query) ||
          customer.shortName.toLowerCase().includes(query) ||
          customer.clientNumber.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter !== 'all') {
        filteredData = filteredData.filter(customer => 
          customer.status === statusFilter
        );
      }
      
      // Tính toán phân trang
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      
      console.log('Debug totalPages calculation:', { totalItems, itemsPerPage, totalPages });
      
      // Lấy dữ liệu cho trang được yêu cầu
      const startIndex = (targetPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      // Đánh dấu trang này đã được tải thành công
      dispatch(setPageLoaded({ 
        page: targetPage, 
        isLoaded: true, 
        timestamp: now,
        error: null
      }));
      
      // Đánh dấu đã khởi tạo nếu đây là lần đầu tải dữ liệu
      if (!state.customers.isInitialized) {
        dispatch(setInitialized());
      }
      
      return {
        page: targetPage,
        customers: paginatedData,
        totalItems,
        totalPages,
        skipUpdate: false
      };
    } catch (error) {
      // Đánh dấu trang này tải thất bại
      dispatch(setPageError({ 
        page: targetPage, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
      
      return rejectWithValue({
        page: targetPage,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Thunk để preload trang tiếp theo
export const preloadNextPage = createAsyncThunk(
  'customers/preloadNextPage',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { currentPage, filteredCustomers, itemsPerPage } = state.customers;
    
    // Tính toán tổng số trang
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    
    // Nếu không phải trang cuối, preload trang tiếp theo
    if (currentPage < totalPages) {
      dispatch(fetchCustomers(currentPage + 1));
    }
    
    return null;
  }
);

// Các thunk khác không thay đổi
export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData: Omit<Customer, 'id'>, { getState, rejectWithValue }) => {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getState() as { customers: CustomerState };
      const newCustomer: Customer = {
        ...customerData,
        id: (state.customers.customers.length + 1).toString(),
      };
      
      return newCustomer;
    } catch (error) {
      return rejectWithValue('Failed to add customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }: { id: string; customerData: Partial<Omit<Customer, 'id'>> }, { rejectWithValue }) => {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { id, customerData };
    } catch (error) {
      return rejectWithValue('Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string, { rejectWithValue }) => {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete customer');
    }
  }
);

// Tạo slice
const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi tìm kiếm
      state.filteredCustomers = applyFilters(state);
      
      // Reset trạng thái tải trang khi thay đổi bộ lọc
      state.loadedPages = {};
      state.pageData = {};
    },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi lọc
      state.filteredCustomers = applyFilters(state);
      
      // Reset trạng thái tải trang khi thay đổi bộ lọc
      state.loadedPages = {};
      state.pageData = {};
    },
    setSelectedFilter: (state, action: PayloadAction<FilterCriteria>) => {
      state.selectedFilter = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi lọc
      state.filteredCustomers = applyFilters(state);
      
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
      timestamp: number;
      error: string | null;
    }>) => {
      const { page, isLoaded, timestamp, error } = action.payload;
      state.loadedPages[page] = {
        isLoaded,
        isLoading: false,
        error,
        timestamp
      };
    },
    setPageError: (state, action: PayloadAction<{ page: number; error: string }>) => {
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
    // Xử lý fetchCustomers
    builder
      .addCase(fetchCustomers.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Nếu skipUpdate là true, không cập nhật state
        if (action.payload && !action.payload.skipUpdate) {
          // Lưu dữ liệu trang vào pageData
          if (action.payload.page && action.payload.customers) {
            state.pageData[action.payload.page] = action.payload.customers;
          }
          
          // Cập nhật customers nếu đây là trang hiện tại
          if (action.payload.page === state.currentPage) {
            state.customers = action.payload.customers || [];
          }
          
          // Đảm bảo cập nhật totalItems và totalPages từ payload
          if (action.payload.totalItems !== undefined) {
            state.filteredCustomers = Array(action.payload.totalItems).fill(null);
          }
          
          // Ghi log để debug
          console.log('Updated state after fetch:', {
            currentPage: state.currentPage,
            totalItems: action.payload.totalItems,
            totalPages: action.payload.totalPages
          });
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        
        // Lấy thông tin lỗi từ payload
        if (action.payload && typeof action.payload === 'object') {
          const { page, error } = action.payload as { page: number; error: string };
          state.error = `Error loading page ${page}: ${error}`;
        } else {
          state.error = action.error.message || 'Unknown error';
        }
      });

    // Xử lý addCustomer
    builder
      .addCase(addCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers.push(action.payload);
        state.filteredCustomers = applyFilters(state);
        
        // Invalidate cache khi thêm customer mới
        state.loadedPages = {};
        state.pageData = {};
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Xử lý updateCustomer
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, customerData } = action.payload;
        state.customers = state.customers.map(customer => 
          customer.id === id ? { ...customer, ...customerData } : customer
        );
        state.filteredCustomers = applyFilters(state);
        
        // Invalidate cache khi cập nhật customer
        state.loadedPages = {};
        state.pageData = {};
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Xử lý deleteCustomer
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
        state.filteredCustomers = applyFilters(state);
        
        // Invalidate cache khi xóa customer
        state.loadedPages = {};
        state.pageData = {};
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Hàm helper để áp dụng các bộ lọc
function applyFilters(state: CustomerState): Customer[] {
  let result = [...state.customers];

  // Apply search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    result = result.filter(
      customer =>
        customer.companyName.toLowerCase().includes(query) ||
        customer.clientNumber.toLowerCase().includes(query) ||
        customer.shortName.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (state.statusFilter !== 'all') {
    result = result.filter(customer => customer.status === state.statusFilter);
  }

  // Apply selected filter
  if (state.selectedFilter) {
    switch (state.selectedFilter) {
      case 'Most Contracts':
        result.sort((a, b) => b.contractsCount - a.contractsCount);
        break;
      case 'Latest Customers':
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'Oldest Customers':
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
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
} = customerSlice.actions;

// Export selectors
export const selectCustomers = (state: { customers: CustomerState }) => state.customers.customers;

export const selectFilteredCustomers = (state: { customers: CustomerState }) => {
  const { filteredCustomers, currentPage, itemsPerPage, pageData } = state.customers;
  
  // Nếu có dữ liệu trang trong pageData, sử dụng nó
  if (pageData[currentPage] && pageData[currentPage].length > 0) {
    return pageData[currentPage];
  }
  
  // Nếu không, sử dụng cách tính toán cũ
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
};

export const selectPagination = (state: { customers: CustomerState }) => {
  const { currentPage, filteredCustomers, itemsPerPage } = state.customers;
  const totalItems = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  console.log('selectPagination called:', { currentPage, totalItems, totalPages, itemsPerPage });
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage
  };
};

export const selectFilters = (state: { customers: CustomerState }) => {
  const { searchQuery, statusFilter, selectedFilter } = state.customers;
  return { searchQuery, statusFilter, selectedFilter };
};

export const selectLoading = (state: { customers: CustomerState }) => state.customers.isLoading;

export const selectError = (state: { customers: CustomerState }) => state.customers.error;

export const selectPageInfo = (state: RootState, page: number) => 
  state.customers.loadedPages[page] || {
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
  state.customers.isInitialized;

// Export reducer
export default customerSlice.reducer;