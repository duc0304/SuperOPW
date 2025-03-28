import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import axios from 'axios';

// Định nghĩa các type
export type StatusFilter = 'all' | 'active' | 'inactive';
export type FilterCriteria = 'Most Contracts' | 'Latest Clients' | 'Oldest Clients' | null;

// Định nghĩa interface Client
export interface Client {
  ID: string;
  companyName: string;
  shortName: string;
  clientNumber: string;
  cityzenship: string;
  dateOpen: string | null;
  status: 'active' | 'inactive';
  contractsCount?: number;
  clientTypeCode?: string;
  reasonCode?: string;
  reason?: string;
  institutionCode?: string;
  branch?: string;
  clientCategory?: string;
  productCategory?: string;
}

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
  totalItems: number;
  totalPages: number;
  isInitialized: boolean;
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
  itemsPerPage: 10, // Giá trị mặc định
  totalItems: 0,
  totalPages: 1,
  isInitialized: false,
};

// Async thunk để fetch clients từ API /api/oracle/clients
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (page: number, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { searchQuery, statusFilter, itemsPerPage } = state.clients;

    try {
      // Tạo URL với query parameters
      let url = `http://localhost:5000/api/oracle/clients?page=${page}&itemsPerPage=${itemsPerPage}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }

      const response = await axios.get(url);

      let clientsData = response.data.data.clients || [];

      // Chuyển đổi ID thành string
      clientsData = clientsData.map((client: any) => ({
        ...client,
        ID: client.ID != null ? client.ID.toString() : "",
      }));

      return {
        page,
        clients: clientsData,
        totalItems: response.data.data.totalItems || 0,
        totalPages: response.data.data.totalPages || 1,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error';
      return rejectWithValue(errorMessage);
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
    },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi lọc
    },
    setSelectedFilter: (state, action: PayloadAction<FilterCriteria>) => {
      state.selectedFilter = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi lọc
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset về trang đầu khi thay đổi itemsPerPage
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Xử lý fetchClients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload.clients;
        state.filteredClients = action.payload.clients;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
        state.isInitialized = true;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setSearchQuery,
  setStatusFilter,
  setSelectedFilter,
  setCurrentPage,
  setItemsPerPage,
  setInitialized,
} = clientSlice.actions;

// Export selectors
export const selectClients = (state: { clients: ClientState }) =>
  state.clients.clients;

export const selectFilteredClients = (state: { clients: ClientState }) =>
  state.clients.filteredClients;

export const selectPagination = (state: { clients: ClientState }) => {
  const { currentPage, totalItems, totalPages, itemsPerPage } = state.clients;
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };
};

export const selectFilters = (state: { clients: ClientState }) => {
  const { searchQuery, statusFilter, selectedFilter } = state.clients;
  return { searchQuery, statusFilter, selectedFilter };
};

export const selectLoading = (state: { clients: ClientState }) =>
  state.clients.isLoading;

export const selectError = (state: { clients: ClientState }) =>
  state.clients.error;

export const selectIsInitialized = (state: RootState) =>
  state.clients.isInitialized;

// Export reducer
export default clientSlice.reducer;