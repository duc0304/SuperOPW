import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { ContractNode, mapOracleContractToContractNode, OracleContract } from '@/app/contracts/types';
import axios from 'axios';

// API endpoint
const API_URL = 'http://localhost:5000/api/oracle/contracts';

// Định nghĩa state type cho ContractTree
interface ContractTreeState {
  expandedContracts: Record<string, boolean>;
  animatedRowsMap: Record<string, boolean>;
  currentPage: number;
  visitedPages: Record<number, boolean>;
  isInitialRender: boolean;
  ancestorPath: string[];
  searchQuery: string;
  hoveredRow: string | null;
}

// Định nghĩa state type
interface ContractState {
  contracts: ContractNode[];
  selectedContract: ContractNode | null;
  // selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  // Thêm ContractTree state
  tree: ContractTreeState;
}

// State ban đầu
const initialState: ContractState = {
  contracts: [],
  selectedContract: null,
  // selectedClient: null,
  isLoading: false,
  error: null,
  // Thêm initialState cho ContractTree
  tree: {
    expandedContracts: {},
    animatedRowsMap: {},
    currentPage: 1,
    visitedPages: {},
    isInitialRender: true,
    ancestorPath: [],
    searchQuery: "",
    hoveredRow: null,
  }
};

// Hàm trích xuất dữ liệu từ response
const extractDataFromResponse = (responseData: any): any[] => {
  // Trường hợp 1: responseData đã là mảng
  if (Array.isArray(responseData)) {
    return responseData;
  }
  
  // Trường hợp 2: responseData là object có chứa trường data là mảng
  if (responseData && typeof responseData === 'object' && responseData.data && Array.isArray(responseData.data)) {
    return responseData.data;
  }
  
  // Trường hợp 3: responseData có cấu trúc khác không xác định
  console.error('Cấu trúc dữ liệu không xác định:', responseData);
  throw new Error('Định dạng dữ liệu không đúng. Không thể trích xuất mảng từ response.');
};

// Async thunks
export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      console.log('API response:', response.data);
      
      try {
        // Trích xuất dữ liệu từ response
        const contractsArray = extractDataFromResponse(response.data);
        
        // Chuyển đổi dữ liệu từ API sang ContractNode
        const contractNodes = contractsArray.map((contract: OracleContract) => 
          mapOracleContractToContractNode(contract)
        );
        
        return contractNodes;
      } catch (extractError: any) {
        console.error('Lỗi khi xử lý dữ liệu:', extractError);
        return rejectWithValue(extractError.message || 'Không thể xử lý dữ liệu từ API');
      }
    } catch (error: any) {
      console.error('Lỗi khi fetch contracts:', error);
      return rejectWithValue(error.message || 'Không thể tải danh sách hợp đồng');
    }
  }
);

