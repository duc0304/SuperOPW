'use client';

import { useParams, useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiFileTextLine, RiBuildingLine, RiUserLine, RiCalendarLine } from 'react-icons/ri';
import Link from 'next/link';
import { MOCK_CUSTOMERS } from '../mock_customers';

// Mock contracts data
const MOCK_CONTRACTS = {
  '1': [
    {
      id: 'c1',
      name: 'Enterprise Service Agreement',
      type: 'Service',
      value: 25000,
      startDate: '2023-01-15',
      endDate: '2024-01-14',
      status: 'active'
    },
    {
      id: 'c2',
      name: 'Software License Agreement',
      type: 'License',
      value: 12000,
      startDate: '2023-03-01',
      endDate: '2024-02-28',
      status: 'active'
    }
  ]
};

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // Get customer from mock data
  const customer = MOCK_CUSTOMERS.find(c => c.id === params.id);
  const contracts = (MOCK_CONTRACTS as any)[params.id as string] || [];

  if (!customer) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center dark:bg-gray-900 transition-colors duration-200">
        <div className="text-red-500 dark:text-red-400">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back button and header */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors duration-200"
          >
            <RiArrowLeftLine className="mr-2" /> Back to Customers
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{customer.companyName}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Customer ID: {customer.id} • {customer.clientNumber}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`${
                customer.status === 'active' 
                  ? 'badge badge-success' 
                  : 'badge badge-danger'
              }`}>
                {customer.status}
              </span>
            </div>
          </div>
        </div>

        {/* Grid layout for details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Company Information Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-purple-600 dark:text-purple-300 transition-colors duration-200">Company Information</h3>
            </div>
            <div className="p-6">
              {/* Company details */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Company Name</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.companyName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Short Name</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.shortName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Client Number</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.clientNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-purple-600 dark:text-purple-300 transition-colors duration-200">Client Information</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Client Type</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.clientTypeCode}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Branch</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.branch}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Institution Code</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.institutionCode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contracts Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-purple-600 dark:text-purple-300 transition-colors duration-200">Contracts</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {contracts.map((contract: any) => (
                  <div key={contract.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{contract.name}</h4>
                      <span className={`${
                        contract.status === 'active' ? 'badge badge-success' : 'badge badge-danger'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-200">
                      {contract.type} • ${contract.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {contract.startDate} - {contract.endDate}
                    </p>
                  </div>
                ))}
                {contracts.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    No contracts found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Link href="/customers">
            <button className="btn btn-secondary">
              Back to List
            </button>
          </Link>
          <button className="btn btn-primary">
            Edit Customer
          </button>
        </div>
      </div>
    </div>
  );
}