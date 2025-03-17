import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className={`inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${maxWidth} sm:w-full animate-fadeIn`}
        >
          {/* Clean, basic header */}
          <div className="relative overflow-hidden">
            {/* Simple solid background */}
            <div className="absolute inset-0 bg-primary-600 dark:bg-primary-800"></div>
            
            {/* Header content */}
            <div className="flex items-center justify-between px-6 py-4 relative z-10">
              <div className="flex items-center space-x-3">
                {/* Simple icon */}
                <div className="bg-white/20 p-2 rounded-lg">
                  <div className="w-5 h-5 bg-white rounded-md"></div>
                </div>
                
                {/* Clean title */}
                <h3 className="text-xl font-semibold text-white">{title}</h3>
              </div>
              
              {/* White circur close button */}
              <button
                onClick={onClose}
                className="bg-white p-2 rounded-full text-primary-600 hover:text-primary-800 transition-all duration-200 focus:outline-none hover:shadow-md"
                aria-label="Close"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
            
            {/* Simple separator */}
            <div className="h-0.5 bg-white/20"></div>
          </div>
          
          {/* Clean content area */}
          <div className="px-6 py-5 bg-white dark:bg-gray-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 