import { useState, useEffect } from 'react';
import { RiAddLine, RiSearchLine, RiFilterLine, RiCloseLine, RiCheckLine, RiUserLine } from 'react-icons/ri';
import { StatusFilter } from '../mock_customers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface CustomerHeaderProps {
  onAddClick: () => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
}

type AdvancedFilter = 'mostContracts' | 'latestCustomers' | 'oldestCustomers' | null;

export default function CustomerHeader({ 
  onAddClick, 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}: CustomerHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    setAnimateBackground(true);
  }, []);

  // Function to get the display text for the selected filter
  const getFilterText = (filter: AdvancedFilter): string => {
    switch (filter) {
      case 'mostContracts':
        return 'Most Contracts';
      case 'latestCustomers':
        return 'Latest Customers';
      case 'oldestCustomers':
        return 'Oldest Customers';
      default:
        return '';
    }
  };

  // Apply filter and close dropdown
  const applyFilter = (filter: AdvancedFilter) => {
    setAdvancedFilter(filter);
    setShowFilters(false);
    // Here you would also call a function to actually filter the data
    // For example: onAdvancedFilterChange(filter);
  };

  // Clear filter
  const clearFilter = () => {
    setAdvancedFilter(null);
    // Here you would also clear the actual filter
    // For example: onAdvancedFilterChange(null);
  };

  // Get status display text
  const getStatusText = (status: StatusFilter): string => {
    switch (status) {
      case 'all':
        return 'All Status';
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      default:
        return 'All Status';
    }
  };

  return (
    <div className="mb-6 overflow-hidden">
      {/* Enhanced 3D background with gradient from dark to light (left to right) */}
      <div className={`bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 
        rounded-3xl p-6 pb-24 relative overflow-hidden shadow-xl transition-all duration-700 ease-out
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
              <RiUserLine className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-md">Customers</h1>
              <p className="text-primary-100 dark:text-primary-200">Manage your customer relationships</p>
            </div>
          </div>
          
          <Button 
            onClick={onAddClick}
            variant="primary"
            className="mt-4 md:mt-0 px-5 py-3 text-base shadow-lg hover:shadow-xl bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-300/20"
            icon={RiAddLine}
          >
            Add Customer
          </Button>
        </div>
      </div>
      
      {/* Search and filters card with enhanced 3D effect and modern color scheme */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-2xl mx-6 -mt-16 p-5 relative z-20 border-2 border-purple-200/60 dark:border-purple-500/30 transition-all duration-500 hover:shadow-xl">
        {/* Decorative elements for search card - Made more visible with purple tones */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-300/30 to-indigo-400/30 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-300/30 to-purple-400/30 rounded-full -mb-10 blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-lg"></div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 relative z-10">
          <div className="relative flex-1">
            {/* Điều chỉnh vị trí kính lúp và padding của input */}
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none z-30" />
              <Input
                type="text"
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search customers..."
                className="py-2.5 pl-12 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <Button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                variant="secondary"
                className={`relative transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-purple-200 dark:border-purple-700/50 ${
                  statusFilter === 'active' 
                    ? 'text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/70' 
                    : statusFilter === 'inactive'
                      ? 'text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700/70'
                      : ''
                }`}
              >
                {getStatusText(statusFilter)}
                <svg className="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
              
              {showStatusDropdown && (
                <div className="absolute left-0 mt-1 w-40 rounded-xl shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/95 z-50 overflow-hidden border-2 border-purple-200/50 dark:border-purple-700/30 p-1.5 animate-fadeIn">
                  <div className="space-y-1">
                    <button
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 
                        ${statusFilter === 'all' ? 'font-medium' : ''} 
                        bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:shadow-inner`}
                      onClick={() => {
                        onStatusFilterChange('all');
                        setShowStatusDropdown(false);
                      }}
                    >
                      All Status
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 
                        ${statusFilter === 'active' ? 'font-medium' : ''} 
                        bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:shadow-inner`}
                      onClick={() => {
                        onStatusFilterChange('active');
                        setShowStatusDropdown(false);
                      }}
                    >
                      Active
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 
                        ${statusFilter === 'inactive' ? 'font-medium' : ''} 
                        bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:shadow-inner`}
                      onClick={() => {
                        onStatusFilterChange('inactive');
                        setShowStatusDropdown(false);
                      }}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              {advancedFilter ? (
                <div className="btn-filter-active transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-purple-200 dark:border-purple-700/50">
                  <span>{getFilterText(advancedFilter)}</span>
                  <button 
                    onClick={clearFilter}
                    className="ml-2 text-primary-500 hover:text-primary-700 dark:text-indigo-300 dark:hover:text-indigo-200 transition-colors duration-200"
                    aria-label="Clear filter"
                  >
                    <RiCloseLine className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowFilters(!showFilters)}
                  variant="secondary"
                  className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-purple-200 dark:border-purple-700/50"
                  icon={RiFilterLine}
                >
                  More Filters
                </Button>
              )}
              
              {showFilters && !advancedFilter && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/95 z-50 overflow-hidden border-2 border-purple-200/50 dark:border-purple-700/30 p-1.5 animate-fadeIn">
                  <div className="space-y-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 hover:shadow-inner"
                      onClick={() => applyFilter('mostContracts')}
                    >
                      Most Contracts
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 hover:shadow-inner"
                      onClick={() => applyFilter('latestCustomers')}
                    >
                      Latest Customers
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 hover:bg-purple-50/70 dark:hover:bg-purple-900/20 hover:shadow-inner"
                      onClick={() => applyFilter('oldestCustomers')}
                    >
                      Oldest Customers
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}