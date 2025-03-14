import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { ContractNode, Customer } from '@/app/contracts/types';
import { MOCK_CONTRACTS, MOCK_CUSTOMERS } from '@/app/contracts/mock_data';

// Định nghĩa state type
interface ContractState {
  contracts: ContractNode[];
  selectedContract: ContractNode | null;
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

// State ban đầu
const initialState: ContractState = {
  contracts: [],
  selectedContract: null,
  selectedCustomer: null,
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
      
      // Trả về dữ liệu mock
      return MOCK_CONTRACTS;
    } catch (error) {
      return rejectWithValue('Failed to fetch contracts');
    }
  }
);

export const fetchContractsByCustomer = createAsyncThunk(
  'contracts/fetchContractsByCustomer',
  async (customerId: string, { rejectWithValue }) => {
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Lọc contracts theo customerId từ dữ liệu mock
      const customerContracts = MOCK_CONTRACTS.filter(
        contract => contract.customer?.id === customerId
      );
      
      // Lấy thông tin khách hàng từ hợp đồng đầu tiên (nếu có)
      const customer = customerContracts.length > 0 ? customerContracts[0].customer : null;
      
      return { contracts: customerContracts, customer };
    } catch (error) {
      return rejectWithValue('Failed to fetch customer contracts');
    }
  }
);

// Tạo slice
const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setSelectedContract: (state, action: PayloadAction<ContractNode | null>) => {
      state.selectedContract = action.payload;
    },
    clearCustomerFilter: (state) => {
      state.selectedCustomer = null;
      // Không xóa contracts, chỉ xóa bộ lọc
    },
    addContract: (state, action: PayloadAction<ContractNode>) => {
      // Thêm hợp đồng mới vào đầu danh sách
      state.contracts = [action.payload, ...state.contracts];
      
      // Tự động chọn hợp đồng mới
      state.selectedContract = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Xử lý fetchContracts
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload;
        // Nếu chưa có contract nào được chọn, chọn contract đầu tiên
        if (!state.selectedContract && action.payload.length > 0) {
          state.selectedContract = action.payload[0];
        }
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Xử lý fetchContractsByCustomer
    builder
      .addCase(fetchContractsByCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContractsByCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload.contracts;
        state.selectedCustomer = action.payload.customer || null;
        
        // Nếu chưa có contract nào được chọn, chọn contract đầu tiên
        if (!state.selectedContract && action.payload.contracts.length > 0) {
          state.selectedContract = action.payload.contracts[0];
        }
      })
      .addCase(fetchContractsByCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setSelectedContract, clearCustomerFilter, addContract } = contractSlice.actions;

// Export selectors
export const selectContracts = (state: RootState) => state.contracts.contracts;
export const selectSelectedContract = (state: RootState) => state.contracts.selectedContract;
export const selectSelectedCustomer = (state: RootState) => state.contracts.selectedCustomer;
export const selectIsLoading = (state: RootState) => state.contracts.isLoading;
export const selectError = (state: RootState) => state.contracts.error;

// Export reducer
export default contractSlice.reducer;