'use client';

import { RiFileTextLine, RiUserLine } from 'react-icons/ri';
import clsx from 'clsx';
import Link from 'next/link';
import { ContractNode } from '../types';

interface ContractDetailProps {
  contract: ContractNode;
}

export default function ContractDetail({ contract }: ContractDetailProps) {
  return (
    <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-indigo-900/30 rounded-xl shadow-soft dark:shadow-indigo-900/10 p-6 h-[calc(100vh-180px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-indigo-100">{contract.title}</h2>
          <p className="text-sm text-gray-500 dark:text-indigo-300/70">Contract ID: {contract.id}</p>
        </div>
        <span className={clsx(
          'px-4 py-1.5 rounded-full text-sm font-medium',
          contract.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
          contract.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        )}>
          {contract.status}
        </span>
      </div>

      {/* Content based on contract type */}
      {contract.type === 'liability' && (
        <div className="space-y-6">
          {/* Segment Information */}
          <div className="bg-secondary-50/50 dark:bg-indigo-900/10 rounded-lg p-5 border border-primary-200 dark:border-indigo-800/30">
            <h3 className="text-base font-semibold text-primary-600 dark:text-indigo-300 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-indigo-900/50 text-primary-600 dark:text-indigo-300 flex items-center justify-center mr-2">
                <RiFileTextLine className="w-4 h-4" />
              </span>
              Segment Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Branch</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.segment?.branch}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Product</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.segment?.product}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.segment?.type}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-secondary-50/50 dark:bg-indigo-900/10 rounded-lg p-5 border border-primary-200 dark:border-indigo-800/30">
            <h3 className="text-base font-semibold text-primary-600 dark:text-indigo-300 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-indigo-900/50 text-primary-600 dark:text-indigo-300 flex items-center justify-center mr-2">
                <RiFileTextLine className="w-4 h-4" />
              </span>
              Customer Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-secondary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Name</p>
                <Link 
                  href={`/customers/${contract.customer?.id}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-indigo-300"
                >
                  {contract.customer?.name}
                </Link>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-secondary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.customer?.email}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-secondary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.customer?.type}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {contract.type === 'issuing' && (
        <div className="space-y-6">
          {/* Segment Information */}
          <div className="bg-secondary-50/50 dark:bg-indigo-900/10 rounded-lg p-5 border border-primary-200 dark:border-indigo-800/30">
            <h3 className="text-base font-semibold text-primary-600 dark:text-indigo-300 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-indigo-900/50 text-primary-600 dark:text-indigo-300 flex items-center justify-center mr-2">
                <RiFileTextLine className="w-4 h-4" />
              </span>
              Segment Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Branch</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.segment?.branch}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Product</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.segment?.product}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.segment?.type}</p>
              </div>
            </div>
          </div>

          {/* Liability Information */}
          <div className="bg-secondary-50/50 dark:bg-indigo-900/10 rounded-lg p-5 border border-primary-200 dark:border-indigo-800/30">
            <h3 className="text-base font-semibold text-primary-600 dark:text-indigo-300 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-indigo-900/50 text-primary-600 dark:text-indigo-300 flex items-center justify-center mr-2">
                <RiFileTextLine className="w-4 h-4" />
              </span>
              Liability Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-secondary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Contract Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.liability?.contractName}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-secondary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.liability?.customerName}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-secondary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.liability?.type}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-secondary-50/50 dark:bg-indigo-900/10 rounded-lg p-5 border border-primary-200 dark:border-indigo-800/30">
            <h3 className="text-base font-semibold text-primary-600 dark:text-indigo-300 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-indigo-900/50 text-primary-600 dark:text-indigo-300 flex items-center justify-center mr-2">
                <RiFileTextLine className="w-4 h-4" />
              </span>
              Financial Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Currency</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.financial?.currency}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Available</p>
                <p className="font-medium text-gray-900 dark:text-white">${contract.financial?.available?.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Balance</p>
                <p className="font-medium text-gray-900 dark:text-white">${contract.financial?.balance?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {contract.type === 'transaction' && (
        <div className="space-y-8">
          {/* Transaction Details */}
          <div className="bg-secondary-50/50 dark:bg-indigo-900/10 rounded-lg p-5 mt-6 border border-primary-200 dark:border-indigo-800/30">
            <h3 className="text-base font-semibold text-primary-600 dark:text-indigo-300 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-indigo-900/50 text-primary-600 dark:text-indigo-300 flex items-center justify-center mr-2">
                <RiFileTextLine className="w-4 h-4" />
              </span>
                Transaction Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.transactionDetails?.type}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Value</p>
                <p className="font-medium text-gray-900 dark:text-white">${contract.value.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{new Date(contract.startDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary-100 dark:border-indigo-800/30">
                <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Issue Contract</p>
                <p className="font-medium text-gray-900 dark:text-white">{contract.transactionDetails?.issueContract}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Common Contract Details */}
      <div className="bg-secondary-50/50 dark:bg-indigo-900/10 rounded-lg p-5 mt-6 border border-primary-200 dark:border-indigo-800/30">
        <h3 className="text-base font-semibold text-primary-600 dark:text-indigo-300 mb-4 flex items-center">
          <span className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-indigo-900/50 text-primary-600 dark:text-indigo-300 flex items-center justify-center mr-2">
            <RiFileTextLine className="w-4 h-4" />
          </span>
          Contract Details
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Start Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(contract.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">End Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(contract.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary-100 dark:border-indigo-800/30">
            <p className="text-sm text-gray-500 dark:text-indigo-300/70 mb-1">Total Value</p>
            <p className="font-medium text-gray-900 dark:text-white">${contract.value.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
          Download
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary-500 dark:bg-indigo-600 hover:bg-primary-600 dark:hover:bg-indigo-700 rounded-lg">
          Edit Contract
        </button>
      </div>
    </div>
  );
} 