import { useState, useEffect } from 'react';
import { Customer } from '../mock_customers';
import { RiEyeLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import Link from 'next/link';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const [animatedRows, setAnimatedRows] = useState<{[key: string]: boolean}>({});
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Animation effect on mount
  useEffect(() => {
    const animationDelay = 50; // ms between each row animation
    
    customers.forEach((customer, index) => {
      setTimeout(() => {
        setAnimatedRows(prev => ({
          ...prev,
          [customer.id]: true
        }));
      }, index * animationDelay);
    });
  }, [customers]);

  // Function to get the first letter of company name for avatar
  const getInitial = (name: string | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Get gradient colors based on customer status
  const getStatusGradient = (status: string | undefined) => {
    if (status === 'active') {
      return 'from-emerald-400 to-teal-500';
    } else {
      return 'from-rose-400 to-pink-500';
    }
  };

  // Get background color for row hover effect
  const getRowHoverBg = (status: string | undefined) => {
    if (status === 'active') {
      return 'hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10';
    } else {
      return 'hover:bg-rose-50/40 dark:hover:bg-rose-900/10';
    }
  };

  // Column headers with icons
  const columnHeaders = [
    { id: 'customer', label: 'Customer', icon: '👥' },
    { id: 'clientNumber', label: 'Client Number', icon: '🔢' },
    { id: 'branch', label: 'Branch', icon: '🏢' },
    { id: 'category', label: 'Category', icon: '📂' },
    { id: 'contracts', label: 'Contracts', icon: '📄' },
    { id: 'status', label: 'Status', icon: '⭐' },
    { id: 'actions', label: 'Actions', icon: '⚙️' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-xl -z-10"></div>
      <div className="absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-purple-400/20 rounded-full blur-xl -z-10"></div>
      
      <div className="overflow-x-auto relative">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
          {/* Enhanced table header with gradient and 3D effect */}
          <thead className="bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 dark:from-gray-800/90 dark:via-purple-900/20 dark:to-gray-800/90 transition-colors duration-300 sticky top-0 z-10">
            <tr className="shadow-sm">
              {columnHeaders.map((column) => (
                <th 
                  key={column.id}
                  scope="col" 
                  className={`px-6 py-4 text-left text-xs font-medium tracking-wider transition-all duration-300 ${
                    column.id === 'actions' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className={`flex ${column.id === 'actions' ? 'justify-end' : 'items-center'} space-x-1.5`}>
                    <span className="inline-block w-5 text-center opacity-70">{column.icon}</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 font-semibold uppercase">
                      {column.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table body with enhanced styling */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 transition-colors duration-200">
            {customers.map((customer) => (
              <tr 
                key={customer.id} 
                className={`
                  transition-all duration-500 ease-out
                  ${getRowHoverBg(customer?.status)}
                  ${hoveredRow === customer.id ? 'shadow-md dark:shadow-gray-900/50 z-10 scale-[1.01] relative' : ''}
                  ${animatedRows[customer.id] ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}
                `}
                onMouseEnter={() => setHoveredRow(customer.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 dark:from-purple-600 dark:to-indigo-700 flex items-center justify-center text-white font-medium shadow-md transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105">
                      {getInitial(customer?.companyName)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer?.companyName || 'N/A'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{customer?.shortName || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-lg inline-block shadow-sm">
                    {customer?.clientNumber || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {customer?.branch || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-700/30 px-3 py-1 rounded-lg inline-block shadow-sm">
                    {customer?.clientCategory || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full inline-block min-w-[2.5rem] text-center shadow-sm">
                    {customer?.contractsCount || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-3 py-1.5 text-xs font-medium rounded-lg inline-flex items-center
                    bg-gradient-to-r ${getStatusGradient(customer?.status)} text-white shadow-sm
                    transform transition-all duration-300 hover:scale-105 hover:shadow-md
                  `}>
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80 mr-1.5 animate-pulse"></span>
                    {customer?.status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-1 items-center">
                    {customer?.id ? (
                      <Link href={`/customers/${customer.id}`}>
                        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm hover:shadow-md">
                          <RiEyeLine className="h-5 w-5" />
                        </button>
                      </Link>
                    ) : (
                      <button disabled className="text-gray-400 cursor-not-allowed flex items-center justify-center w-9 h-9">
                        <RiEyeLine className="h-5 w-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => customer && onEdit(customer)}
                      disabled={!customer}
                      className={`
                        flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md
                        ${customer 
                          ? "text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30" 
                          : "text-gray-400 cursor-not-allowed"}
                      `}
                    >
                      <RiEditLine className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => customer && onDelete(customer)}
                      disabled={!customer}
                      className={`
                        flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md
                        ${customer 
                          ? "text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/30" 
                          : "text-gray-400 cursor-not-allowed"}
                      `}
                    >
                      <RiDeleteBinLine className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 