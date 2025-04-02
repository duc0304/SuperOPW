import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { selectToast, clearToast } from "@/redux/slices/toastSlice";
import {
  RiCheckLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiAlertLine,
  RiCloseLine,
} from "react-icons/ri";

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toastState = useSelector(selectToast);

  useEffect(() => {
    if (toastState) {
      const { message, type, duration = 5000 } = toastState;

      // Hiển thị toast dựa trên type
      switch (type) {
        case "success":
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-gradient-to-r from-green-600 to-green-700 shadow-lg rounded-lg pointer-events-auto flex overflow-hidden`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <RiCheckLine className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-base font-medium text-white">
                        Success
                      </p>
                      <p className="mt-1 text-sm text-white/90">{message}</p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-white/20">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full flex items-center justify-center p-4 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ),
            { duration }
          );
          break;
        case "error":
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-gradient-to-r from-red-600 to-red-700 shadow-lg rounded-lg pointer-events-auto flex overflow-hidden`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <RiErrorWarningLine className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-base font-medium text-white">Error</p>
                      <p className="mt-1 text-sm text-white/90">{message}</p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-white/20">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full flex items-center justify-center p-4 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ),
            { duration }
          );
          break;
        case "info":
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg rounded-lg pointer-events-auto flex overflow-hidden`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <RiInformationLine className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-base font-medium text-white">
                        Notification
                      </p>
                      <p className="mt-1 text-sm text-white/90">{message}</p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-white/20">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full flex items-center justify-center p-4 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ),
            { duration }
          );
          break;
        case "warning":
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg rounded-lg pointer-events-auto flex overflow-hidden`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <RiAlertLine className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-base font-medium text-white">
                        Warning
                      </p>
                      <p className="mt-1 text-sm text-white/90">{message}</p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-white/20">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full flex items-center justify-center p-4 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ),
            { duration }
          );
          break;
      }

      // Xóa toast trong Redux sau khi hiển thị
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [toastState, dispatch]);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 5000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      }}
    />
  );
};

export default ToastContainer;
