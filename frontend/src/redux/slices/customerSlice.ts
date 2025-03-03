import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Customer, MOCK_CUSTOMERS, FilterCriteria, StatusFilter } from '@/app/customers/mock_customers';

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
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_CUSTOMERS;
    } catch (error) {
      return rejectWithValue('Failed to fetch customers');
    }
  }
);

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
    },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi lọc
      state.filteredCustomers = applyFilters(state);
    },
    setSelectedFilter: (state, action: PayloadAction<FilterCriteria>) => {
      state.selectedFilter = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi lọc
      state.filteredCustomers = applyFilters(state);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Xử lý fetchCustomers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
        state.filteredCustomers = applyFilters(state);
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
export const { setSearchQuery, setStatusFilter, setSelectedFilter, setCurrentPage } = customerSlice.actions;

// Export selectors
export const selectCustomers = (state: { customers: CustomerState }) => state.customers.customers;
export const selectFilteredCustomers = (state: { customers: CustomerState }) => {
  const { filteredCustomers, currentPage, itemsPerPage } = state.customers;
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
};
export const selectPagination = (state: { customers: CustomerState }) => {
  const { currentPage, filteredCustomers, itemsPerPage } = state.customers;
  return {
    currentPage,
    totalPages: Math.ceil(filteredCustomers.length / itemsPerPage),
    totalItems: filteredCustomers.length,
    itemsPerPage
  };
};
export const selectFilters = (state: { customers: CustomerState }) => {
  const { searchQuery, statusFilter, selectedFilter } = state.customers;
  return { searchQuery, statusFilter, selectedFilter };
};
export const selectLoading = (state: { customers: CustomerState }) => state.customers.isLoading;
export const selectError = (state: { customers: CustomerState }) => state.customers.error;

// Export reducer
export default customerSlice.reducer;