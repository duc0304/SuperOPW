import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { ContractNode, mapOracleContractToContractNode, OracleContract } from '@/app/contracts/types';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/oracle/contracts/full-hierarchy';

interface ContractTreeState {
  expandedContracts: Record<string, boolean>;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  searchQuery: string;
  highlightedAncestors: string[];
}

interface ContractState {
  contracts: ContractNode[];
  selectedContract: ContractNode | null;
  isLoading: boolean;
  error: string | null;
  tree: ContractTreeState;
}

const initialState: ContractState = {
  contracts: [],
  selectedContract: null,
  isLoading: false,
  error: null,
  tree: {
    expandedContracts: {},
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    searchQuery: "",
    highlightedAncestors: [],
  }
};

// Helper function to find ancestors
const findAncestors = (contracts: ContractNode[], targetId: string): string[] => {
  const ancestors: string[] = [];
  const findPath = (nodes: ContractNode[], currentPath: string[]): boolean => {
    for (const node of nodes) {
      const newPath = [...currentPath, node.id];
      if (node.id === targetId) {
        ancestors.push(...currentPath); // Add all except the target itself
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (findPath(node.children, newPath)) {
          return true;
        }
      }
    }
    return false;
  };
  findPath(contracts, []);
  return ancestors;
};

export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async ({ page = 1, searchQuery = '' }: { page?: number; searchQuery?: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { itemsPerPage } = state.contracts.tree;
      
      const response = await axios.get(`${API_URL}?page=${page}&itemsPerPage=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}`);
      console.log('API Response:', response.data); // Debug dữ liệu trả về
      const contractsArray = response.data.data.contracts || [];
      const totalPages = response.data.data.pagination.totalPages || 1;
      const totalItems = response.data.data.pagination.total || 0;
      const contractNodes = contractsArray.map((contract: OracleContract) => mapOracleContractToContractNode(contract));
      console.log('Mapped Contracts:', contractNodes); // Debug dữ liệu sau ánh xạ
      return { contracts: contractNodes, totalPages, totalItems, page };
    } catch (error: any) {
      console.error('Error fetching contracts:', error);
      return rejectWithValue(error.message || 'Không thể tải danh sách hợp đồng');
    }
  }
);

export const fetchContractsByClient = createAsyncThunk(
  'contracts/fetchContractsByClient',
  async ({ clientId, page = 1, searchQuery = '' }: { clientId: string; page?: number; searchQuery?: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { itemsPerPage } = state.contracts.tree;
      
      const response = await axios.get(`${API_URL}/client/${clientId}?page=${page}&itemsPerPage=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}`);
      console.log('API Response (by client):', response.data); // Debug dữ liệu trả về
      const contractsArray = response.data.data.contracts || [];
      const totalPages = response.data.data.totalPages || 1;
      const totalItems = response.data.data.totalItems || 0;
      const contractNodes = contractsArray.map((contract: OracleContract) => mapOracleContractToContractNode(contract));
      console.log('Mapped Contracts (by client):', contractNodes); // Debug dữ liệu sau ánh xạ
      return { contracts: contractNodes, totalPages, totalItems, page };
    } catch (error: any) {
      console.error('Error fetching contracts by client:', error);
      return rejectWithValue(error.message || 'Không thể tải hợp đồng cho khách hàng này');
    }
  }
);

export const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setSelectedContract: (state, action: PayloadAction<ContractNode | null>) => {
      state.selectedContract = action.payload;
      if (action.payload) {
        state.tree.highlightedAncestors = findAncestors(state.contracts, action.payload.id);
      } else {
        state.tree.highlightedAncestors = [];
      }
    },
    clearClientFilter: (state) => {
      state.contracts = [];
      state.tree.currentPage = 1;
      state.tree.searchQuery = '';
    },
    addContract: (state, action: PayloadAction<ContractNode>) => {
      state.contracts.unshift(action.payload);
    },
    toggleExpandContract: (state, action: PayloadAction<string>) => {
      const contractId = action.payload;
      state.tree.expandedContracts[contractId] = !state.tree.expandedContracts[contractId];
    },
    setTreeCurrentPage: (state, action: PayloadAction<number>) => {
      state.tree.currentPage = action.payload;
    },
    setTreeSearchQuery: (state, action: PayloadAction<string>) => {
      state.tree.searchQuery = action.payload;
      state.tree.currentPage = 1;
    },
    setTreeItemsPerPage: (state, action: PayloadAction<number>) => {
      state.tree.itemsPerPage = action.payload;
      state.tree.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload.contracts;
        state.tree.totalPages = action.payload.totalPages;
        state.tree.totalItems = action.payload.totalItems;
        state.tree.currentPage = action.payload.page;
        state.error = null;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContractsByClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContractsByClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload.contracts;
        state.tree.totalPages = action.payload.totalPages;
        state.tree.totalItems = action.payload.totalItems;
        state.tree.currentPage = action.payload.page;
        state.error = null;
      })
      .addCase(fetchContractsByClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedContract,
  clearClientFilter,
  addContract,
  toggleExpandContract,
  setTreeCurrentPage,
  setTreeSearchQuery,
  setTreeItemsPerPage,
} = contractSlice.actions;

export const selectContracts = (state: RootState) => state.contracts.contracts;
export const selectSelectedContract = (state: RootState) => state.contracts.selectedContract;
export const selectIsLoading = (state: RootState) => state.contracts.isLoading;
export const selectError = (state: RootState) => state.contracts.error;
export const selectExpandedContracts = (state: RootState) => state.contracts.tree.expandedContracts;
export const selectTreeCurrentPage = (state: RootState) => state.contracts.tree.currentPage;
export const selectTreeTotalPages = (state: RootState) => state.contracts.tree.totalPages;
export const selectTreeTotalItems = (state: RootState) => state.contracts.tree.totalItems;
export const selectTreeItemsPerPage = (state: RootState) => state.contracts.tree.itemsPerPage;
export const selectTreeSearchQuery = (state: RootState) => state.contracts.tree.searchQuery;
export const selectHighlightedAncestors = (state: RootState) => state.contracts.tree.highlightedAncestors;

export default contractSlice.reducer;