export const fetchContractsByClient = createAsyncThunk(
  'contracts/fetchContractsByClient', 
  async (clientId: string, { rejectWithValue }) => {
    try {
      // Gọi API với tham số client ID
      const response = await axios.get(`${API_URL}?clientId=${clientId}`);
      console.log('API response (by client):', response.data);
      
      try {
        // Trích xuất dữ liệu từ response
        const contractsArray = extractDataFromResponse(response.data);
        
        // Chuyển đổi dữ liệu từ API sang ContractNode
        const contractNodes = contractsArray.map((contract: OracleContract) => 
          mapOracleContractToContractNode(contract)
        );
        
        return { contracts: contractNodes, clientId };
      } catch (extractError: any) {
        console.error('Lỗi khi xử lý dữ liệu theo client:', extractError);
        return rejectWithValue(extractError.message || 'Không thể xử lý dữ liệu từ API');
      }
    } catch (error: any) {
      console.error('Lỗi khi fetch contracts theo client:', error);
      return rejectWithValue(error.message || 'Không thể tải hợp đồng cho khách hàng này');
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
      // Reset state khi loại bỏ bộ lọc khách hàng
      // Việc fetch lại contracts sẽ được thực hiện riêng
    },
    addContract: (state, action: PayloadAction<ContractNode>) => {
      // Contract data is now simplified, focusing only on the properties defined in ContractNode interface
      // We expect at minimum: id, title, type, and possibly liability.contractNumber
      state.contracts.unshift(action.payload);
    },
    // Thêm các actions cho ContractTree
    toggleExpandContract: (state, action: PayloadAction<string>) => {
      const contractId = action.payload;
      state.tree.expandedContracts[contractId] = !state.tree.expandedContracts[contractId];
    },
    setAnimatedRows: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.tree.animatedRowsMap = action.payload;
    },
    addAnimatedRow: (state, action: PayloadAction<string>) => {
      state.tree.animatedRowsMap[action.payload] = true;
    },
    resetAnimatedRows: (state) => {
      state.tree.animatedRowsMap = {};
      state.tree.isInitialRender = true;
    },
    setTreeCurrentPage: (state, action: PayloadAction<number>) => {
      state.tree.currentPage = action.payload;
    },
    visitPage: (state, action: PayloadAction<number>) => {
      state.tree.visitedPages[action.payload] = true;
      state.tree.isInitialRender = false;
    },
    resetVisitedPages: (state) => {
      state.tree.visitedPages = {};
      state.tree.isInitialRender = true;
    },
    setAncestorPath: (state, action: PayloadAction<string[]>) => {
      state.tree.ancestorPath = action.payload;
      // Mở rộng các contract trong đường dẫn tổ tiên
      action.payload.forEach(id => {
        state.tree.expandedContracts[id] = true;
      });
    },
    setTreeSearchQuery: (state, action: PayloadAction<string>) => {
      state.tree.searchQuery = action.payload;
      // Reset khi search query thay đổi
      state.tree.currentPage = 1;
      state.tree.animatedRowsMap = {};
      state.tree.visitedPages = {};
      state.tree.isInitialRender = true;
    },
    setHoveredRow: (state, action: PayloadAction<string | null>) => {
      state.tree.hoveredRow = action.payload;
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
        // state.selectedClient = action.payload.client;
        state.error = null;
      })
      .addCase(fetchContractsByClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  setSelectedContract, 
  clearClientFilter, 
  addContract,
  // Export các actions cho ContractTree
  toggleExpandContract,
  setAnimatedRows,
  addAnimatedRow,
  resetAnimatedRows,
  setTreeCurrentPage,
  visitPage,
  resetVisitedPages,
  setAncestorPath,
  setTreeSearchQuery,
  setHoveredRow
} = contractSlice.actions;

// Export selectors
export const selectContracts = (state: RootState) => state.contracts.contracts;
export const selectSelectedContract = (state: RootState) => state.contracts.selectedContract;
// export const selectSelectedClient = (state: RootState) => state.contracts.selectedClient;
export const selectIsLoading = (state: RootState) => state.contracts.isLoading;
export const selectError = (state: RootState) => state.contracts.error;

// Export các selectors cho ContractTree
export const selectExpandedContracts = (state: RootState) => state.contracts.tree.expandedContracts;
export const selectAnimatedRowsMap = (state: RootState) => state.contracts.tree.animatedRowsMap;
export const selectTreeCurrentPage = (state: RootState) => state.contracts.tree.currentPage;
export const selectVisitedPages = (state: RootState) => state.contracts.tree.visitedPages;
export const selectIsInitialRender = (state: RootState) => state.contracts.tree.isInitialRender;
export const selectAncestorPath = (state: RootState) => state.contracts.tree.ancestorPath;
export const selectTreeSearchQuery = (state: RootState) => state.contracts.tree.searchQuery;
export const selectHoveredRow = (state: RootState) => state.contracts.tree.hoveredRow;
export const selectTreeState = (state: RootState) => state.contracts.tree;

// Export reducer
export default contractSlice.reducer;