import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { ContractNode } from '@/app/contracts/types';
import type { Client } from '@/app/contracts/types';
import { MOCK_CONTRACTS, MOCK_CLIENTS } from '@/app/contracts/mock_data';

// Định nghĩa state type
interface ContractState {
  contracts: ContractNode[];
  selectedContract: ContractNode | null;
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
}

// State ban đầu
const initialState: ContractState = {
  contracts: [],
  selectedContract: null,
  selectedClient: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (_, { rejectWithValue }) => {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_CONTRACTS;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contracts');
    }
  }
);

export const fetchContractsByClient = createAsyncThunk(
  'contracts/fetchContractsByClient', 
  async (clientId: string, { rejectWithValue }) => {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Tìm client dựa vào id
      const client = MOCK_CLIENTS.find(c => c.id === clientId);
      
      if (!client) {
        return rejectWithValue('Client not found');
      }
      
      // Lọc các contract thuộc về client
      const filteredContracts = MOCK_CONTRACTS.filter(
        contract => contract.client?.id === clientId || 
                   (contract.children && 
                    contract.children.some(sub => sub.client?.id === clientId))
      );
      
      return { contracts: filteredContracts, client };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contracts for client');
    }
  }
);

// Tạo slice
export const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setSelectedContract: (state, action: PayloadAction<ContractNode>) => {
      state.selectedContract = action.payload;
    },
    clearClientFilter: (state) => {
      state.selectedClient = null;
    },
    addContract: (state, action: PayloadAction<ContractNode>) => {
      state.contracts.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all contracts
      .addCase(fetchContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload;
        state.error = null;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch contracts by client
      .addCase(fetchContractsByClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContractsByClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload.contracts;
        state.selectedClient = action.payload.client;
        state.error = null;
      })
      .addCase(fetchContractsByClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setSelectedContract, clearClientFilter, addContract } = contractSlice.actions;

// Export selectors
export const selectContracts = (state: RootState) => state.contracts.contracts;
export const selectSelectedContract = (state: RootState) => state.contracts.selectedContract;
export const selectSelectedClient = (state: RootState) => state.contracts.selectedClient;
export const selectIsLoading = (state: RootState) => state.contracts.isLoading;
export const selectError = (state: RootState) => state.contracts.error;

// Export reducer
export default contractSlice.reducer;