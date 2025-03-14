'use client';

import { useState, useEffect } from 'react';
import { RiAddLine, RiFilterLine, RiCloseLine, RiFileTextLine } from 'react-icons/ri';
import Button from '@/components/ui/Button';

interface ContractHeaderProps {
  customerName?: string;
  clearCustomerFilter?: () => void;
  onAddContract?: () => void;
}

export default function ContractHeader({ customerName, clearCustomerFilter, onAddContract }: ContractHeaderProps) {
  const [animateBackground, setAnimateBackground] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    setAnimateBackground(true);
  }, []);

  return (
    <div className="mb-6 overflow-visible">
      {/* Enhanced 3D background with gradient from dark to light (left to right) */}
      <div className={`bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 
        rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all duration-700 ease-out
        ${animateBackground ? 'opacity-100 transform-none' : 'opacity-0 transform -translate-y-4'}`}>
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>
        
        {/* Decorative elements */}
        <div className="absolute right-10 bottom-10 w-20 h-20 border-4 border-primary-300/30 rounded-xl rotate-12"></div>
        <div className="absolute left-1/3 top-10 w-6 h-6 bg-primary-300/40 rounded-full"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 shadow-lg transform transition-transform hover:scale-105 duration-300">
              <RiFileTextLine className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-md">
                {customerName ? `${customerName}'s Contracts` : 'Contracts'}
              </h1>
              <p className="text-primary-100 dark:text-primary-200">
                {customerName ? 
                  `Manage contracts for ${customerName}` : 
                  'Manage and track all your contracts in one place'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-3">
            {/* Customer filter badge (if filtering by customer) */}
            {customerName && (
              <div className="flex items-center">
                <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm">
                  <span className="mr-2">👤</span>
                  Customer: {customerName}
                  <button 
                    onClick={clearCustomerFilter}
                    className="ml-2 text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors duration-200"
                    aria-label="Clear filter"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </button>
                </span>
              </div>
            )}
            
            <Button 
              onClick={() => {}}
              variant="secondary"
              className="transition-all duration-300 hover:shadow-md bg-white/20 backdrop-blur-sm text-white border-white/30"
              icon={RiFilterLine}
            >
              Filter
            </Button>
            
            <Button 
              onClick={onAddContract}
              variant="primary"
              className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-300/20"
              icon={RiAddLine}
            >
              New Contract
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 