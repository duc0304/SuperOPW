'use client';

interface ContractHeaderProps {
  customerName?: string;
  clearCustomerFilter?: () => void;
}

export default function ContractHeader({ customerName, clearCustomerFilter }: ContractHeaderProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-indigo-100">
            {customerName ? `Contracts for ${customerName}` : 'Contract Management'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-indigo-300/70 mt-1">
            {customerName ? 
              `Viewing all contracts associated with ${customerName}` : 
              'Manage and track all your contracts in one place'}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            Import
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-500 dark:bg-indigo-600 hover:bg-primary-600 dark:hover:bg-indigo-700 rounded-lg shadow-sm">
            + New Contract
          </button>
        </div>
      </div>

      {/* Customer filter badge (if filtering by customer) */}
      {customerName && (
        <div className="mb-4 flex items-center">
          <span className="bg-primary-100 dark:bg-indigo-900/30 text-primary-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            Customer: {customerName}
            <button 
              onClick={clearCustomerFilter}
              className="ml-2 text-primary-700 dark:text-indigo-300 hover:text-primary-900 dark:hover:text-indigo-200 transition-colors duration-200"
              aria-label="Clear filter"
            >
              ×
            </button>
          </span>
        </div>
      )}
    </div>
  );
} 