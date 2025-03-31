import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { selectToast, clearToast } from '@/redux/slices/toastSlice';

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toastState = useSelector(selectToast);

  useEffect(() => {
    if (toastState) {
      const { message, type, duration = 5000 } = toastState;

      // Hiển thị toast dựa trên type
      switch (type) {
        case 'success':
          toast.success(message, {
            duration,
            position: 'top-center',
            style: {
              background: '#10B981',
              color: '#fff',
              fontSize: '16px',
              padding: '16px',
            },
          });
          break;
        case 'error':
          toast.error(message, {
            duration,
            position: 'top-center',
            style: {
              background: '#EF4444',
              color: '#fff',
              fontSize: '16px',
              padding: '16px',
            },
          });
          break;
        case 'info':
          toast(message, {
            duration,
            position: 'top-center',
            style: {
              background: '#3B82F6',
              color: '#fff',
              fontSize: '16px',
              padding: '16px',
            },
          });
          break;
        case 'warning':
          toast(message, {
            duration,
            position: 'top-center',
            style: {
              background: '#F59E0B',
              color: '#fff',
              fontSize: '16px',
              padding: '16px',
            },
          });
          break;
      }

      // Xóa toast trong Redux sau khi hiển thị
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [toastState, dispatch]);

  return <Toaster />;
};

export default ToastContainer;