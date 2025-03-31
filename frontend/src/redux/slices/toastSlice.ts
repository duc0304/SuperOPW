import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu dữ liệu cho toast
interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // Thời gian hiển thị (ms)
}

interface ToastState {
  toast: Toast | null;
}

const initialState: ToastState = {
  toast: null,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Toast>) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

// Export actions
export const { showToast, clearToast } = toastSlice.actions;

// Export selector để lấy trạng thái toast
export const selectToast = (state: { toast: ToastState }) => state.toast.toast;

// Export reducer
export default toastSlice.reducer;