'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiFileTextLine, RiBuildingLine, RiUserLine, RiCalendarLine, RiEditLine, RiInformationLine, RiListCheck2, RiShieldUserLine, RiBarChartBoxLine } from 'react-icons/ri';
import Link from 'next/link';
import { MOCK_CUSTOMERS, Customer } from '../mock_customers';
import EditCustomerModal from '../components/EditCustomerModal';
import Button from '@/components/ui/Button';

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

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>(
    customer ? {
      companyName: customer.companyName,
      shortName: customer.shortName,
      clientNumber: customer.clientNumber,
      clientTypeCode: customer.clientTypeCode,
      reasonCode: customer.reasonCode,
      reason: customer.reason,
      institutionCode: customer.institutionCode,
      branch: customer.branch,
      clientCategory: customer.clientCategory,
      productCategory: customer.productCategory,
      status: customer.status,
      contractsCount: customer.contractsCount
    } : {} as Omit<Customer, 'id'>
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the changes to the backend
    console.log('Saving changes:', formData);
    setIsEditModalOpen(false);
  };

  if (!customer) {
    return (
      <div className="p-4 pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-red-500 dark:text-red-400 text-xl font-semibold p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-red-200 dark:border-red-800">
          Customer not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Back button and header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors duration-200 group"
          >
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md mr-2 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-all duration-200">
              <RiArrowLeftLine className="text-primary-500 dark:text-primary-400" />
            </div>
            <span className="font-medium">Back to Customers</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-100 dark:border-purple-900/20">
            <div className="flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl mr-4">
                <RiBuildingLine className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{customer.companyName}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                  <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 rounded-full text-sm font-medium mr-2">
                    ID: {customer.id}
                  </span>
                  <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 rounded-full text-sm font-medium">
                    {customer.clientNumber}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium mr-4 ${
                customer.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-1.5 ${
                  customer.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {customer.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <Button
                onClick={() => setIsEditModalOpen(true)}
                variant="primary"
                icon={RiEditLine}
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Grid layout for details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Company Information Card */}
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-xl border-2 border-purple-100 dark:border-purple-900/20 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
                <RiBuildingLine className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Company Information</h3>
            </div>
            <div className="p-6">
              {/* Company details */}
              <div className="space-y-4">
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Company Name</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.companyName}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Short Name</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.shortName}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Client Number</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.clientNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information Card */}
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-xl border-2 border-purple-100 dark:border-purple-900/20 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
                <RiUserLine className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Client Information</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Client Type</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.clientTypeCode}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Branch</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.branch}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Institution Code</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.institutionCode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Information Card */}
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-xl border-2 border-purple-100 dark:border-purple-900/20 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
                <RiBarChartBoxLine className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Category Information</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Client Category</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.clientCategory}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Product Category</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.productCategory}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl">
                  <label className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 block mb-1">Reason</label>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.reason} ({customer.reasonCode})</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Section */}
        <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-xl border-2 border-purple-100 dark:border-purple-900/20 overflow-hidden transition-all duration-300 hover:shadow-2xl mb-8">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiFileTextLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Contracts</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contracts.map((contract: any) => (
                <div key={contract.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-purple-100 dark:border-purple-900/20">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200 text-lg">{contract.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <RiListCheck2 className="mr-1.5" />
                      <span>{contract.type}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">${contract.value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <RiCalendarLine className="mr-1.5" />
                      <span>{contract.startDate}</span>
                      <span className="mx-2">-</span>
                      <span>{contract.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
              {contracts.length === 0 && (
                <div className="col-span-2 text-center py-8 bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl">
                  <RiInformationLine className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">No contracts found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          customer={customer}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
}