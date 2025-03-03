import { useState } from 'react';
import { RiAddLine, RiSearchLine, RiFilterLine, RiCloseLine } from 'react-icons/ri';
import { StatusFilter } from '../mock_customers';

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

  return (
    <div className="card mb-6 bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 dark:shadow-lg dark:shadow-indigo-900/10">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-indigo-100">Customers</h1>
            <p className="text-gray-500 dark:text-indigo-300/70">Manage your customer relationships</p>
          </div>
          <button
            onClick={onAddClick}
            className="mt-4 md:mt-0 px-4 py-3 text-base font-medium text-white bg-primary-500 hover:bg-primary-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg shadow-sm dark:shadow-indigo-900/30 inline-flex items-center justify-center whitespace-nowrap transition-colors duration-200"
          >
            <RiAddLine className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiSearchLine className="h-5 w-5 text-gray-400 dark:text-indigo-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
              className="input pl-10 dark:bg-gray-700/70 dark:border-gray-600 dark:text-white dark:placeholder-indigo-300/50 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/30"
              placeholder="Search customers..."
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-indigo-500/50 transition-all duration-200 cursor-pointer bg-white dark:bg-gray-700/70 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <div className="relative">
              {advancedFilter ? (
                <div className="flex items-center px-4 py-2 bg-primary-50 dark:bg-indigo-900/50 text-primary-700 dark:text-indigo-200 border border-primary-300 dark:border-indigo-700 rounded-lg transition-colors duration-200">
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
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 border rounded-lg flex items-center transition-colors duration-200 ${
                    showFilters 
                      ? 'bg-primary-50 dark:bg-indigo-900/50 text-primary-700 dark:text-indigo-200 border-primary-300 dark:border-indigo-700 hover:bg-primary-100 dark:hover:bg-indigo-800/70' 
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <RiFilterLine className={`h-5 w-5 mr-2 ${showFilters ? 'text-primary-600 dark:text-indigo-300' : 'text-gray-400 dark:text-gray-300'}`} />
                  More Filters
                </button>
              )}
              
              {showFilters && !advancedFilter && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-indigo-900/50 dark:shadow-indigo-900/20 z-10 overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                  <div className="py-1">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-indigo-900/30 hover:text-primary-700 dark:hover:text-indigo-200 w-full text-left transition-colors duration-200"
                      onClick={() => applyFilter('mostContracts')}
                    >
                      Most Contracts
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-indigo-900/30 hover:text-primary-700 dark:hover:text-indigo-200 w-full text-left transition-colors duration-200"
                      onClick={() => applyFilter('latestCustomers')}
                    >
                      Latest Customers
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-indigo-900/30 hover:text-primary-700 dark:hover:text-indigo-200 w-full text-left transition-colors duration-200"
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