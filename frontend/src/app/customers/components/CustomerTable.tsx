import { Customer } from '../mock_customers';
import { RiEyeLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import Link from 'next/link';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  // Function to get the first letter of company name for avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
      <thead className="table-header">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Customer
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Client Number
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Branch
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Category
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Contracts
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
        {customers.map((customer) => (
          <tr key={customer.id} className="table-row">
            <td className="table-cell">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 font-medium transition-colors duration-200">
                  {getInitial(customer.companyName)}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.companyName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{customer.shortName}</div>
                </div>
              </div>
            </td>
            <td className="table-cell">
              {customer.clientNumber}
            </td>
            <td className="table-cell">
              {customer.branch}
            </td>
            <td className="table-cell">
              {customer.clientCategory}
            </td>
            <td className="table-cell">
              {customer.contractsCount}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`${
                customer.status === 'active' 
                  ? 'badge badge-success' 
                  : 'badge badge-danger'
              }`}>
                {customer.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-2 items-center">
                <Link href={`/customers/${customer.id}`}>
                  <button className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 flex items-center justify-center w-8 h-8 transition-colors duration-200">
                    <RiEyeLine className="h-5 w-5" />
                  </button>
                </Link>
                <button 
                  onClick={() => onEdit(customer)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center justify-center w-8 h-8 transition-colors duration-200"
                >
                  <RiEditLine className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onDelete(customer)}
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center justify-center w-8 h-8 transition-colors duration-200"
                >
                  <RiDeleteBinLine className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 